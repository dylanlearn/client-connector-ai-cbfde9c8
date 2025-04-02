
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { userId, pageUrl, eventType, limit = 1000 } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Build query to fetch interaction events
    let query = supabase
      .from('interaction_events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (pageUrl) {
      query = query.eq('page_url', pageUrl);
    }
    
    // Fetch data
    const { data: events, error } = await query;
    
    if (error) throw error;
    
    if (!events || events.length === 0) {
      return new Response(
        JSON.stringify({
          insights: ["Not enough interaction data for analysis"],
          hotspots: [],
          patterns: []
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Process data to find patterns
    const patterns = identifyInteractionPatterns(events);
    const hotspots = identifyHotspots(events);
    const insights = generateInsights(events, patterns, hotspots);
    
    return new Response(
      JSON.stringify({
        insights,
        hotspots,
        patterns,
        eventCount: events.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in analyze-interaction-patterns function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        insights: ["Error analyzing interaction patterns"],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

/**
 * Identify hotspots from interaction events
 */
function identifyHotspots(events: any[]): any[] {
  // Group events by position (rounded to nearest 10px) to find clusters
  const positionClusters: Record<string, { count: number, x: number, y: number, elements: string[] }> = {};
  
  events.forEach(event => {
    // Round to nearest 10 pixels
    const x = Math.round(event.x_position / 10) * 10;
    const y = Math.round(event.y_position / 10) * 10;
    const key = `${x},${y}`;
    
    if (!positionClusters[key]) {
      positionClusters[key] = {
        count: 0,
        x,
        y,
        elements: []
      };
    }
    
    positionClusters[key].count += 1;
    
    if (event.element_selector && !positionClusters[key].elements.includes(event.element_selector)) {
      positionClusters[key].elements.push(event.element_selector);
    }
  });
  
  // Convert to array and sort by count
  const hotspots = Object.values(positionClusters)
    .map(cluster => ({
      position: { x: cluster.x, y: cluster.y },
      count: cluster.count,
      intensity: calculateIntensity(cluster.count, events.length),
      elements: cluster.elements.slice(0, 3) // Top 3 elements
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 hotspots
  
  return hotspots;
}

/**
 * Calculate intensity score (0-1) based on count relative to total
 */
function calculateIntensity(count: number, total: number): number {
  if (total === 0) return 0;
  
  // Logarithmic scaling to prevent a few very high counts from skewing results
  const ratio = count / total;
  return Math.min(1, Math.log10(ratio * 100 + 1) / 2);
}

/**
 * Identify interaction patterns
 */
function identifyInteractionPatterns(events: any[]): any[] {
  // Group events by session
  const sessions: Record<string, any[]> = {};
  
  events.forEach(event => {
    if (!sessions[event.session_id]) {
      sessions[event.session_id] = [];
    }
    sessions[event.session_id].push(event);
  });
  
  // Identify common sequences within sessions
  const sequences: Record<string, number> = {};
  
  Object.values(sessions).forEach(sessionEvents => {
    // Sort events by timestamp
    const sortedEvents = [...sessionEvents].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Look for sequences of events
    if (sortedEvents.length >= 2) {
      for (let i = 0; i < sortedEvents.length - 1; i++) {
        const current = sortedEvents[i];
        const next = sortedEvents[i + 1];
        
        // Create a key for this sequence
        const sequenceKey = `${current.element_selector || 'unknown'} → ${next.element_selector || 'unknown'}`;
        
        sequences[sequenceKey] = (sequences[sequenceKey] || 0) + 1;
      }
    }
  });
  
  // Convert to array, sort by frequency
  const patterns = Object.entries(sequences)
    .map(([sequence, count]) => ({ sequence, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 patterns
  
  return patterns;
}

/**
 * Generate insights based on processed data
 */
function generateInsights(events: any[], patterns: any[], hotspots: any[]): string[] {
  const insights: string[] = [];
  
  // Insight: Most active elements
  if (hotspots.length > 0) {
    const topElements = hotspots
      .flatMap(h => h.elements)
      .slice(0, 3)
      .join(', ');
    
    if (topElements) {
      insights.push(`Most interacted elements are: ${topElements}`);
    }
  }
  
  // Insight: Common interaction patterns
  if (patterns.length > 0) {
    const topPattern = patterns[0].sequence;
    insights.push(`Users frequently move from ${topPattern}`);
  }
  
  // Insight: Session behavior
  const sessionTimes = calculateSessionTimes(events);
  if (sessionTimes.length > 0) {
    const avgTime = sessionTimes.reduce((sum, time) => sum + time, 0) / sessionTimes.length;
    insights.push(`Average engagement time is ${Math.round(avgTime)} seconds per session`);
  }
  
  // Insight: Attention distribution
  if (hotspots.length > 0) {
    const topIntensity = hotspots[0].intensity;
    if (topIntensity > 0.7) {
      insights.push(`There is a strong focus point that gets ${Math.round(topIntensity * 100)}% of attention`);
    } else if (hotspots.length > 3 && hotspots[3].intensity > 0.3) {
      insights.push(`Attention is distributed across multiple areas of the interface`);
    }
  }
  
  return insights;
}

/**
 * Calculate session times from events
 */
function calculateSessionTimes(events: any[]): number[] {
  const sessions: Record<string, any[]> = {};
  
  events.forEach(event => {
    if (!sessions[event.session_id]) {
      sessions[event.session_id] = [];
    }
    sessions[event.session_id].push(event);
  });
  
  const sessionTimes: number[] = [];
  
  Object.values(sessions).forEach(sessionEvents => {
    if (sessionEvents.length < 2) return;
    
    // Sort events by timestamp
    const sortedEvents = [...sessionEvents].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Calculate time between first and last event
    const firstTime = new Date(sortedEvents[0].timestamp).getTime();
    const lastTime = new Date(sortedEvents[sortedEvents.length - 1].timestamp).getTime();
    const durationSeconds = (lastTime - firstTime) / 1000;
    
    if (durationSeconds > 0 && durationSeconds < 3600) { // Ignore sessions longer than an hour
      sessionTimes.push(durationSeconds);
    }
  });
  
  return sessionTimes;
}
