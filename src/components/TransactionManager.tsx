import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, SUPPORTED_CURRENCIES } from "@/utils/currencies";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
}

interface TransactionForm {
  type: "income" | "expense";
  amount: string;
  category: string;
  description: string;
  date: string;
  currency: string;
}

interface TransactionManagerProps {
  onTransactionUpdate?: () => void;
}

const TransactionManager = ({ onTransactionUpdate }: TransactionManagerProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userCurrency, setUserCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TransactionForm>({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    currency: "USD",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("currency")
        .eq("user_id", user.id)
        .single();

      if (profile?.currency) {
        setUserCurrency(profile.currency);
        setForm(prev => ({ ...prev, currency: profile.currency }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }

      // Type cast and validate the data
      const validatedTransactions: Transaction[] = (data || []).map(transaction => ({
        ...transaction,
        type: transaction.type as "income" | "expense"
      }));

      setTransactions(validatedTransactions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddTransaction = async () => {
    if (!form.amount || !form.category || !form.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          type: form.type,
          amount: parseFloat(form.amount),
          category: form.category,
          description: form.description,
          date: form.date,
          currency: form.currency,
        },
      ]).select().single();

      if (error) throw error;

      // Get AI advice for this transaction
      try {
        const adviceResponse = await fetch('/functions/v1/generate-transaction-advice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction: data }),
        });

        if (adviceResponse.ok) {
          const { advice } = await adviceResponse.json();
          toast({
            title: "Transaction Added & AI Advice",
            description: advice,
            duration: 8000,
          });
        } else {
          toast({
            title: "Success",
            description: "Transaction added successfully!",
          });
        }
      } catch (adviceError) {
        toast({
          title: "Success",
          description: "Transaction added successfully!",
        });
      }

      // Trigger dashboard widget refresh
      if (onTransactionUpdate) {
        onTransactionUpdate();
      }

      setForm({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        currency: form.currency,
      });
      fetchTransactions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction deleted successfully!",
      });
      fetchTransactions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const formatCurrencyDisplay = (amount: number, currency: string) => {
    return formatCurrency(amount, currency);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add Transaction Form */}
      <Card className="bg-gradient-to-br from-background to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2 text-primary" />
            Add Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={form.type} onValueChange={(value: "income" | "expense") => setForm({ ...form, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">
                    <div className="flex items-center">
                      <ArrowUpCircle className="h-4 w-4 mr-2 text-primary" />
                      Income
                    </div>
                  </SelectItem>
                  <SelectItem value="expense">
                    <div className="flex items-center">
                      <ArrowDownCircle className="h-4 w-4 mr-2 text-destructive" />
                      Expense
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Bills & Utilities">Bills & Utilities</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={form.currency} onValueChange={(value) => setForm({ ...form, currency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleAddTransaction} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? "Adding..." : "Add Transaction"}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card className="bg-gradient-to-br from-background to-accent/5">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet. Add your first transaction!
              </p>
            ) : (
              transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {transaction.type === "income" ? (
                        <ArrowUpCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${
                        transaction.type === "income" ? "text-primary" : "text-destructive"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}{formatCurrencyDisplay(transaction.amount, transaction.currency)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManager;