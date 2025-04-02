
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { action, events } = await req.json()

    if (action === 'batch_insert') {
      if (!events || !Array.isArray(events) || events.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid events data' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      console.log(`Processing batch insert of ${events.length} interaction events`)

      // Insert the events in batches of 100 to avoid hitting limits
      const batchSize = 100
      const results = []

      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize)
        const { data, error } = await supabaseClient
          .from('interaction_events')
          .insert(batch)

        if (error) {
          console.error('Error inserting batch:', error)
          throw error
        }

        results.push(data)
      }

      return new Response(
        JSON.stringify({ success: true, count: events.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
