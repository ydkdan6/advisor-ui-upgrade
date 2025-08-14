import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAdvisor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Financial Advisor. I can help you with budgeting, investment strategies, savings goals, and financial planning. What would you like to discuss today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response with financial advice
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const responses = [
        "Based on your spending patterns, I recommend setting aside 20% of your income for savings. Would you like me to help you create a detailed budget?",
        "Your emergency fund goal is excellent! Consider investing in a high-yield savings account or money market fund for better returns while maintaining liquidity.",
        "I notice you're interested in investments. For beginners, I recommend starting with index funds or ETFs for diversification. What's your risk tolerance?",
        "Great question about budgeting! The 50/30/20 rule is a good starting point: 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
        "To improve your credit score, focus on paying bills on time, keeping credit utilization below 30%, and avoid closing old credit accounts.",
        "For retirement planning, consider maximizing your 401(k) match first, then look into Roth IRA contributions. Time is your greatest asset!",
      ];

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Bot className="h-6 w-6 mr-2 text-primary" />
            AI Financial Advisor
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              78% Accuracy
            </Badge>
            <Badge variant="outline" className="text-xs">
              Advanced AI
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto space-y-3 border rounded-lg p-4 bg-muted/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border shadow-sm"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-background border shadow-sm p-3 rounded-lg flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me about budgeting, investments, savings..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("How should I budget my income?")}
              disabled={isLoading}
            >
              Budgeting tips
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("What investments should I consider?")}
              disabled={isLoading}
            >
              Investment advice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Help me save for emergency fund")}
              disabled={isLoading}
            >
              Savings strategy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAdvisor;