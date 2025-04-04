
import { useState, useCallback, useEffect } from 'react';
import { useConversationalMemory } from './useConversationalMemory';

type ToneLevel = 'formal' | 'casual' | 'technical' | 'friendly' | 'enthusiastic';
type EmotionalTone = 'neutral' | 'positive' | 'empathetic' | 'instructive' | 'inquisitive';

interface ToneConfig {
  primary: ToneLevel;
  emotional: EmotionalTone;
  technicalTerms: boolean;
  abbreviations: boolean;
  emojis: boolean;
}

/**
 * Hook for adapting the AI's communication tone based on user interactions
 */
export function useToneAdaptation() {
  const { userPersona, conversationHistory } = useConversationalMemory();
  const [toneConfig, setToneConfig] = useState<ToneConfig>({
    primary: 'friendly',
    emotional: 'neutral',
    technicalTerms: false,
    abbreviations: false,
    emojis: false
  });
  
  // Detect user's tone from recent messages
  const detectUserTone = useCallback(() => {
    if (!conversationHistory || conversationHistory.length === 0) {
      return;
    }
    
    // Get user messages only, from newest to oldest
    const userMessages = conversationHistory
      .filter(entry => entry.type === 'user')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10); // Look at last 10 messages max
    
    if (userMessages.length === 0) return;
    
    // Simple tone detection based on message characteristics
    let formalCount = 0;
    let casualCount = 0;
    let technicalCount = 0;
    let friendlyCount = 0;
    let enthusiasticCount = 0;
    let emojiCount = 0;
    
    // Regex patterns for different tones
    const patterns = {
      formal: /\b(would you|could you|I would like|please)\b|[.;:]$/i,
      casual: /\b(hey|hi|yeah|cool|awesome|great)\b|\b(wanna|gonna|gotta)\b/i,
      technical: /\b(implement|function|component|algorithm|interface|framework|architecture)\b/i,
      friendly: /\b(thanks|thank you|appreciate|helpful|love)\b/i,
      enthusiastic: /!{1,}|\b(wow|amazing|fantastic|excited|love)\b/i,
      emoji: /[\u{1F300}-\u{1F6FF}]/u
    };
    
    userMessages.forEach(message => {
      const content = message.content.toLowerCase();
      
      if (patterns.formal.test(content)) formalCount++;
      if (patterns.casual.test(content)) casualCount++;
      if (patterns.technical.test(content)) technicalCount++;
      if (patterns.friendly.test(content)) friendlyCount++;
      if (patterns.enthusiastic.test(content)) enthusiasticCount++;
      if (patterns.emoji.test(content)) emojiCount++;
    });
    
    // Determine primary tone based on highest count
    const counts = [
      { tone: 'formal' as ToneLevel, count: formalCount },
      { tone: 'casual' as ToneLevel, count: casualCount },
      { tone: 'technical' as ToneLevel, count: technicalCount },
      { tone: 'friendly' as ToneLevel, count: friendlyCount },
      { tone: 'enthusiastic' as ToneLevel, count: enthusiasticCount }
    ];
    
    const primaryTone = counts.sort((a, b) => b.count - a.count)[0].tone;
    
    // Determine emotional tone based on message sentiment
    let positiveCount = 0;
    let neutralCount = 0;
    let questionCount = 0;
    
    userMessages.forEach(message => {
      const content = message.content;
      if (message.sentiment === 'positive' || /\b(thanks|good|great|love|like)\b/i.test(content)) {
        positiveCount++;
      } else if (content.includes('?')) {
        questionCount++;
      } else {
        neutralCount++;
      }
    });
    
    let emotionalTone: EmotionalTone = 'neutral';
    if (positiveCount > userMessages.length / 3) {
      emotionalTone = 'positive';
    } else if (questionCount > userMessages.length / 3) {
      emotionalTone = 'inquisitive';
    }
    
    // Update tone configuration
    setToneConfig({
      primary: primaryTone,
      emotional: emotionalTone,
      technicalTerms: technicalCount > userMessages.length / 4,
      abbreviations: casualCount > formalCount,
      emojis: emojiCount > userMessages.length / 5
    });
    
  }, [conversationHistory]);
  
  // Apply tone adaptations to a message
  const adaptMessageTone = useCallback((
    message: string,
    overrideTone?: Partial<ToneConfig>
  ): string => {
    const tone = { ...toneConfig, ...overrideTone };
    let adaptedMessage = message;
    
    // Apply primary tone adaptations
    if (tone.primary === 'formal') {
      // More formal language, complete sentences, proper punctuation
      adaptedMessage = adaptedMessage.replace(/\bwanna\b/g, 'want to')
        .replace(/\bgonna\b/g, 'going to')
        .replace(/\bgotta\b/g, 'got to')
        .replace(/\byeah\b/g, 'yes')
        .replace(/\bnope\b/g, 'no');
    }
    
    if (tone.primary === 'casual') {
      // More relaxed language, contractions
      adaptedMessage = adaptedMessage.replace(/\bwould like to\b/g, 'want to')
        .replace(/\bplease\b/gi, '')
        .replace(/\. However,/g, '. But');
    }
    
    if (tone.primary === 'technical' && tone.technicalTerms) {
      // Add more technical terminology
      adaptedMessage = adaptedMessage.replace(/\bcolor\b/g, 'color value')
        .replace(/\bbutton\b/g, 'interactive element')
        .replace(/\blayout\b/g, 'layout structure');
    }
    
    if (tone.primary === 'friendly' || tone.primary === 'enthusiastic') {
      // More engaging and personal language
      if (!adaptedMessage.includes('!')) {
        adaptedMessage = adaptedMessage.replace(/\.(?=\s|$)/, '!');
      }
      
      if (!adaptedMessage.includes('you')) {
        adaptedMessage = 'You might like this: ' + adaptedMessage;
      }
    }
    
    // Apply emotional tone
    if (tone.emotional === 'positive') {
      if (!adaptedMessage.includes('great') && !adaptedMessage.includes('excellent')) {
        adaptedMessage = adaptedMessage.replace(/^/, 'Great! ');
      }
    }
    
    if (tone.emotional === 'empathetic') {
      if (!adaptedMessage.includes('understand')) {
        adaptedMessage = adaptedMessage.replace(/^/, 'I understand what you\'re looking for. ');
      }
    }
    
    if (tone.emotional === 'instructive') {
      adaptedMessage = adaptedMessage.replace(/you could/g, 'you should')
        .replace(/might want to/g, 'should');
    }
    
    if (tone.emotional === 'inquisitive') {
      if (!adaptedMessage.includes('?')) {
        adaptedMessage += ' Does that work for you?';
      }
    }
    
    // Add emojis if the user uses them
    if (tone.emojis) {
      // Only add emoji if there isn't one already
      if (!/[\u{1F300}-\u{1F6FF}]/u.test(adaptedMessage)) {
        if (tone.emotional === 'positive') {
          adaptedMessage += ' ✨';
        } else if (adaptedMessage.includes('?')) {
          adaptedMessage = adaptedMessage.replace(/\?/, '? 🤔');
        } else if (adaptedMessage.includes('!')) {
          adaptedMessage = adaptedMessage.replace(/\!/, '! 👍');
        } else {
          adaptedMessage += ' 💡';
        }
      }
    }
    
    return adaptedMessage;
  }, [toneConfig]);
  
  // Update tone configuration when user persona or conversation history changes
  useEffect(() => {
    if (userPersona?.preferredTone) {
      setToneConfig(prev => ({
        ...prev,
        primary: userPersona.preferredTone as ToneLevel
      }));
    } else {
      detectUserTone();
    }
  }, [userPersona, conversationHistory, detectUserTone]);
  
  return {
    toneConfig,
    adaptMessageTone,
    detectUserTone
  };
}
