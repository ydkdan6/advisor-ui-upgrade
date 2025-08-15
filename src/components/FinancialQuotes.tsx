import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FinancialQuote {
  id: string;
  quote: string;
  author: string;
  category: string;
}

const FinancialQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState<FinancialQuote | null>(null);
  const [quotes, setQuotes] = useState<FinancialQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("financial_quotes")
        .select("*");

      if (error) {
        console.error("Error fetching quotes:", error);
        return;
      }

      setQuotes(data || []);
      if (data && data.length > 0) {
        setCurrentQuote(data[Math.floor(Math.random() * data.length)]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomQuote = () => {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Quote className="h-5 w-5 mr-2 text-primary" />
            Financial Wisdom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuote) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Quote className="h-5 w-5 mr-2 text-primary" />
            Financial Wisdom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No quotes available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Quote className="h-5 w-5 mr-2 text-primary" />
            Financial Wisdom
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={getRandomQuote}
            className="text-primary hover:text-primary/80"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="text-sm italic text-foreground leading-relaxed">
          "{currentQuote.quote}"
        </blockquote>
        <footer className="text-sm text-muted-foreground">
          — {currentQuote.author}
        </footer>
        <div className="text-xs text-primary/70 capitalize">
          {currentQuote.category.replace('_', ' ')}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialQuotes;