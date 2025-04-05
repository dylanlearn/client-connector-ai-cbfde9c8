
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Parse the request
    const { action, component, duration = 300 } = await req.json();

    if (action === 'simulate_health_checks') {
      // Generate health checks for the past duration (in minutes)
      await generateHealthChecks(supabase, duration);
      
      // Return the latest health status
      const healthStatus = await getSystemHealthStatus(supabase);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Health check simulation completed',
          healthStatus
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else if (action === 'simulate_alert') {
      if (!component) {
        throw new Error('Component name is required for alert simulation');
      }
      
      // Create a simulated alert
      const alertId = await createSystemAlert(supabase, component);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Alert created for ${component}`,
          alertId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else if (action === 'resolve_alert') {
      const { alertId, notes = 'Resolved automatically' } = await req.json();
      
      if (!alertId) {
        throw new Error('Alert ID is required');
      }
      
      // Resolve the alert
      await resolveAlert(supabase, alertId, notes);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Alert resolved successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else if (action === 'get_status') {
      // Return current system health status
      const healthStatus = await getSystemHealthStatus(supabase);
      const alerts = await getActiveAlerts(supabase);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          healthStatus, 
          alerts
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else {
      throw new Error('Invalid action specified');
    }
  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateHealthChecks(supabase, durationMinutes = 300) {
  const components = ['api', 'database', 'storage', 'auth', 'functions'];
  const now = new Date();
  const startTime = new Date(now.getTime() - durationMinutes * 60 * 1000);
  
  for (const component of components) {
    // Get configuration for this component
    const { data: config } = await supabase
      .from('monitoring_configuration')
      .select('*')
      .eq('component', component)
      .single();
    
    if (!config) {
      // Create default configuration if none exists
      await supabase
        .from('monitoring_configuration')
        .insert({
          component,
          warning_threshold: 70,
          critical_threshold: 90,
          check_interval: 60,
          enabled: true
        });
    }
    
    const warningThreshold = config?.warning_threshold || 70;
    const criticalThreshold = config?.critical_threshold || 90;
    
    // Create simulated check data points
    const checkPoints = Math.floor(durationMinutes / 5); // Every 5 minutes
    
    for (let i = 0; i < checkPoints; i++) {
      // Move backward from now
      const checkTime = new Date(now.getTime() - i * 5 * 60 * 1000);
      
      if (checkTime < startTime) break;
      
      // Generate a random value that is usually good but occasionally spikes
      let value;
      const randomFactor = Math.random();
      
      if (randomFactor > 0.95) {
        // 5% chance of critical issue
        value = criticalThreshold + Math.random() * 10;
      } else if (randomFactor > 0.85) {
        // 10% chance of warning issue
        value = warningThreshold + Math.random() * (criticalThreshold - warningThreshold);
      } else {
        // 85% chance of normal operation
        value = Math.random() * warningThreshold;
      }
      
      // Determine status based on thresholds
      let status;
      if (value >= criticalThreshold) {
        status = 'critical';
      } else if (value >= warningThreshold) {
        status = 'warning';
      } else {
        status = 'normal';
      }
      
      // Generate a context-appropriate message
      let message;
      switch (status) {
        case 'critical':
          message = `${component.toUpperCase()} service experiencing critical issues`;
          break;
        case 'warning':
          message = `${component.toUpperCase()} service performance degraded`;
          break;
        default:
          message = `${component.toUpperCase()} service operating normally`;
      }
      
      // Save to system_monitoring table
      await supabase
        .from('system_monitoring')
        .insert({
          component,
          value,
          status,
          message,
          threshold: criticalThreshold,
          created_at: checkTime.toISOString(),
          event_type: 'health_check'
        });
    }
    
    // Update system_health_status view
    await updateSystemHealthStatus(supabase);
  }
}

async function updateSystemHealthStatus(supabase) {
  // This would normally be a database function, but we'll simulate it here
  const components = ['api', 'database', 'storage', 'auth', 'functions'];
  
  for (const component of components) {
    // Get the latest status
    const { data: latestStatus } = await supabase
      .from('system_monitoring')
      .select('status, created_at')
      .eq('component', component)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // Count issues in the last 24h
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const { count: issuesCount } = await supabase
      .from('system_monitoring')
      .select('*', { count: 'exact' })
      .eq('component', component)
      .in('status', ['warning', 'critical'])
      .gte('created_at', twentyFourHoursAgo.toISOString());
    
    // Get average response time in the last hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const { data: responseTimeData } = await supabase
      .from('system_monitoring')
      .select('value')
      .eq('component', component)
      .gte('created_at', oneHourAgo.toISOString());
    
    let avgResponseTime = 0;
    if (responseTimeData && responseTimeData.length > 0) {
      const sum = responseTimeData.reduce((acc, item) => acc + item.value, 0);
      avgResponseTime = sum / responseTimeData.length;
    }
    
    // Check if record exists in system_health_status
    const { data: existingRecord } = await supabase
      .from('system_health_status')
      .select('component')
      .eq('component', component)
      .maybeSingle();
    
    // Insert or update the status
    if (!existingRecord) {
      await supabase
        .from('system_health_status')
        .insert({
          component,
          latest_status: latestStatus?.status || 'unknown',
          last_checked: latestStatus?.created_at || new Date().toISOString(),
          issues_last_24h: issuesCount || 0,
          avg_response_time_1h: avgResponseTime
        });
    } else {
      await supabase
        .from('system_health_status')
        .update({
          latest_status: latestStatus?.status || 'unknown',
          last_checked: latestStatus?.created_at || new Date().toISOString(),
          issues_last_24h: issuesCount || 0,
          avg_response_time_1h: avgResponseTime
        })
        .eq('component', component);
    }
  }
}

async function createSystemAlert(supabase, component) {
  // Define severity based on component
  const severities = ['low', 'medium', 'high', 'critical'];
  const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
  
  // Create a context-appropriate message
  const messages = [
    `${component.toUpperCase()} service experiencing performance issues`,
    `${component.toUpperCase()} availability degraded`,
    `Abnormal behavior detected in ${component.toUpperCase()}`,
    `${component.toUpperCase()} service requires attention`
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  // Insert the alert
  const { data, error } = await supabase
    .from('system_alerts')
    .insert({
      component,
      severity: randomSeverity,
      message: randomMessage,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create alert: ${error.message}`);
  }
  
  return data.id;
}

async function resolveAlert(supabase, alertId, notes) {
  const { error } = await supabase
    .from('system_alerts')
    .update({
      is_resolved: true,
      resolved_at: new Date().toISOString(),
      resolution_notes: notes
    })
    .eq('id', alertId);
  
  if (error) {
    throw new Error(`Failed to resolve alert: ${error.message}`);
  }
}

async function getSystemHealthStatus(supabase) {
  const { data, error } = await supabase
    .from('system_health_status')
    .select('*')
    .order('component');
  
  if (error) {
    throw new Error(`Failed to get health status: ${error.message}`);
  }
  
  return data || [];
}

async function getActiveAlerts(supabase) {
  const { data, error } = await supabase
    .from('system_alerts')
    .select('*')
    .eq('is_resolved', false)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Failed to get alerts: ${error.message}`);
  }
  
  return data || [];
}
