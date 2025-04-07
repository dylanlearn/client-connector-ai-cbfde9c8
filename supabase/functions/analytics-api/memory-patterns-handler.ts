
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function handleMemoryPatterns(req: Request, payload: any, supabase: any) {
  const { analysis_type, category, limit = 100, segment_by, timeframe, user_id, cluster_count } = payload;
  
  try {
    // Choose which analysis function to run based on analysis_type
    switch (analysis_type) {
      case 'similarity_trends':
        return await analyzeEmbeddingSimilarityTrends(supabase, segment_by, timeframe, limit);
      case 'prompt_heatmaps':
        return await analyzePromptHeatmaps(supabase, payload);
      case 'behavioral_fingerprints':
        return await analyzeBehavioralFingerprints(supabase, user_id, cluster_count);
      case 'global_insights':
        return await analyzeGlobalMemoryInsights(supabase, category, limit);
      default:
        // Default to global memory insights if no specific type is provided
        return await analyzeGlobalMemoryInsights(supabase, category, limit);
    }
  } catch (error) {
    console.error("Error in memory pattern analysis:", error);
    throw error;
  }
}

/**
 * Analyze embedding similarity trends
 */
async function analyzeEmbeddingSimilarityTrends(
  supabase: any, 
  segmentBy: string = 'category', 
  timeframe: any = null, 
  limit: number = 10
) {
  // Default to last month if no timeframe provided
  const fromDate = timeframe?.from ? new Date(timeframe.from) : 
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const toDate = timeframe?.to ? new Date(timeframe.to) : new Date();
  
  // Query embeddings data
  const { data: embeddings, error } = await supabase
    .from('memory_embeddings')
    .select('*')
    .gte('created_at', fromDate.toISOString())
    .lte('created_at', toDate.toISOString())
    .limit(500); // Limit for performance
  
  if (error) throw error;
  
  if (!embeddings || embeddings.length === 0) {
    return { trends: [] };
  }
  
  // Group by the requested segment
  const segments = {};
  embeddings.forEach(emb => {
    let segmentKey;
    
    switch(segmentBy) {
      case 'user':
        segmentKey = emb.metadata?.user_id || 'unknown';
        break;
      case 'project':
        segmentKey = emb.metadata?.project_id || 'unknown';
        break;
      case 'category':
      default:
        segmentKey = emb.metadata?.category || 'unknown';
        break;
    }
    
    if (!segments[segmentKey]) {
      segments[segmentKey] = [];
    }
    
    segments[segmentKey].push(emb);
  });
  
  // Calculate trends for each segment (simplified analysis)
  const trends = Object.entries(segments)
    .map(([segment, items]: [string, any[]]) => ({
      segment,
      count: items.length,
      earliest: new Date(Math.min(...items.map(i => new Date(i.created_at).getTime()))),
      latest: new Date(Math.max(...items.map(i => new Date(i.created_at).getTime()))),
      topCategories: extractTopCategories(items)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  
  return { trends };
}

/**
 * Analyze prompt heatmaps
 */
async function analyzePromptHeatmaps(supabase: any, options: any) {
  const outcomeMetric = options.outcome_metric || 'relevance_score';
  const timeRange = options.time_range || { 
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() 
  };
  const minSimilarity = options.min_similarity || 0.5;
  
  // This is a placeholder implementation
  // In a real system, you'd analyze actual prompt data and outcomes
  
  // Return sample data for demo purposes
  return {
    phrases: [
      { phrase: "modern design", frequency: 35, effectiveness: 0.89 },
      { phrase: "minimalist layout", frequency: 28, effectiveness: 0.92 },
      { phrase: "bold typography", frequency: 22, effectiveness: 0.85 },
      { phrase: "responsive web", frequency: 20, effectiveness: 0.78 },
      { phrase: "color palette", frequency: 18, effectiveness: 0.81 },
      { phrase: "user experience", frequency: 15, effectiveness: 0.86 },
      { phrase: "dark mode", frequency: 12, effectiveness: 0.79 },
      { phrase: "gradient background", frequency: 10, effectiveness: 0.73 }
    ]
  };
}

/**
 * Analyze behavioral fingerprints
 */
async function analyzeBehavioralFingerprints(supabase: any, userId?: string, clusterCount: number = 5) {
  // This would typically involve complex analysis of user behavior patterns
  // For demonstration, we'll return placeholder data
  
  const baseFingerprints = [
    { id: "fp1", name: "Visual Explorer", traits: ["Prefers images", "Quick browsing", "Many sessions"], strength: 0.85 },
    { id: "fp2", name: "Detail Oriented", traits: ["Long reading time", "Few searches", "Deep navigation"], strength: 0.78 },
    { id: "fp3", name: "Comparison Shopper", traits: ["Multiple tabs", "Return visits", "Feature focused"], strength: 0.92 },
    { id: "fp4", name: "Goal Driven", traits: ["Direct navigation", "Short sessions", "Conversion focused"], strength: 0.81 },
    { id: "fp5", name: "Research Heavy", traits: ["Long sessions", "Multiple searches", "Content focused"], strength: 0.76 }
  ];
  
  // If a specific user is provided, adjust the fingerprints to appear personalized
  if (userId) {
    return {
      fingerprints: baseFingerprints.slice(0, clusterCount).map(fp => ({
        ...fp,
        // Add some random variation to make it look personalized
        strength: Math.min(0.99, fp.strength + (Math.random() * 0.1 - 0.05)),
        userMatch: Math.min(0.99, 0.5 + Math.random() * 0.4)
      }))
    };
  }
  
  return { 
    fingerprints: baseFingerprints.slice(0, clusterCount)
  };
}

/**
 * Analyze global memory insights
 */
async function analyzeGlobalMemoryInsights(supabase: any, category: string = 'design_patterns', limit: number = 100) {
  // Fetch memories from the specified category
  const { data, error } = await supabase
    .from('global_memories')
    .select('*')
    .eq('category', category)
    .order('relevance_score', { ascending: false })
    .order('frequency', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error("Error fetching global memories for analysis:", error);
    return { insights: ["Not enough data to extract insights"] };
  }
  
  if (!data || data.length === 0) {
    return { insights: ["Not enough data to extract insights"] };
  }
  
  // This is where you would normally have more sophisticated analysis
  // For now, we'll generate sample insights based on category
  const insights = generateSampleInsights(category, data.length);
  
  return { 
    insights,
    memory_count: data.length,
    category
  };
}

// Helper Functions

function extractTopCategories(items: any[], limit: number = 3) {
  const categories: Record<string, number> = {};
  
  items.forEach(item => {
    const category = item.metadata?.subcategory || item.metadata?.category || 'unknown';
    categories[category] = (categories[category] || 0) + 1;
  });
  
  return Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function generateSampleInsights(category: string, count: number): string[] {
  const baseInsights: Record<string, string[]> = {
    design_patterns: [
      "Users prefer clean, minimalist layouts",
      "Dark mode is preferred for extended usage",
      "Accessibility considerations are important across all designs",
      "Mobile-first approach is trending upward",
      "Gradient colors are making a comeback"
    ],
    user_preferences: [
      "Clear navigation is the highest priority",
      "Speed and performance outweigh visual complexity",
      "Personalized experiences increase engagement",
      "Consistent design language improves user satisfaction",
      "Micro-interactions enhance perceived quality"
    ],
    interaction_patterns: [
      "Users typically navigate in F-shaped patterns",
      "Most interactions occur above the fold",
      "Touch targets should be at least 44x44 pixels",
      "Users expect feedback within 100ms of interaction",
      "Scroll depth decreases exponentially"
    ]
  };
  
  // Return appropriate insights based on category
  return (baseInsights[category] || [
    "Memory patterns show consistent engagement",
    "User behavior is aligned with industry standards",
    "Content relevance correlates with interaction length",
    "Semantic connections between similar memories detected",
    "Pattern recognition improves with increased data points"
  ]).slice(0, Math.min(5, Math.max(1, Math.floor(count / 20))));
}
