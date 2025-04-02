
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { action, components, userId } = await req.json();
    
    if (action === 'generate_metrics') {
      // Generate random monitoring data for components
      const results = [];
      
      for (const component of components) {
        try {
          // Get configuration for this component
          const { data: configData, error: configError } = await supabase
            .from('monitoring_configuration')
            .select('*')
            .eq('component', component)
            .maybeSingle();
            
          if (configError) throw configError;
          
          // If component doesn't exist, create it
          const config = configData || {
            component,
            warning_threshold: 80,
            critical_threshold: 95,
            enabled: true,
            check_interval: 60,
            notification_enabled: true
          };
          
          if (!configData) {
            const { error: insertError } = await supabase
              .from('monitoring_configuration')
              .insert(config);
              
            if (insertError) throw insertError;
          }
          
          // Generate a random value
          // Sometimes exceed thresholds to simulate issues
          const exceedThreshold = Math.random() < 0.2; // 20% chance
          const value = exceedThreshold
            ? Math.floor(Math.random() * 30) + config.warning_threshold
            : Math.floor(Math.random() * config.warning_threshold);
          
          // Determine status based on value and thresholds
          let status = "normal";
          if (value >= config.critical_threshold) {
            status = "critical";
          } else if (value >= config.warning_threshold) {
            status = "warning";
          }
          
          // Insert monitoring record
          const { data, error } = await supabase
            .from('system_monitoring')
            .insert({
              event_type: 'system',
              component,
              status,
              value,
              threshold: config.critical_threshold,
              message: `Simulated ${component} monitoring data`,
              metadata: { simulated: true }
            })
            .select()
            .single();
            
          if (error) throw error;
          
          results.push({
            component,
            status,
            value,
            threshold: config.critical_threshold
          });
          
          // Also generate some API usage metrics
          if (Math.random() < 0.5) { // 50% chance
            const statusCode = Math.random() < 0.1 ? 500 : Math.random() < 0.2 ? 404 : 200;
            const responseTime = Math.floor(Math.random() * 500) + 50; // 50-550ms
            
            await supabase
              .from('api_usage_metrics')
              .insert({
                endpoint: `/api/${component}`,
                method: 'GET',
                status_code: statusCode,
                response_time_ms: responseTime,
                user_id: userId,
                request_payload: null,
                error_message: statusCode >= 400 ? `Simulated error for ${component}` : null
              });
          }
          
          // Generate some rate limiting data
          if (Math.random() < 0.3) { // 30% chance
            const tokens = Math.floor(Math.random() * 100);
            
            await supabase
              .from('rate_limit_counters')
              .upsert({
                key: `sim_${component}_${Math.floor(Math.random() * 10)}`,
                tokens,
                last_refill: new Date().toISOString(),
                endpoint: `/api/${component}`,
                user_id: userId,
                ip_address: '127.0.0.1'
              }, { onConflict: 'key, endpoint' });
          }
        } catch (componentError) {
          console.error(`Error processing component ${component}:`, componentError);
          results.push({
            component,
            error: componentError.message
          });
        }
      }
      
      return new Response(
        JSON.stringify({ success: true, results }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } else if (action === 'clear_metrics') {
      // Optionally clear metrics data
      const tables = ['system_monitoring', 'api_usage_metrics', 'rate_limit_counters'];
      const results = [];
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).delete().gte('created_at', new Date(Date.now() - 86400000).toISOString());
          
          if (error) throw error;
          
          results.push({ table, success: true });
        } catch (tableError) {
          console.error(`Error clearing table ${table}:`, tableError);
          results.push({ table, success: false, error: tableError.message });
        }
      }
      
      return new Response(
        JSON.stringify({ success: true, results }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action specified' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error in monitoring-simulation function:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
