import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Calendar, TrendingDown, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/currencies";

interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

interface SpendingAnalytics {
  topCategories: CategorySpending[];
  weeklySpend: number;
  dailyAverage: number;
  currency: string;
  totalSpend: number;
}

const SpendingAnalyticsWidget = () => {
  const [analytics, setAnalytics] = useState<SpendingAnalytics>({
    topCategories: [],
    weeklySpend: 0,
    dailyAverage: 0,
    currency: "USD",
    totalSpend: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpendingAnalytics();
  }, []);

  const fetchSpendingAnalytics = async () => {
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

      // Get last 7 days transactions
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: weeklyTransactions } = await supabase
        .from("transactions")
        .select("amount, category, type")
        .eq("user_id", user.id)
        .eq("currency", userCurrency)
        .eq("type", "expense")
        .gte("date", sevenDaysAgo.toISOString().split("T")[0]);

      // Get last 30 days for category analysis
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: monthlyTransactions } = await supabase
        .from("transactions")
        .select("amount, category, type")
        .eq("user_id", user.id)
        .eq("currency", userCurrency)
        .eq("type", "expense")
        .gte("date", thirtyDaysAgo.toISOString().split("T")[0]);

      const weeklySpend = weeklyTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalSpend = monthlyTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const dailyAverage = weeklySpend / 7;

      // Calculate category spending
      const categoryMap = new Map<string, { amount: number; count: number }>();
      
      monthlyTransactions?.forEach(transaction => {
        const existing = categoryMap.get(transaction.category) || { amount: 0, count: 0 };
        categoryMap.set(transaction.category, {
          amount: existing.amount + transaction.amount,
          count: existing.count + 1
        });
      });

      const topCategories: CategorySpending[] = Array.from(categoryMap.entries())
        .map(([category, data]) => ({
          category,
          amount: data.amount,
          percentage: totalSpend > 0 ? (data.amount / totalSpend) * 100 : 0,
          transactionCount: data.count
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 4);

      setAnalytics({
        topCategories,
        weeklySpend,
        dailyAverage,
        currency: userCurrency,
        totalSpend,
      });
    } catch (error) {
      console.error("Error fetching spending analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrencyDisplay = (amount: number) => {
    return formatCurrency(amount, analytics.currency);
  };

  const getSpendingLevel = (percentage: number) => {
    if (percentage > 30) return { color: "text-destructive", level: "High" };
    if (percentage > 15) return { color: "text-orange-500", level: "Medium" };
    return { color: "text-primary", level: "Low" };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-primary" />
          Spending Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">7-Day Spend</span>
            </div>
            <span className="font-bold text-primary text-sm">{formatCurrencyDisplay(analytics.weeklySpend)}</span>
          </div>
          
          <div className="p-3 rounded-lg bg-accent/10">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingDown className="h-4 w-4 text-accent-foreground" />
              <span className="text-xs font-medium">Daily Avg</span>
            </div>
            <span className="font-bold text-accent-foreground text-sm">{formatCurrencyDisplay(analytics.dailyAverage)}</span>
          </div>
        </div>

        {/* Top Spending Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Top Categories (30 days)</h4>
          {analytics.topCategories.length > 0 ? (
            analytics.topCategories.map((category, index) => {
              const spending = getSpendingLevel(category.percentage);
              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm font-medium capitalize">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{formatCurrencyDisplay(category.amount)}</span>
                      <Badge variant="secondary" className={`ml-2 text-xs ${spending.color}`}>
                        {category.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={category.percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{category.transactionCount} transactions</span>
                    <span className={spending.color}>{spending.level} spending</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No spending data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingAnalyticsWidget;