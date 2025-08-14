import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Target,
  TrendingUp,
  PiggyBank,
  Bot,
} from "lucide-react";

const DashboardFeatures = () => {
  const features = [
    {
      icon: Wallet,
      title: "Budgeting",
      description: "Track and manage your spending",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: Target,
      title: "Goals",
      description: "Set and achieve financial targets",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: TrendingUp,
      title: "Investment",
      description: "Monitor your portfolio growth",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      icon: PiggyBank,
      title: "Savings",
      description: "Build your emergency fund",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      icon: Bot,
      title: "AI Advisor",
      description: "Get personalized financial advice",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Financial Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted/50"
              >
                <div className={`p-3 rounded-full ${feature.bgColor}`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFeatures;