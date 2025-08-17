import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SUPPORTED_CURRENCIES, formatCurrency } from "@/utils/currencies";
import { toast } from "sonner";

interface Budget {
  id: string;
  category: string;
  amount: number;
  currency: string;
  period: string;
}

const BudgetManager = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    currency: 'USD',
    period: 'monthly'
  });

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to fetch budgets');
    }
  };

  const addBudget = async () => {
    if (!newBudget.category || !newBudget.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('budgets')
        .insert([{
          user_id: user?.id,
          category: newBudget.category,
          amount: parseFloat(newBudget.amount),
          currency: newBudget.currency,
          period: newBudget.period
        }]);

      if (error) throw error;

      toast.success('Budget added successfully');
      setNewBudget({ category: '', amount: '', currency: 'USD', period: 'monthly' });
      fetchBudgets();
    } catch (error) {
      console.error('Error adding budget:', error);
      toast.error('Failed to add budget');
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Budget deleted successfully');
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Budget Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Groceries"
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={newBudget.amount}
              onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={newBudget.currency} onValueChange={(value) => setNewBudget({ ...newBudget, currency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="period">Period</Label>
            <Select value={newBudget.period} onValueChange={(value) => setNewBudget({ ...newBudget, period: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={addBudget} className="w-full">
              Add Budget
            </Button>
          </div>
        </div>

        {/* Budget List */}
        <div className="space-y-3">
          {budgets.map((budget) => (
            <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{budget.category}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(budget.amount, budget.currency)} per {budget.period}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteBudget(budget.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {budgets.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No budgets created yet. Add your first budget above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetManager;