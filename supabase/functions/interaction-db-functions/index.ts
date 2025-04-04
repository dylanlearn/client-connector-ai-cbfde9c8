
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

      // Validate incoming events before attempting to insert
      const validationErrors = validateEvents(events);
      if (validationErrors.length > 0) {
        return new Response(
          JSON.stringify({ 
            error: 'Validation failed', 
            details: validationErrors 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Insert the events in batches of 100 to avoid hitting limits
      const batchSize = 100
      const results = []
      const failedEvents = []

      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize)
        try {
          const { data, error } = await supabaseClient
            .from('interaction_events')
            .insert(batch)

          if (error) {
            console.error('Error inserting batch:', error)
            // Store failed events with error info
            failedEvents.push(...batch.map(event => ({
              event,
              error: {
                code: error.code,
                message: error.message,
                details: error.details
              }
            })))
          } else {
            results.push(data)
          }
        } catch (batchError) {
          console.error('Unexpected error during batch insert:', batchError)
          failedEvents.push(...batch.map(event => ({
            event,
            error: {
              message: batchError.message || 'Unknown error'
            }
          })))
        }
      }

      // If we have some failures but also some successes
      if (failedEvents.length > 0 && failedEvents.length < events.length) {
        return new Response(
          JSON.stringify({ 
            warning: `${failedEvents.length} events failed to insert`,
            successfully_inserted: events.length - failedEvents.length,
            failed_events: failedEvents 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 207 }
        )
      } 
      // If all events failed
      else if (failedEvents.length === events.length) {
        return new Response(
          JSON.stringify({ 
            error: 'All events failed to insert',
            failed_events: failedEvents 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      // All events inserted successfully
      else {
        return new Response(
          JSON.stringify({ 
            success: true, 
            count: events.length 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }
    } else if (action === 'health_check') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
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
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message,
        stack: Deno.env.get('ENVIRONMENT') === 'development' ? error.stack : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

/**
 * Validates an array of events
 * @param events Array of interaction events to validate
 * @returns Array of validation errors
 */
function validateEvents(events) {
  const errors = [];
  
  events.forEach((event, index) => {
    // Check required fields
    if (!event.user_id) {
      errors.push({ index, field: 'user_id', message: 'Missing user_id' });
    } else {
      // Validate UUID format
      try {
        const uuid = crypto.randomUUID(); // Just to use the UUID type
        if (typeof event.user_id !== 'string' || 
            !event.user_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          errors.push({ index, field: 'user_id', message: 'Invalid UUID format' });
        }
      } catch (e) {
        errors.push({ index, field: 'user_id', message: 'Invalid UUID format' });
      }
    }
    
    if (!event.event_type) {
      errors.push({ index, field: 'event_type', message: 'Missing event_type' });
    }
    
    if (!event.page_url) {
      errors.push({ index, field: 'page_url', message: 'Missing page_url' });
    }
    
    if (event.x_position === undefined || event.x_position === null) {
      errors.push({ index, field: 'x_position', message: 'Missing x_position' });
    } else if (typeof event.x_position !== 'number') {
      errors.push({ index, field: 'x_position', message: 'x_position must be a number' });
    }
    
    if (event.y_position === undefined || event.y_position === null) {
      errors.push({ index, field: 'y_position', message: 'Missing y_position' });
    } else if (typeof event.y_position !== 'number') {
      errors.push({ index, field: 'y_position', message: 'y_position must be a number' });
    }
    
    if (!event.session_id) {
      errors.push({ index, field: 'session_id', message: 'Missing session_id' });
    }
    
    // Validate metadata is a valid JSON object if present
    if (event.metadata !== undefined && event.metadata !== null) {
      if (typeof event.metadata !== 'object') {
        errors.push({ index, field: 'metadata', message: 'metadata must be a JSON object' });
      }
    }
  });
  
  return errors;
}
