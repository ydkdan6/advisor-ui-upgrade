import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Brain } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-advisor-green-light via-background to-advisor-green-light/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-advisor-green-light px-4 py-2 rounded-full mb-6 border border-advisor-green/20">
              <Brain className="w-4 h-4 text-advisor-green" />
              <span className="text-sm font-medium text-advisor-green-dark">AI-Powered Financial Intelligence</span>
            </div>
            
            <h1 className="hero-text text-advisor-gray mb-6 max-w-4xl mx-auto">
              Your AI-powered
              <span className="text-advisor-green block mt-2">Personal Financial Advisor</span>
            </h1>
            
            <p className="section-text max-w-2xl mx-auto mb-8">
              From paying off debt to saving for your future, our AI advisor helps you understand, 
              plan, and achieve your financial goals with personalized guidance and expert insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="advisor-gradient hover:advisor-shadow-hover transition-all duration-300 text-lg px-8 py-6 group"
              >
                Start Your Financial Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-advisor-green text-advisor-green hover:bg-advisor-green-light"
              >
                Explore Features
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center advisor-shadow hover:advisor-shadow-hover transition-all duration-300 border-advisor-green/10">
              <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-advisor-gray">Personalized Strategy</h3>
              <p className="text-muted-foreground">Tailored financial plans based on your unique situation and goals</p>
            </Card>

            <Card className="p-6 text-center advisor-shadow hover:advisor-shadow-hover transition-all duration-300 border-advisor-green/10">
              <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-advisor-gray">Secure & Private</h3>
              <p className="text-muted-foreground">Bank-level security protecting your financial data and privacy</p>
            </Card>

            <Card className="p-6 text-center advisor-shadow hover:advisor-shadow-hover transition-all duration-300 border-advisor-green/10">
              <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-advisor-gray">AI Intelligence</h3>
              <p className="text-muted-foreground">Advanced AI trained specifically for personal finance optimization</p>
            </Card>
          </div>

          {/* Performance Badge */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-card p-6 rounded-xl advisor-shadow border border-advisor-green/10">
              <div className="text-3xl font-bold text-advisor-green">95%</div>
              <div className="text-left">
                <div className="font-semibold text-advisor-gray">Success Rate</div>
                <div className="text-sm text-muted-foreground">Users achieving their financial goals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;