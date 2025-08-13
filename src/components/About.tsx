import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, Brain, Users } from "lucide-react";

const About = () => {
  const achievements = [
    "Outperforms ChatGPT, Claude, and Gemini on financial planning assessments",
    "Certified Financial Planner® level expertise built into AI",
    "Trained on thousands of real financial scenarios",
    "Continuously updated with latest market trends and regulations"
  ];

  const certifications = [
    { name: "CFP® Board", type: "Financial Planning" },
    { name: "SEC Compliant", type: "Investment Advisory" },
    { name: "SOC 2 Type II", type: "Security & Privacy" },
    { name: "ISO 27001", type: "Information Security" }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-advisor-green-light px-4 py-2 rounded-full mb-6 border border-advisor-green/20">
              <Award className="w-4 h-4 text-advisor-green" />
              <span className="text-sm font-medium text-advisor-green-dark">Industry Leading AI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-advisor-gray mb-6">
              AI Model Built for
              <span className="text-advisor-green block mt-2">Financial Excellence</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Column - Content */}
            <div>
              <p className="section-text mb-8">
                Unlike general AI platforms, our AI advisor was specifically trained for personal finance. 
                We've built a model that understands the complex relationships between people and their money, 
                delivering insights that rival certified financial planners.
              </p>

              <div className="space-y-4 mb-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-advisor-green mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{achievement}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                variant="outline"
                className="border-advisor-green text-advisor-green hover:bg-advisor-green-light"
              >
                Learn More About Our AI
              </Button>
            </div>

            {/* Right Column - Performance Metrics */}
            <div className="space-y-6">
              <Card className="p-6 advisor-shadow border-advisor-green/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-advisor-gray">CFP® Exam Performance</h3>
                    <p className="text-muted-foreground">Certified Financial Planner® Assessment</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-advisor-green">Our AI Model</span>
                    <Badge variant="secondary" className="bg-advisor-green text-white">92%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ChatGPT</span>
                    <Badge variant="outline">78%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Claude</span>
                    <Badge variant="outline">74%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Gemini</span>
                    <Badge variant="outline">71%</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6 advisor-shadow border-advisor-green/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-advisor-gray">User Satisfaction</h3>
                    <p className="text-muted-foreground">Based on 10,000+ user reviews</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-advisor-green mb-2">4.9/5</div>
                  <p className="text-muted-foreground">Average rating across all platforms</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Certifications */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-advisor-gray mb-8">Trusted & Certified</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {certifications.map((cert, index) => (
                <Card key={index} className="p-4 text-center advisor-shadow border-advisor-green/10">
                  <div className="w-8 h-8 advisor-gradient rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="font-semibold text-sm text-advisor-gray">{cert.name}</div>
                  <div className="text-xs text-muted-foreground">{cert.type}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;