import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, TrendingUp, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SUPPORTED_CURRENCIES, formatCurrency } from "@/utils/currencies";
import { toast } from "sonner";

interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  current_value: number;
  purchase_date: string;
  currency: string;
}

const InvestmentManager = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: '',
    amount: '',
    current_value: '',
    purchase_date: '',
    currency: 'USD'
  });

  useEffect(() => {
    if (user) {
      fetchInvestments();
    }
  }, [user]);

  const fetchInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
      toast.error('Failed to fetch investments');
    }
  };

  const addInvestment = async () => {
    if (!newInvestment.name || !newInvestment.type || !newInvestment.amount || !newInvestment.current_value || !newInvestment.purchase_date) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('investments')
        .insert([{
          user_id: user?.id,
          name: newInvestment.name,
          type: newInvestment.type,
          amount: parseFloat(newInvestment.amount),
          current_value: parseFloat(newInvestment.current_value),
          purchase_date: newInvestment.purchase_date,
          currency: newInvestment.currency
        }]);

      if (error) throw error;

      toast.success('Investment added successfully');
      setNewInvestment({ name: '', type: '', amount: '', current_value: '', purchase_date: '', currency: 'USD' });
      fetchInvestments();
    } catch (error) {
      console.error('Error adding investment:', error);
      toast.error('Failed to add investment');
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Investment deleted successfully');
      fetchInvestments();
    } catch (error) {
      console.error('Error deleting investment:', error);
      toast.error('Failed to delete investment');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Investment Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Investment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <Label htmlFor="name">Investment Name</Label>
            <Input
              id="name"
              placeholder="e.g., Apple Stock"
              value={newInvestment.name}
              onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={newInvestment.type} onValueChange={(value) => setNewInvestment({ ...newInvestment, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stocks">Stocks</SelectItem>
                <SelectItem value="bonds">Bonds</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
                <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                <SelectItem value="etf">ETF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Purchase Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={newInvestment.amount}
              onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="current_value">Current Value</Label>
            <Input
              id="current_value"
              type="number"
              placeholder="0.00"
              value={newInvestment.current_value}
              onChange={(e) => setNewInvestment({ ...newInvestment, current_value: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              value={newInvestment.purchase_date}
              onChange={(e) => setNewInvestment({ ...newInvestment, purchase_date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={newInvestment.currency} onValueChange={(value) => setNewInvestment({ ...newInvestment, currency: value })}>
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
        </div>
        <Button onClick={addInvestment} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Investment
        </Button>

        {/* Investment List */}
        <div className="space-y-3">
          {investments.map((investment) => {
            const gainLoss = investment.current_value - investment.amount;
            const gainLossPercentage = ((gainLoss / investment.amount) * 100).toFixed(2);
            const isGain = gainLoss >= 0;
            
            return (
              <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{investment.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{investment.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(investment.current_value, investment.currency)}</p>
                      <p className={`text-sm ${isGain ? 'text-green-600' : 'text-red-600'}`}>
                        {isGain ? '+' : ''}{formatCurrency(gainLoss, investment.currency)} ({gainLossPercentage}%)
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Purchased: {formatCurrency(investment.amount, investment.currency)} on {new Date(investment.purchase_date).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteInvestment(investment.id)}
                  className="text-destructive hover:text-destructive ml-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          {investments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No investments added yet. Add your first investment above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentManager;