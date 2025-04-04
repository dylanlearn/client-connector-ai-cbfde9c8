
export interface ConversationEntry {
  content: string;
  timestamp: Date;
  type: 'user' | 'assistant';
  sentiment?: 'positive' | 'neutral' | 'negative';
  topics?: string[];
}

export interface UserPersona {
  preferredTone?: 'formal' | 'casual' | 'technical' | 'friendly';
  designPreferences?: string[];
  commonTopics?: string[];
  lastInteraction?: Date;
  interactionCount: number;
}

export interface ConversationalMemoryReturn {
  conversationHistory: ConversationEntry[];
  userPersona: UserPersona;
  isLoading: boolean;
  storeConversationEntry: (
    content: string,
    type: 'user' | 'assistant',
    metadata?: Record<string, any>
  ) => Promise<void>;
  getPersonalizedGreeting: () => string;
}
