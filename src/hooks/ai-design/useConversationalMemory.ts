
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AIMemoryService, MemoryCategory } from '@/services/ai';

interface ConversationEntry {
  content: string;
  timestamp: Date;
  type: 'user' | 'assistant';
  sentiment?: 'positive' | 'neutral' | 'negative';
  topics?: string[];
}

interface UserPersona {
  preferredTone?: 'formal' | 'casual' | 'technical' | 'friendly';
  designPreferences?: string[];
  commonTopics?: string[];
  lastInteraction?: Date;
  interactionCount: number;
}

export function useConversationalMemory() {
  const { user } = useAuth();
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const [userPersona, setUserPersona] = useState<UserPersona>({
    interactionCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load the user's conversation history and persona
  const loadUserMemory = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Get conversation history from memory service
      const conversationMemories = await AIMemoryService.user.get(
        user.id,
        {
          category: MemoryCategory.Conversation,
          limit: 50,
          timeframe: {
            // Get memories from the last 30 days
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      );
      
      // Transform memories to conversation entries
      const entries: ConversationEntry[] = conversationMemories.map(memory => ({
        content: memory.content,
        timestamp: memory.timestamp,
        type: memory.metadata?.type || 'assistant',
        sentiment: memory.metadata?.sentiment,
        topics: memory.metadata?.topics || []
      }));
      
      setConversationHistory(entries);
      
      // Get user preferences and persona data
      const userPreferenceMemories = await AIMemoryService.user.get(
        user.id,
        {
          category: MemoryCategory.UserPreference,
          limit: 20
        }
      );
      
      // Extract persona information from preferences
      const persona: UserPersona = {
        interactionCount: entries.length
      };
      
      userPreferenceMemories.forEach(memory => {
        if (memory.metadata?.preferredTone) {
          persona.preferredTone = memory.metadata.preferredTone;
        }
        
        if (memory.metadata?.designPreferences) {
          persona.designPreferences = [
            ...(persona.designPreferences || []),
            ...memory.metadata.designPreferences
          ];
        }
        
        if (memory.metadata?.lastInteraction) {
          persona.lastInteraction = new Date(memory.metadata.lastInteraction);
        }
      });
      
      // Extract common topics from conversation
      const topicFrequency: Record<string, number> = {};
      entries.forEach(entry => {
        entry.topics?.forEach(topic => {
          topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
        });
      });
      
      // Get the top 5 most common topics
      persona.commonTopics = Object.entries(topicFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([topic]) => topic);
      
      setUserPersona(persona);
    } catch (error) {
      console.error("Error loading conversation memory:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Store a new conversation entry
  const storeConversationEntry = useCallback(async (
    content: string,
    type: 'user' | 'assistant',
    metadata: Record<string, any> = {}
  ) => {
    if (!user?.id) return;
    
    try {
      // Create the new entry
      const newEntry: ConversationEntry = {
        content,
        timestamp: new Date(),
        type,
        sentiment: metadata.sentiment,
        topics: metadata.topics
      };
      
      // Update local state
      setConversationHistory(prev => [...prev, newEntry]);
      
      // Increment interaction count
      setUserPersona(prev => ({
        ...prev,
        interactionCount: prev.interactionCount + 1,
        lastInteraction: new Date()
      }));
      
      // Store in memory service
      await AIMemoryService.storeMemoryAcrossLayers(
        user.id,
        content,
        MemoryCategory.Conversation,
        undefined,
        {
          type,
          sentiment: metadata.sentiment,
          topics: metadata.topics,
          timestamp: new Date().toISOString()
        }
      );
      
      // Update user preferences if necessary
      if (metadata.preferredTone || metadata.designPreferences) {
        await AIMemoryService.user.store(
          user.id,
          "User preference update",
          MemoryCategory.UserPreference,
          {
            preferredTone: metadata.preferredTone,
            designPreferences: metadata.designPreferences,
            lastInteraction: new Date().toISOString()
          }
        );
        
        // Update local persona state
        setUserPersona(prev => ({
          ...prev,
          preferredTone: metadata.preferredTone || prev.preferredTone,
          designPreferences: metadata.designPreferences 
            ? [...(prev.designPreferences || []), ...metadata.designPreferences]
            : prev.designPreferences,
          lastInteraction: new Date()
        }));
      }
    } catch (error) {
      console.error("Error storing conversation entry:", error);
    }
  }, [user]);
  
  // Get a personalized greeting based on user history
  const getPersonalizedGreeting = useCallback((): string => {
    if (!user) return "Welcome! I'm your AI design assistant.";
    
    const { interactionCount, lastInteraction, designPreferences, commonTopics } = userPersona;
    
    // New user
    if (interactionCount === 0 || !lastInteraction) {
      return "Welcome! I'm your AI design assistant. I'm here to help with your design project. What would you like to work on today?";
    }
    
    // Returning user after a long time (more than 7 days)
    const daysSinceLastInteraction = lastInteraction 
      ? Math.floor((new Date().getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
      
    if (daysSinceLastInteraction > 7) {
      return `Welcome back after ${daysSinceLastInteraction} days! How has your design project been progressing? I'm ready to help you pick up where we left off.`;
    }
    
    // Regular returning user
    if (interactionCount > 10) {
      // Frequent user with design preferences
      if (designPreferences && designPreferences.length > 0) {
        const preference = designPreferences[Math.floor(Math.random() * designPreferences.length)];
        return `Welcome back! I notice you've shown interest in ${preference} designs before. Would you like to explore more in that direction today?`;
      }
      
      // Frequent user with common topics
      if (commonTopics && commonTopics.length > 0) {
        const topic = commonTopics[Math.floor(Math.random() * commonTopics.length)];
        return `Good to see you again! Last time we discussed ${topic}. Would you like to continue with that or start something new?`;
      }
      
      return `Welcome back! It's great to continue our design collaboration. What would you like to work on today?`;
    }
    
    // Default returning user
    return `Welcome back! How can I assist with your design project today?`;
  }, [user, userPersona]);
  
  // Initialize on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserMemory();
    }
  }, [user, loadUserMemory]);
  
  return {
    conversationHistory,
    userPersona,
    isLoading,
    storeConversationEntry,
    getPersonalizedGreeting
  };
}
