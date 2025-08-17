import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PiggyBank, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SUPPORTED_CURRENCIES, formatCurrency } from "@/utils/currencies";
import { toast } from "sonner";

interface SavingsAccount {
  id: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
}

const SavingsManager = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [newAccount, setNewAccount] = useState({
    account_name: '',
    account_type: 'savings',
    balance: '',
    currency: 'USD'
  });

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('savings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching savings accounts:', error);
      toast.error('Failed to fetch savings accounts');
    }
  };

  const addAccount = async () => {
    if (!newAccount.account_name || !newAccount.balance) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('savings')
        .insert([{
          user_id: user?.id,
          account_name: newAccount.account_name,
          account_type: newAccount.account_type,
          balance: parseFloat(newAccount.balance),
          currency: newAccount.currency
        }]);

      if (error) throw error;

      toast.success('Savings account added successfully');
      setNewAccount({ account_name: '', account_type: 'savings', balance: '', currency: 'USD' });
      fetchAccounts();
    } catch (error) {
      console.error('Error adding savings account:', error);
      toast.error('Failed to add savings account');
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('savings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Savings account deleted successfully');
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting savings account:', error);
      toast.error('Failed to delete savings account');
    }
  };

  const updateBalance = async (id: string, newBalance: number) => {
    try {
      const { error } = await supabase
        .from('savings')
        .update({ balance: newBalance })
        .eq('id', id);

      if (error) throw error;

      toast.success('Balance updated successfully');
      fetchAccounts();
    } catch (error) {
      console.error('Error updating balance:', error);
      toast.error('Failed to update balance');
    }
  };

  const totalSavings = accounts.reduce((total, account) => {
    // Convert to USD for total (simplified)
    return total + account.balance;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5" />
          Savings Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Savings */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold">Total Savings</h3>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalSavings, 'USD')}</p>
          <p className="text-sm text-muted-foreground">{accounts.length} account(s)</p>
        </div>

        {/* Add New Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="account_name">Account Name</Label>
            <Input
              id="account_name"
              placeholder="e.g., Emergency Fund"
              value={newAccount.account_name}
              onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="account_type">Account Type</Label>
            <Select value={newAccount.account_type} onValueChange={(value) => setNewAccount({ ...newAccount, account_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="money_market">Money Market</SelectItem>
                <SelectItem value="cd">Certificate of Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              type="number"
              placeholder="0.00"
              value={newAccount.balance}
              onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={newAccount.currency} onValueChange={(value) => setNewAccount({ ...newAccount, currency: value })}>
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
        <Button onClick={addAccount} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Savings Account
        </Button>

        {/* Accounts List */}
        <div className="space-y-3">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{account.account_name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{account.account_type.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(account.balance, account.currency)}</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    type="number"
                    placeholder="Update balance"
                    className="max-w-40"
                    onBlur={(e) => {
                      if (e.target.value) {
                        updateBalance(account.id, parseFloat(e.target.value));
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteAccount(account.id)}
                className="text-destructive hover:text-destructive ml-4"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {accounts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No savings accounts added yet. Add your first account above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsManager;