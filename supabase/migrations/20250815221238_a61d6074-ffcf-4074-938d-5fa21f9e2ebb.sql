-- Add currency support to profiles table
ALTER TABLE public.profiles 
ADD COLUMN currency varchar(3) DEFAULT 'USD' NOT NULL;

-- Add currency support to transactions table
ALTER TABLE public.transactions 
ADD COLUMN currency varchar(3) DEFAULT 'USD' NOT NULL;

-- Add currency support to budgets table
ALTER TABLE public.budgets 
ADD COLUMN currency varchar(3) DEFAULT 'USD' NOT NULL;

-- Add currency support to goals table
ALTER TABLE public.goals 
ADD COLUMN currency varchar(3) DEFAULT 'USD' NOT NULL;

-- Add currency support to investments table
ALTER TABLE public.investments 
ADD COLUMN currency varchar(3) DEFAULT 'USD' NOT NULL;

-- Add currency support to savings table
ALTER TABLE public.savings 
ADD COLUMN currency varchar(3) DEFAULT 'USD' NOT NULL;

-- Create financial quotes table
CREATE TABLE public.financial_quotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote text NOT NULL,
  author text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on financial_quotes
ALTER TABLE public.financial_quotes ENABLE ROW LEVEL SECURITY;

-- Create policy for financial_quotes (public read access)
CREATE POLICY "Financial quotes are publicly readable" 
ON public.financial_quotes 
FOR SELECT 
USING (true);

-- Create function to update updated_at for financial_quotes
CREATE TRIGGER update_financial_quotes_updated_at
BEFORE UPDATE ON public.financial_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample financial quotes
INSERT INTO public.financial_quotes (quote, author, category) VALUES
('The stock market is filled with individuals who know the price of everything, but the value of nothing.', 'Philip Fisher', 'investing'),
('An investment in knowledge pays the best interest.', 'Benjamin Franklin', 'investing'),
('It''s not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.', 'Robert Kiyosaki', 'wealth'),
('The real measure of your wealth is how much you''d be worth if you lost all your money.', 'Anonymous', 'wealth'),
('Do not save what is left after spending, but spend what is left after saving.', 'Warren Buffett', 'saving'),
('A budget is telling your money where to go instead of wondering where it went.', 'Dave Ramsey', 'budgeting'),
('The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought, and so broadens the mind.', 'T.T. Munger', 'saving'),
('Financial peace isn''t the acquisition of stuff. It''s learning to live on less than you make, so you can give money back and have money to invest. You can''t win until you do this.', 'Dave Ramsey', 'financial_planning');