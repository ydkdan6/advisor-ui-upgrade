import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const geminiApiKey ='AIzaSyC0xGhFQ3UqHYySinMPfJRzCAezUfIkVX8';
const url = 'https://aqcusbrhdnsmefpawupb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxY3VzYnJoZG5zbWVmcGF3dXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjg0MjcsImV4cCI6MjA3MDcwNDQyN30.WEWqTWan3mhoOE7Ay6J86M9DLsCXY8Rp23eTctxem6k';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Get the user from the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract JWT token and decode to get user info
    const token = authHeader.replace('Bearer ', '');
    
    // Create a Supabase client for this request
    const supabaseClient = createClient(
      url ?? '',
      key ?? '',
      {
        global: {
          headers: {
            authorization: authHeader,
          },
        },
      }
    );

    // Get user from the auth token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid user' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user's financial data for personalized advice
    const userId = user.id;
    
    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Get recent transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: transactions } = await supabaseClient
      .from('transactions')
      .select('type, amount, category, date, currency')
      .eq('user_id', userId)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false })
      .limit(20);

    // Get user's goals
    const { data: goals } = await supabaseClient
      .from('goals')
      .select('title, target_amount, current_amount, target_date, currency')
      .eq('user_id', userId)
      .limit(5);

    // Get user's budgets
    const { data: budgets } = await supabaseClient
      .from('budgets')
      .select('category, amount, period, currency')
      .eq('user_id', userId)
      .limit(10);

    // Calculate financial summary
    const totalIncome = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0;
    const totalExpenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0;
    const netIncome = totalIncome - totalExpenses;

    // Create personalized context
    const userContext = `
User Financial Profile:
- Name: ${profile?.full_name || 'User'}
- Preferred Currency: ${profile?.currency || 'USD'}
- Total Income (last 30 days): ${totalIncome} ${profile?.currency || 'USD'}
- Total Expenses (last 30 days): ${totalExpenses} ${profile?.currency || 'USD'}
- Net Income: ${netIncome} ${profile?.currency || 'USD'}
- Number of transactions: ${transactions?.length || 0}

Recent Transaction Categories: ${transactions?.map(t => t.category).slice(0, 5).join(', ') || 'None'}

Active Goals: ${goals?.map(g => `${g.title} (${g.current_amount}/${g.target_amount} ${g.currency})`).join(', ') || 'None'}

Budget Categories: ${budgets?.map(b => `${b.category}: ${b.amount} ${b.currency}/${b.period}`).join(', ') || 'None'}

Based on this financial data, provide personalized, actionable advice.
    `;

    // Build conversation context
    const systemPrompt = `You are a professional financial advisor providing personalized advice based on real user data. 

${userContext}

Instructions:
- Give specific, actionable advice based on their actual financial situation
- Reference their spending patterns, goals, and budgets when relevant
- Keep responses concise but comprehensive (2-3 paragraphs max)
- Use their preferred currency in recommendations
- Be encouraging but realistic about their financial situation
- If they're doing well, acknowledge it; if there are concerns, address them constructively

Key guidelines:
- Provide practical, actionable financial advice
- Be concise but thorough in your responses
- Consider risk tolerance and personal circumstances
- Always prioritize financial safety and responsible practices
- Suggest diversification in investments
- Emphasize emergency funds and debt management
- Be encouraging and supportive in your tone

Respond professionally and helpfully to financial questions and concerns.`;

    const contents = [
      {
        parts: [{ text: systemPrompt }]
      }
    ];

    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      contents.push({
        parts: [{ text: msg.content }]
      });
    });

    // Add current message
    contents.push({
      parts: [{ text: message }]
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I'm unable to provide a response at this time. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});