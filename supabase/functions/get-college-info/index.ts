
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { collegeName } = await req.json();

    const response = await fetch(
      `https://api.perplexity.ai/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helper that returns college information in JSON format. Include only these fields: avg_gpa (number 0-5), avg_sat (number 0-1600), avg_act (number 0-36), institution_type ("Public" or "Private"), state (US state name). Return ONLY valid JSON, no other text.'
            },
            {
              role: 'user',
              content: `What are the average GPA, SAT, ACT scores, institution type (public/private), and state for ${collegeName}?`
            }
          ],
          max_tokens: 200,
        })
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
