
/**
 * Service for presenting information progressively in a conversational manner
 * to avoid overwhelming users with too much information at once
 */
export const ProgressiveDisclosureService = {
  /**
   * Break down a complex piece of information into smaller, digestible pieces
   * @param fullContent The complete content to break down
   * @param segmentCount The number of segments to break content into
   * @returns An array of content segments to present progressively
   */
  segmentContent: (fullContent: string, segmentCount: number = 3): string[] => {
    if (!fullContent || fullContent.trim() === '') {
      return [];
    }
    
    // Split by paragraphs first
    const paragraphs = fullContent.split(/\n\n+/);
    
    if (paragraphs.length <= segmentCount) {
      return paragraphs;
    }
    
    // Group paragraphs into logical segments
    const segments: string[] = [];
    const paragraphsPerSegment = Math.ceil(paragraphs.length / segmentCount);
    
    for (let i = 0; i < segmentCount; i++) {
      const startIdx = i * paragraphsPerSegment;
      const endIdx = Math.min(startIdx + paragraphsPerSegment, paragraphs.length);
      
      if (startIdx < paragraphs.length) {
        segments.push(paragraphs.slice(startIdx, endIdx).join('\n\n'));
      }
    }
    
    return segments;
  },
  
  /**
   * Generate a conversational prompt that encourages the user to ask for more details
   * @param topic The topic that has more information available
   * @returns A prompt encouraging the user to explore further
   */
  createFollowUpPrompt: (topic: string): string => {
    const prompts = [
      `Would you like to learn more about ${topic}?`,
      `I can provide more details about ${topic} if you're interested.`,
      `There's more to discuss about ${topic}. Shall we explore further?`,
      `We've just scratched the surface of ${topic}. Want to dive deeper?`,
      `Is there a specific aspect of ${topic} you'd like to explore next?`
    ];
    
    return prompts[Math.floor(Math.random() * prompts.length)];
  },
  
  /**
   * Generate a list of suggested follow-up questions based on a topic
   * @param topic The main topic to generate follow-up questions for
   * @param context Additional context to inform better follow-up questions
   * @returns An array of follow-up questions
   */
  generateFollowUpQuestions: (topic: string, context: string = ''): string[] => {
    // In a real implementation, this might use AI to generate contextual questions
    // For this implementation, we'll use templates based on the topic
    
    const designTopics = {
      color: [
        "How would this color palette work for a mobile interface?",
        "Can you suggest complementary accent colors?",
        "How should I balance these colors in my design?",
        "What typography pairs well with this color scheme?"
      ],
      layout: [
        "How can I make this layout more responsive?",
        "What content structure works best with this layout?",
        "How should I handle this layout on smaller screens?",
        "Can you suggest ways to improve the visual hierarchy?"
      ],
      typography: [
        "What font pairings would you recommend?",
        "How should I scale these fonts for different devices?",
        "What line spacing works best for readability?",
        "How can I use typography to create better visual hierarchy?"
      ],
      interaction: [
        "What animations would enhance this interaction?",
        "How can I make this interaction more intuitive?",
        "What accessibility considerations should I keep in mind?",
        "Can you show me examples of similar interactions?"
      ]
    };
    
    // Default questions if topic doesn't match a category
    const defaultQuestions = [
      `Can you explain more about how ${topic} affects user experience?`,
      `What are best practices for implementing ${topic} in my design?`,
      `How do current design trends incorporate ${topic}?`,
      `Can you show me examples of effective use of ${topic}?`
    ];
    
    // Find the right category based on topic keywords
    for (const [category, questions] of Object.entries(designTopics)) {
      if (topic.toLowerCase().includes(category)) {
        return questions;
      }
    }
    
    return defaultQuestions;
  }
};
