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

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Welcome back, {profile?.full_name?.split(" ")[0] || "User"}!
                </CardTitle>
                <p className="text-muted-foreground">
                  Here's your financial overview for today
                </p>
              </CardHeader>
            </Card>

            {/* Feature Buttons */}
            <DashboardFeatures />

            {/* Transaction Manager */}
            <TransactionManager />

            {/* AI Advisor */}
            <AIAdvisor />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats Widget */}
            <DashboardWidget />

            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Goals Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Emergency Fund</span>
                      <Badge variant="secondary">75%</Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">$7,500 / $10,000</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-accent/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Vacation Fund</span>
                      <Badge variant="secondary">45%</Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">$2,250 / $5,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                      <span className="text-sm">Grocery Store</span>
                    </div>
                    <span className="text-sm font-medium text-destructive">-$85.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                      <span className="text-sm">Salary</span>
                    </div>
                    <span className="text-sm font-medium text-primary">+$3,200.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                      <span className="text-sm">Netflix</span>
                    </div>
                    <span className="text-sm font-medium text-destructive">-$15.99</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;