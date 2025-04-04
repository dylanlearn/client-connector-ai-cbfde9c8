
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AIMemoryService, MemoryCategory } from '@/services/ai';
import { useMemory } from '@/contexts/ai/MemoryContext';
import { ConversationEntry, UserPersona, ConversationalMemoryReturn } from './types';
import { usePersonaManagement } from './usePersonaManagement';
import { useConversationStorage } from './useConversationStorage';

export function useConversationalMemory(): ConversationalMemoryReturn {
  const { user } = useAuth();
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use specialized hooks
  const { 
    userPersona, 
    setUserPersona, 
    buildPersonaFromMemory, 
    getPersonalizedGreeting 
  } = usePersonaManagement();
  
  const { storeConversationEntry: storeEntry } = useConversationStorage();

  // Wrapper for conversation storage that uses local state setters
  const storeConversationEntry = useCallback(async (
    content: string,
    type: 'user' | 'assistant',
    metadata: Record<string, any> = {}
  ) => {
    await storeEntry(
      content,
      type,
      setConversationHistory,
      setUserPersona,
      metadata
    );
  }, [storeEntry]);

  // Load the user's conversation history and persona
  const loadUserMemory = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Get conversation history from memory service
      const conversationMemories = await AIMemoryService.user.get(
        user.id,
        {
          categories: [MemoryCategory.ProjectContext], // Using existing category
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
          categories: [MemoryCategory.TonePreference], // Using existing category
          limit: 20
        }
      );
      
      // Build persona from memories and set it
      const persona = buildPersonaFromMemory(entries, userPreferenceMemories);
      setUserPersona(persona);
    } catch (error) {
      console.error("Error loading conversation memory:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, buildPersonaFromMemory]);
  
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
