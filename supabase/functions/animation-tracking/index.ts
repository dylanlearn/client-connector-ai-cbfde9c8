
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Admin key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { action, events, animation_type, duration, device_info, performance_metrics, feedback } = await req.json();
    
    // Batch processing multiple events
    if (action === 'batch_process' && Array.isArray(events)) {
      console.log(`Processing batch of ${events.length} animation events`);
      
      for (const event of events) {
        await processAnimationInteraction(
          supabaseClient, 
          event.animation_type, 
          event.duration, 
          event.device_info, 
          event.performance_metrics, 
          event.feedback
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, count: events.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    // Single event processing
    else if (animation_type) {
      await processAnimationInteraction(
        supabaseClient,
        animation_type,
        duration,
        device_info,
        performance_metrics,
        feedback
      );
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else {
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
  } catch (error) {
    console.error('Error processing animation tracking:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function processAnimationInteraction(
  supabase,
  animationType,
  duration,
  deviceInfo,
  performanceMetrics,
  feedback
) {
  try {
    // Update animation analytics table
    const { data: existingAnalytics, error: fetchError } = await supabase
      .from('animation_analytics')
      .select('*')
      .eq('animation_type', animationType)
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    if (existingAnalytics) {
      // Update existing record
      const updates = {
        view_count: existingAnalytics.view_count + 1,
        interaction_count: existingAnalytics.interaction_count + 1,
        updated_at: new Date().toISOString()
      };
      
      // Update average duration if provided
      if (duration) {
        updates.average_duration = (
          existingAnalytics.average_duration * existingAnalytics.interaction_count + duration
        ) / (existingAnalytics.interaction_count + 1);
      }
      
      // Update feedback counts if provided
      if (feedback === 'positive') {
        updates.positive_feedback_count = existingAnalytics.positive_feedback_count + 1;
      } else if (feedback === 'negative') {
        updates.negative_feedback_count = existingAnalytics.negative_feedback_count + 1;
      }
      
      // Update device metrics if provided
      if (deviceInfo?.deviceType) {
        const deviceTypeMetrics = existingAnalytics.device_type_metrics || {};
        deviceTypeMetrics[deviceInfo.deviceType] = (deviceTypeMetrics[deviceInfo.deviceType] || 0) + 1;
        updates.device_type_metrics = deviceTypeMetrics;
      }
      
      // Update browser metrics if provided
      if (deviceInfo?.browser) {
        const browserMetrics = existingAnalytics.browser_metrics || {};
        browserMetrics[deviceInfo.browser] = (browserMetrics[deviceInfo.browser] || 0) + 1;
        updates.browser_metrics = browserMetrics;
      }
      
      // Performance metrics
      if (performanceMetrics) {
        updates.performance_metrics = {
          ...existingAnalytics.performance_metrics,
          ...performanceMetrics
        };
      }
      
      const { error: updateError } = await supabase
        .from('animation_analytics')
        .update(updates)
        .eq('id', existingAnalytics.id);
      
      if (updateError) throw updateError;
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('animation_analytics')
        .insert({
          animation_type: animationType,
          view_count: 1,
          interaction_count: 1,
          average_duration: duration || 0,
          positive_feedback_count: feedback === 'positive' ? 1 : 0,
          negative_feedback_count: feedback === 'negative' ? 1 : 0,
          device_type_metrics: deviceInfo?.deviceType 
            ? { [deviceInfo.deviceType]: 1 } 
            : {},
          browser_metrics: deviceInfo?.browser 
            ? { [deviceInfo.browser]: 1 } 
            : {},
          performance_metrics: performanceMetrics || {}
        });
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error processing animation interaction:', error);
    throw error;
  }
}
