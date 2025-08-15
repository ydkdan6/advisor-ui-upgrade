import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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

    // Build conversation context
    const systemPrompt = `You are an AI Financial Advisor with advanced expertise in personal finance, budgeting, investments, and financial planning. 

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