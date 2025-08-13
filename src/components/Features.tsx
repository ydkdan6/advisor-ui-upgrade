import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  PieChart, 
  Target, 
  CreditCard, 
  TrendingUp, 
  Shield,
  Clock,
  Users,
  ArrowRight
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calculator,
      title: "Smart Budget Planning",
      description: "AI-powered budget recommendations that adapt to your spending patterns and financial goals.",
      highlight: "Automated"
    },
    {
      icon: PieChart,
      title: "Investment Guidance",
      description: "Personalized investment strategies based on your risk tolerance and timeline.",
      highlight: "Personalized"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and track financial milestones with intelligent progress monitoring.",
      highlight: "Intelligent"
    },
    {
      icon: CreditCard,
      title: "Debt Optimization",
      description: "Strategic debt payoff plans to minimize interest and maximize savings.",
      highlight: "Strategic"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Real-time market analysis and personalized recommendations for your portfolio.",
      highlight: "Real-time"
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Comprehensive risk analysis to protect and grow your wealth safely.",
      highlight: "Comprehensive"
    }
  ];

  const stats = [
    { value: "50K+", label: "Happy Users", icon: Users },
    { value: "24/7", label: "AI Support", icon: Clock },
    { value: "$2.5B+", label: "Assets Managed", icon: TrendingUp },
    { value: "99.9%", label: "Uptime", icon: Shield }
  ];

  return (
    <section id="features" className="py-20 bg-advisor-gray-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-advisor-green-light px-4 py-2 rounded-full mb-6 border border-advisor-green/20">
              <span className="text-sm font-medium text-advisor-green-dark">Comprehensive Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-advisor-gray mb-6">
              Everything you need for
              <span className="text-advisor-green block mt-2">financial success</span>
            </h2>
            <p className="section-text max-w-2xl mx-auto">
              Our AI advisor provides comprehensive tools and insights to help you make informed 
              financial decisions and achieve your long-term goals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 advisor-shadow hover:advisor-shadow-hover transition-all duration-300 border-advisor-green/10 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-advisor-gray group-hover:text-advisor-green transition-colors">
                        {feature.title}
                      </h3>
                      <span className="text-xs bg-advisor-green-light text-advisor-green-dark px-2 py-1 rounded-full">
                        {feature.highlight}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-advisor-green mb-1">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="advisor-gradient hover:advisor-shadow-hover transition-all duration-300 text-lg px-8 py-6 group"
            >
              Start Your Financial Assessment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Free consultation • No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;