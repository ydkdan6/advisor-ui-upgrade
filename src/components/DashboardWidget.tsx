import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
}

const DashboardWidget = () => {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialSummary();
  }, []);

  const fetchFinancialSummary = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get current month's transactions
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", user.id)
        .gte("date", firstDayOfMonth.toISOString().split("T")[0])
        .lte("date", lastDayOfMonth.toISOString().split("T")[0]);

      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }

      const totalIncome = transactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const totalExpenses = transactions
        ?.filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      setSummary({
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        transactionCount: transactions?.length || 0,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-primary" />
          Monthly Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Income */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Income</span>
          </div>
          <span className="font-bold text-primary">{formatCurrency(summary.totalIncome)}</span>
        </div>

        {/* Total Expenses */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Expenses</span>
          </div>
          <span className="font-bold text-destructive">{formatCurrency(summary.totalExpenses)}</span>
        </div>

        {/* Net Income */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-accent-foreground" />
            <span className="text-sm font-medium">Net Income</span>
          </div>
          <span
            className={`font-bold ${
              summary.netIncome >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {formatCurrency(summary.netIncome)}
          </span>
        </div>

        {/* Transaction Count */}
        <div className="text-center pt-2">
          <Badge variant="secondary">
            {summary.transactionCount} transactions this month
          </Badge>
        </div>

        {/* Spending Rate */}
        {summary.totalIncome > 0 && (
          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Spending Rate</span>
              <span>{Math.round((summary.totalExpenses / summary.totalIncome) * 100)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  (summary.totalExpenses / summary.totalIncome) > 0.8
                    ? "bg-destructive"
                    : (summary.totalExpenses / summary.totalIncome) > 0.6
                    ? "bg-orange-500"
                    : "bg-primary"
                }`}
                style={{
                  width: `${Math.min((summary.totalExpenses / summary.totalIncome) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;