import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Target,
  TrendingUp,
  PiggyBank,
  Bot,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
} from "lucide-react";
import DashboardFeatures from "@/components/DashboardFeatures";
import TransactionManager from "@/components/TransactionManager";
import AIAdvisor from "@/components/AIAdvisor";
import DashboardWidget from "@/components/DashboardWidget";
import FinancialQuotes from "@/components/FinancialQuotes";
import QuickStatsWidget from "@/components/QuickStatsWidget";
import SpendingAnalyticsWidget from "@/components/SpendingAnalyticsWidget";
import BudgetManager from "@/components/BudgetManager";
import GoalsManager from "@/components/GoalsManager";
import InvestmentManager from "@/components/InvestmentManager";
import SavingsManager from "@/components/SavingsManager";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleFeatureClick = (feature: string) => {
    setActiveView(feature);
  };

  const handleTransactionUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Auth component will handle redirect
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">FinanceAdvisor</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile?.full_name ? getInitials(profile.full_name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Welcome back, {profile?.full_name?.split(" ")[0] || "User"}!
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Here's your financial overview for today
                </p>
              </CardHeader>
            </Card>

            {/* Content based on active view */}
            {activeView === 'dashboard' && (
              <>
                <DashboardFeatures onFeatureClick={handleFeatureClick} />
                <TransactionManager onTransactionUpdate={handleTransactionUpdate} />
                <AIAdvisor />
              </>
            )}
            {activeView === 'budget' && <BudgetManager />}
            {activeView === 'goals' && <GoalsManager />}
            {activeView === 'investments' && <InvestmentManager />}
            {activeView === 'savings' && <SavingsManager />}
            {activeView === 'ai' && <AIAdvisor />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {activeView === 'dashboard' && (
              <>
                <DashboardWidget refreshTrigger={refreshTrigger} />
                <FinancialQuotes />
                <QuickStatsWidget />
                <SpendingAnalyticsWidget />
              </>
            )}
            
            {activeView !== 'dashboard' && (
              <Button 
                variant="outline" 
                onClick={() => setActiveView('dashboard')}
                className="w-full"
              >
                ← Back to Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;