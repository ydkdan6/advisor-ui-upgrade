import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Wallet, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/currencies";

interface QuickStats {
  activeGoals: number;
  totalSavings: number;
  totalInvestments: number;
  budgetCategories: number;
  currency: string;
}

const QuickStatsWidget = () => {
  const [stats, setStats] = useState<QuickStats>({
    activeGoals: 0,
    totalSavings: 0,
    totalInvestments: 0,
    budgetCategories: 0,
    currency: "USD",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get user's preferred currency
      const { data: profile } = await supabase
        .from("profiles")
        .select("currency")
        .eq("user_id", user.id)
        .single();

      const userCurrency = profile?.currency || "USD";

      // Fetch goals count
      const { count: goalsCount } = await supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch total savings
      const { data: savings } = await supabase
        .from("savings")
        .select("balance")
        .eq("user_id", user.id)
        .eq("currency", userCurrency);

      const totalSavings = savings?.reduce((sum, s) => sum + s.balance, 0) || 0;

      // Fetch total investments
      const { data: investments } = await supabase
        .from("investments")
        .select("current_value")
        .eq("user_id", user.id)
        .eq("currency", userCurrency);

      const totalInvestments = investments?.reduce((sum, i) => sum + i.current_value, 0) || 0;

      // Fetch budget categories count
      const { count: budgetCount } = await supabase
        .from("budgets")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setStats({
        activeGoals: goalsCount || 0,
        totalSavings,
        totalInvestments,
        budgetCategories: budgetCount || 0,
        currency: userCurrency,
      });
    } catch (error) {
      console.error("Error fetching quick stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrencyDisplay = (amount: number) => {
    return formatCurrency(amount, stats.currency);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="goals">Goals & Budget</TabsTrigger>
            <TabsTrigger value="wealth">Wealth</TabsTrigger>
          </TabsList>
          
          <TabsContent value="goals" className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Active Goals</span>
              </div>
              <Badge variant="secondary">{stats.activeGoals}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-accent-foreground" />
                <span className="text-sm font-medium">Budget Categories</span>
              </div>
              <Badge variant="secondary">{stats.budgetCategories}</Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="wealth" className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Savings</span>
              </div>
              <span className="font-bold text-primary">{formatCurrencyDisplay(stats.totalSavings)}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-accent-foreground" />
                <span className="text-sm font-medium">Investments</span>
              </div>
              <span className="font-bold text-accent-foreground">{formatCurrencyDisplay(stats.totalInvestments)}</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuickStatsWidget;