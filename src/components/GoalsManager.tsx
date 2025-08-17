import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Trash2, Target, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SUPPORTED_CURRENCIES, formatCurrency } from "@/utils/currencies";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  category: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  currency: string;
}

const GoalsManager = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: '',
    target_amount: '',
    target_date: '',
    currency: 'USD'
  });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to fetch goals');
    }
  };

  const addGoal = async () => {
    if (!newGoal.title || !newGoal.category || !newGoal.target_amount || !newGoal.target_date) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('goals')
        .insert([{
          user_id: user?.id,
          title: newGoal.title,
          category: newGoal.category,
          target_amount: parseFloat(newGoal.target_amount),
          target_date: newGoal.target_date,
          currency: newGoal.currency,
          current_amount: 0
        }]);

      if (error) throw error;

      toast.success('Goal added successfully');
      setNewGoal({ title: '', category: '', target_amount: '', target_date: '', currency: 'USD' });
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Failed to add goal');
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Goal deleted successfully');
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const updateGoalProgress = async (id: string, newAmount: number) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ current_amount: newAmount })
        .eq('id', id);

      if (error) throw error;

      toast.success('Goal progress updated');
      fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Financial Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Goal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="e.g., Emergency Fund"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Savings"
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="target_amount">Target Amount</Label>
            <Input
              id="target_amount"
              type="number"
              placeholder="0.00"
              value={newGoal.target_amount}
              onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="target_date">Target Date</Label>
            <Input
              id="target_date"
              type="date"
              value={newGoal.target_date}
              onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={newGoal.currency} onValueChange={(value) => setNewGoal({ ...newGoal, currency: value })}>
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
        <Button onClick={addGoal} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current_amount / goal.target_amount) * 100;
            return (
              <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.category}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(goal.current_amount, goal.currency)}</span>
                    <span>{formatCurrency(goal.target_amount, goal.currency)}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {progress.toFixed(1)}% complete • Target: {new Date(goal.target_date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Update progress"
                    onBlur={(e) => {
                      if (e.target.value) {
                        updateGoalProgress(goal.id, parseFloat(e.target.value));
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
          {goals.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No goals created yet. Add your first goal above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsManager;