
import { useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AIMemoryService, MemoryCategory } from '@/services/ai';
import { ConversationEntry, UserPersona } from './types';
import { useMemory } from '@/contexts/ai/MemoryContext';

export function useConversationStorage() {
  const { user } = useAuth();
  const { storeMemory } = useMemory();

  // Store a new conversation entry
  const storeConversationEntry = useCallback(async (
    content: string,
    type: 'user' | 'assistant',
    setConversationHistory: React.Dispatch<React.SetStateAction<ConversationEntry[]>>,
    setUserPersona: React.Dispatch<React.SetStateAction<UserPersona>>,
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
      
      // Store in memory service using the unified storeMemory
      await storeMemory(
        content,
        MemoryCategory.ProjectContext,
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
        await storeMemory(
          "User preference update",
          MemoryCategory.TonePreference,
          undefined,
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
  }, [user, storeMemory]);

  return {
    storeConversationEntry
  };
}
