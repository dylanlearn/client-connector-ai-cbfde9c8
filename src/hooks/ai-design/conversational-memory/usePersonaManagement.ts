
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AIMemoryService, MemoryCategory } from '@/services/ai';
import { ConversationEntry, UserPersona } from './types';
import { useMemory } from '@/contexts/ai/MemoryContext';

export function usePersonaManagement() {
  const { user } = useAuth();
  const { storeMemory } = useMemory();
  const [userPersona, setUserPersona] = useState<UserPersona>({
    interactionCount: 0
  });

  // Extract common topics from conversation entries
  const extractCommonTopics = useCallback((entries: ConversationEntry[]): string[] => {
    const topicFrequency: Record<string, number> = {};
    entries.forEach(entry => {
      entry.topics?.forEach(topic => {
        topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
      });
    });
    
    // Get the top 5 most common topics
    return Object.entries(topicFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }, []);

  // Build user persona from memory data
  const buildPersonaFromMemory = useCallback((
    conversationEntries: ConversationEntry[],
    preferenceMemories: any[]
  ): UserPersona => {
    const persona: UserPersona = {
      interactionCount: conversationEntries.length
    };
    
    // Extract persona information from preferences
    preferenceMemories.forEach(memory => {
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
    persona.commonTopics = extractCommonTopics(conversationEntries);
    
    return persona;
  }, [extractCommonTopics]);

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

  return {
    userPersona,
    setUserPersona,
    buildPersonaFromMemory,
    getPersonalizedGreeting
  };
}
