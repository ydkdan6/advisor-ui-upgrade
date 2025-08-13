import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-advisor-gray-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-advisor-green-light px-4 py-2 rounded-full mb-6 border border-advisor-green/20">
              <MessageCircle className="w-4 h-4 text-advisor-green" />
              <span className="text-sm font-medium text-advisor-green-dark">Get In Touch</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-advisor-gray mb-6">
              Ready to transform your
              <span className="text-advisor-green block mt-2">financial future?</span>
            </h2>
            <p className="section-text max-w-2xl mx-auto">
              Start your journey with a free consultation. Our AI advisor is ready to analyze 
              your financial situation and provide personalized recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 advisor-shadow border-advisor-green/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-advisor-gray mb-2">Email Support</h3>
                    <p className="text-muted-foreground mb-2">Get help from our expert team</p>
                    <p className="text-advisor-green font-medium">support@financeadvisor.ai</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 advisor-shadow border-advisor-green/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-advisor-gray mb-2">Phone Support</h3>
                    <p className="text-muted-foreground mb-2">Speak with a financial expert</p>
                    <p className="text-advisor-green font-medium">1-800-FINANCE</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 advisor-shadow border-advisor-green/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 advisor-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-advisor-gray mb-2">Office Location</h3>
                    <p className="text-muted-foreground mb-2">Visit our headquarters</p>
                    <p className="text-advisor-green font-medium">New York, NY 10001</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 advisor-shadow border-advisor-green/10">
                <h3 className="text-2xl font-semibold text-advisor-gray mb-6">Send us a message</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-advisor-gray mb-2">
                        First Name
                      </label>
                      <Input 
                        placeholder="Enter your first name"
                        className="border-advisor-green/20 focus:border-advisor-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-advisor-gray mb-2">
                        Last Name
                      </label>
                      <Input 
                        placeholder="Enter your last name"
                        className="border-advisor-green/20 focus:border-advisor-green"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-advisor-gray mb-2">
                      Email Address
                    </label>
                    <Input 
                      type="email"
                      placeholder="Enter your email"
                      className="border-advisor-green/20 focus:border-advisor-green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-advisor-gray mb-2">
                      Financial Goals
                    </label>
                    <Textarea 
                      placeholder="Tell us about your financial goals and how we can help..."
                      rows={5}
                      className="border-advisor-green/20 focus:border-advisor-green resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full advisor-gradient hover:advisor-shadow-hover transition-all duration-300"
                  >
                    Start Free Consultation
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy. 
                    We'll never share your information with third parties.
                  </p>
                </form>
              </Card>
            </div>
          </div>

          {/* Quick Action */}
          <div className="mt-16 text-center">
            <Card className="p-8 advisor-shadow border-advisor-green/10 bg-advisor-green-light/50">
              <h3 className="text-2xl font-semibold text-advisor-gray mb-4">
                Need immediate financial guidance?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our AI advisor is available 24/7 to help you with urgent financial questions 
                and provide instant recommendations.
              </p>
              <Button 
                size="lg"
                className="advisor-gradient hover:advisor-shadow-hover transition-all duration-300"
              >
                Chat with AI Advisor Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;