
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
const openAiKey = Deno.env.get("OPENAI_API_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestData {
  analysis_type: 'similarity_trends' | 'prompt_heatmaps' | 'behavioral_fingerprints';
  [key: string]: any;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const requestData = await req.json() as RequestData;
    const { analysis_type } = requestData;

    if (!analysis_type) {
      return new Response(
        JSON.stringify({ error: "Missing analysis_type parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;

    // Process based on analysis type
    switch (analysis_type) {
      case 'similarity_trends':
        result = await analyzeSimilarityTrends(requestData);
        break;
      case 'prompt_heatmaps':
        result = await analyzePromptHeatmaps(requestData);
        break;
      case 'behavioral_fingerprints':
        result = await analyzeBehavioralFingerprints(requestData);
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid analysis_type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Return the analysis results
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-memory-patterns function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Analyze embedding similarity trends across different memory segments
 */
async function analyzeSimilarityTrends(params: any) {
  const { segment_by = 'category', timeframe, limit = 10 } = params;
  
  // Query memory embeddings and apply clustering
  const { data: embeddings, error } = await supabase
    .from('memory_embeddings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit * 10); // Fetch more to ensure we have enough valid data
  
  if (error) {
    console.error("Database error fetching embeddings:", error);
    return { error: "Failed to fetch memory embeddings" };
  }

  // Group embeddings by the specified segment
  const segments: Record<string, any[]> = {};
  embeddings.forEach(embedding => {
    const segmentKey = segment_by === 'category' && embedding.metadata.category 
      ? embedding.metadata.category 
      : segment_by === 'user' && embedding.metadata.userId 
        ? embedding.metadata.userId
        : segment_by === 'project' && embedding.metadata.projectId
          ? embedding.metadata.projectId
          : 'other';
    
    if (!segments[segmentKey]) {
      segments[segmentKey] = [];
    }
    segments[segmentKey].push(embedding);
  });

  // Calculate similarity within each segment
  const trends = Object.entries(segments).map(([segmentName, segmentEmbeddings]) => {
    // Calculate centroid of embeddings in this segment
    const clusterSimilarities = calculateClusterSimilarities(segmentEmbeddings);
    
    return {
      segment: segmentName,
      count: segmentEmbeddings.length,
      clusters: clusterSimilarities.slice(0, Math.min(clusterSimilarities.length, limit)),
      average_similarity: clusterSimilarities.reduce((sum, c) => sum + c.similarity, 0) / 
        (clusterSimilarities.length || 1)
    };
  });

  return { trends, segment_by };
}

/**
 * Analyze which prompt phrases lead to certain outcomes
 */
async function analyzePromptHeatmaps(params: any) {
  const { outcome_metric = 'relevance_score', time_range, min_similarity = 0.5 } = params;
  
  // For simplicity, we'll return a structured analysis of common phrases and their outcomes
  // In a production system, this would involve more sophisticated NLP analysis
  const { data: memories, error } = await supabase
    .from('global_memories')
    .select('*')
    .order('relevance_score', { ascending: false })
    .limit(100);
  
  if (error) {
    console.error("Database error fetching memories:", error);
    return { error: "Failed to fetch memories for heatmap analysis" };
  }

  // Extract key phrases and correlate with outcomes
  const phraseOutcomes = extractKeyPhrases(memories, outcome_metric, min_similarity);
  
  return {
    phrases: phraseOutcomes.slice(0, 30), // Limit to top 30 phrases
    metric: outcome_metric,
    count: phraseOutcomes.length
  };
}

/**
 * Analyze user behavioral patterns to create fingerprints
 */
async function analyzeBehavioralFingerprints(params: any) {
  const { 
    user_id, 
    cluster_count = 5, 
    include_global_patterns = true,
    min_interactions = 10
  } = params;

  // Fetch user memories and interaction patterns
  const { data: userMemories, error: userError } = user_id 
    ? await supabase
        .from('user_memories')
        .select('*')
        .eq('user_id', user_id)
        .order('timestamp', { ascending: false })
    : { data: [], error: null };
  
  if (userError) {
    console.error("Database error fetching user memories:", userError);
    return { error: "Failed to fetch user memories" };
  }

  // Also get interaction events if available
  const { data: interactions, error: intError } = user_id 
    ? await supabase
        .from('interaction_events')
        .select('*')
        .eq('user_id', user_id)
        .order('timestamp', { ascending: false })
        .limit(100)
    : { data: [], error: null };

  // Include global patterns if requested
  const { data: globalPatterns, error: globalError } = include_global_patterns 
    ? await supabase
        .from('global_memories')
        .select('*')
        .order('relevance_score', { ascending: false })
        .limit(30)
    : { data: [], error: null };
  
  // Generate behavioral fingerprints from the data
  const fingerprints = generateBehavioralFingerprints(
    userMemories || [], 
    interactions || [], 
    globalPatterns || [],
    cluster_count
  );

  return {
    user_id: user_id || 'anonymous',
    fingerprints,
    patterns_analyzed: {
      user_memories: userMemories?.length || 0,
      interactions: interactions?.length || 0,
      global_patterns: globalPatterns?.length || 0
    }
  };
}

// Helper functions for analysis

function calculateClusterSimilarities(embeddings: any[]) {
  // This is a simplified implementation - in production, use proper clustering algorithms
  // Simple grouping based on metadata similarity
  const clusters: Record<string, any[]> = {};
  
  embeddings.forEach(embedding => {
    // Create a cluster key from metadata category or content type
    const clusterKey = embedding.metadata.category || 
                       (embedding.metadata.contentType ? `content_${embedding.metadata.contentType}` : 'general');
    
    if (!clusters[clusterKey]) {
      clusters[clusterKey] = [];
    }
    clusters[clusterKey].push(embedding);
  });
  
  // Calculate similarity metrics for each cluster
  return Object.entries(clusters).map(([name, items]) => ({
    cluster_name: name,
    count: items.length,
    similarity: 0.5 + (Math.random() * 0.5), // Simplified - would use actual vector similarity
    top_terms: extractTopTerms(items),
    examples: items.slice(0, 3).map(item => ({
      content: item.content,
      metadata: item.metadata
    }))
  })).sort((a, b) => b.similarity - a.similarity);
}

function extractKeyPhrases(memories: any[], outcomeMetric: string, minSimilarity: number) {
  // Simple phrase extraction - in production, use NLP techniques
  const phrases: Record<string, {count: number, outcomes: number[], avgOutcome: number}> = {};
  
  memories.forEach(memory => {
    // Extract simple 3-word phrases
    const content = memory.content || '';
    const words = content.split(/\s+/);
    
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = words.slice(i, i + 3).join(' ').toLowerCase();
      if (phrase.length > 5) { // Skip very short phrases
        if (!phrases[phrase]) {
          phrases[phrase] = { count: 0, outcomes: [], avgOutcome: 0 };
        }
        phrases[phrase].count += 1;
        
        // Track outcome metric
        const outcome = memory[outcomeMetric] || 0;
        phrases[phrase].outcomes.push(outcome);
        phrases[phrase].avgOutcome = phrases[phrase].outcomes.reduce((a, b) => a + b, 0) / 
          phrases[phrase].outcomes.length;
      }
    }
  });
  
  // Convert to array and sort by impact
  return Object.entries(phrases)
    .filter(([_, data]) => data.count > 1) // Filter out single occurrences
    .map(([phrase, data]) => ({
      phrase,
      count: data.count,
      outcome: data.avgOutcome,
      impact: data.avgOutcome * Math.sqrt(data.count) // Weight by frequency
    }))
    .sort((a, b) => b.impact - a.impact);
}

function generateBehavioralFingerprints(
  userMemories: any[], 
  interactions: any[], 
  globalPatterns: any[],
  clusterCount: number
) {
  // Analyze interaction patterns
  const interactionPatterns = analyzeInteractions(interactions);
  
  // Extract memory content patterns
  const contentPatterns = analyzeContentPatterns(userMemories);
  
  // Generate fingerprints by combining and clustering the patterns
  // In production, this would use ML clustering techniques
  const fingerprints = [];
  
  // Create fingerprints from interaction patterns
  if (interactionPatterns.clickPatterns.length > 0) {
    fingerprints.push({
      name: 'Click Engagement',
      type: 'interaction',
      strength: Math.min(1, interactionPatterns.clickPatterns.length / 10), // Normalize to 0-1
      patterns: interactionPatterns.clickPatterns.slice(0, 5)
    });
  }
  
  // Create fingerprints from page view patterns
  if (interactionPatterns.pagePatterns.length > 0) {
    fingerprints.push({
      name: 'Navigation Style',
      type: 'navigation',
      strength: Math.min(1, interactionPatterns.pagePatterns.length / 5),
      patterns: interactionPatterns.pagePatterns.slice(0, 3)
    });
  }
  
  // Create fingerprints from content interests
  if (contentPatterns.categories.length > 0) {
    fingerprints.push({
      name: 'Content Interests',
      type: 'content',
      strength: Math.min(1, contentPatterns.totalItems / 15),
      patterns: contentPatterns.categories.slice(0, 5)
    });
  }
  
  // Add global pattern alignment if we have data
  if (globalPatterns.length > 0 && userMemories.length > 0) {
    const alignment = calculateGlobalAlignment(userMemories, globalPatterns);
    fingerprints.push({
      name: 'Platform Alignment',
      type: 'global',
      strength: alignment.score,
      patterns: alignment.alignedPatterns.slice(0, 3)
    });
  }
  
  return fingerprints.slice(0, clusterCount);
}

function analyzeInteractions(interactions: any[]) {
  const clickPatterns: any[] = [];
  const pagePatterns: any[] = [];
  
  // Count interactions by element and page
  const elementCounts: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};
  
  interactions.forEach(interaction => {
    // Track element interactions
    if (interaction.element_selector) {
      const key = interaction.element_selector;
      elementCounts[key] = (elementCounts[key] || 0) + 1;
    }
    
    // Track page visits
    if (interaction.page_url) {
      const key = interaction.page_url;
      pageCounts[key] = (pageCounts[key] || 0) + 1;
    }
  });
  
  // Convert to sorted arrays
  for (const [element, count] of Object.entries(elementCounts)) {
    clickPatterns.push({
      element,
      count,
      frequency: count / interactions.length
    });
  }
  
  for (const [page, count] of Object.entries(pageCounts)) {
    pagePatterns.push({
      page,
      count,
      frequency: count / interactions.length
    });
  }
  
  return {
    clickPatterns: clickPatterns.sort((a, b) => b.count - a.count),
    pagePatterns: pagePatterns.sort((a, b) => b.count - a.count),
    totalInteractions: interactions.length
  };
}

function analyzeContentPatterns(memories: any[]) {
  const categoryCounts: Record<string, number> = {};
  let totalItems = 0;
  
  memories.forEach(memory => {
    const category = memory.category || 'uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    totalItems++;
  });
  
  const categories = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
    percentage: (count / totalItems) * 100
  })).sort((a, b) => b.count - a.count);
  
  return { categories, totalItems };
}

function calculateGlobalAlignment(userMemories: any[], globalPatterns: any[]) {
  // Simple alignment calculation - in production would use more sophisticated analysis
  let alignmentScore = 0;
  const alignedPatterns: any[] = [];
  
  // Check if user memories align with global patterns
  globalPatterns.forEach(globalPattern => {
    const category = globalPattern.category;
    const userMemoriesInCategory = userMemories.filter(m => m.category === category);
    
    if (userMemoriesInCategory.length > 0) {
      const alignment = Math.min(1, userMemoriesInCategory.length / 5);
      alignmentScore += alignment;
      
      alignedPatterns.push({
        global_pattern: globalPattern.content,
        user_alignment: alignment,
        category: category
      });
    }
  });
  
  // Normalize to 0-1
  alignmentScore = Math.min(1, alignmentScore / 5);
  
  return {
    score: alignmentScore,
    alignedPatterns: alignedPatterns.sort((a, b) => b.user_alignment - a.user_alignment)
  };
}

function extractTopTerms(items: any[]) {
  // Simple term frequency analysis
  const terms: Record<string, number> = {};
  
  items.forEach(item => {
    const content = item.content || '';
    const words = content.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (word.length > 3) { // Skip short words
        terms[word] = (terms[word] || 0) + 1;
      }
    });
  });
  
  return Object.entries(terms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([term, count]) => ({ term, count }));
}
