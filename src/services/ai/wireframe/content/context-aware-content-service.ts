
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';
import { getSuggestedCopy } from './copy-suggestions';

export interface ContentGenerationRequest {
  wireframeData: WireframeData;
  sectionId?: string;
  sectionType?: string;
  industryContext?: string;
  targetAudience?: string;
  brandVoice?: 'formal' | 'casual' | 'technical' | 'friendly' | 'authoritative' | 'playful';
  contentLength?: 'short' | 'medium' | 'long';
  keywords?: string[];
}

export interface GeneratedContent {
  heading?: string;
  subheading?: string;
  body?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  placeholderText?: string[];
  footerText?: string;
  listItems?: string[];
}

export interface GeneratedSectionContent {
  sectionId: string;
  sectionType: string;
  content: GeneratedContent;
}

/**
 * Service for generating contextually aware content for wireframes
 */
export const ContextAwareContentService = {
  /**
   * Generate content for an entire wireframe
   */
  generateWireframeContent: async (
    request: ContentGenerationRequest
  ): Promise<GeneratedSectionContent[]> => {
    try {
      const { wireframeData, industryContext, targetAudience, brandVoice } = request;
      
      if (!wireframeData || !wireframeData.sections) {
        return [];
      }
      
      // Process each section to generate appropriate content
      const generatedContent = await Promise.all(
        wireframeData.sections.map(section => 
          generateSectionContent({
            wireframeData,
            sectionId: section.id,
            sectionType: section.sectionType || section.type || 'unknown',
            industryContext,
            targetAudience,
            brandVoice
          })
        )
      );
      
      return generatedContent;
    } catch (error) {
      console.error('Error generating wireframe content:', error);
      return [];
    }
  },
  
  /**
   * Generate content for a specific section
   */
  generateSectionContent: async (
    request: ContentGenerationRequest
  ): Promise<GeneratedSectionContent> => {
    try {
      const { wireframeData, sectionId, sectionType } = request;
      
      if (!sectionId && !sectionType) {
        throw new Error('Either sectionId or sectionType must be provided');
      }
      
      // If sectionId is provided, find the section and use its type
      let effectiveSectionType = sectionType || 'unknown';
      
      if (sectionId && wireframeData && wireframeData.sections) {
        const section = wireframeData.sections.find(s => s.id === sectionId);
        if (section) {
          effectiveSectionType = section.sectionType || section.type || effectiveSectionType;
        }
      }
      
      const content = await generateSectionContent(request);
      
      return {
        sectionId: sectionId || uuidv4(),
        sectionType: effectiveSectionType,
        content
      };
    } catch (error) {
      console.error('Error generating section content:', error);
      return {
        sectionId: sectionId || uuidv4(),
        sectionType: sectionType || 'unknown',
        content: {
          heading: 'Error generating content',
          subheading: 'Please try again'
        }
      };
    }
  },
  
  /**
   * Generate placeholder text based on wireframe context
   */
  generatePlaceholderText: async (
    context: string,
    paragraphCount: number = 1,
    sentencesPerParagraph: number = 3
  ): Promise<string[]> => {
    try {
      // In a production implementation, this would use an AI service
      // For now, we'll use a simple placeholder generator
      
      return generatePlaceholders(context, paragraphCount, sentencesPerParagraph);
    } catch (error) {
      console.error('Error generating placeholder text:', error);
      return ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.'];
    }
  }
};

/**
 * Helper function to generate content for a section based on its type and context
 */
async function generateSectionContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
  const { 
    sectionType = 'unknown', 
    industryContext, 
    targetAudience, 
    brandVoice = 'formal',
    contentLength = 'medium'
  } = request;
  
  // For now, we'll leverage the copy suggestions utility
  // In a production implementation, this would call an AI service
  const suggestedCopy = getSuggestedCopy(sectionType);
  
  // Enhance the copy with context-aware modifications
  const contextualizedContent = contextualizeContent(
    suggestedCopy,
    sectionType,
    industryContext,
    targetAudience,
    brandVoice,
    contentLength
  );
  
  // Generate placeholder text if needed
  if (['about', 'features', 'services'].includes(sectionType.toLowerCase())) {
    contextualizedContent.placeholderText = await ContextAwareContentService.generatePlaceholderText(
      `${industryContext || ''} ${sectionType}`, 
      contentLength === 'short' ? 1 : contentLength === 'medium' ? 2 : 3
    );
  }
  
  // Generate list items for certain section types
  if (['features', 'services', 'faq'].includes(sectionType.toLowerCase())) {
    contextualizedContent.listItems = generateListItems(
      sectionType, 
      industryContext || '', 
      contentLength === 'short' ? 3 : contentLength === 'medium' ? 4 : 6
    );
  }
  
  return contextualizedContent;
}

/**
 * Apply contextual modifications to base content
 */
function contextualizeContent(
  baseContent: Record<string, string | undefined>,
  sectionType: string,
  industryContext?: string,
  targetAudience?: string,
  brandVoice: 'formal' | 'casual' | 'technical' | 'friendly' | 'authoritative' | 'playful' = 'formal',
  contentLength: 'short' | 'medium' | 'long' = 'medium'
): GeneratedContent {
  // Apply industry context if available
  let heading = baseContent.heading || '';
  let subheading = baseContent.subheading || '';
  
  if (industryContext) {
    // Enhance heading with industry context
    if (heading.includes('Your')) {
      heading = heading.replace('Your', `Your ${industryContext}`);
    } else if (sectionType.toLowerCase() === 'hero') {
      heading = `${heading} for ${industryContext}`;
    }
    
    // Enhance subheading with industry context
    if (subheading.includes('your')) {
      subheading = subheading.replace('your', `your ${industryContext}`);
    }
  }
  
  // Adjust tone based on brand voice
  const voiceAdjustments = {
    formal: {
      heading: heading,
      subheading: subheading,
      ctaPrimary: baseContent.primaryCta || 'Request Information',
      ctaSecondary: baseContent.secondaryCta || 'Learn More'
    },
    casual: {
      heading: heading.replace('Solution', 'Answer').replace('Powerful', 'Amazing'),
      subheading: subheading.replace('streamline', 'simplify').replace('intuitive', 'easy-to-use'),
      ctaPrimary: baseContent.primaryCta?.replace('Get Started', 'Jump In') || 'Jump In',
      ctaSecondary: baseContent.secondaryCta?.replace('Learn More', 'See How') || 'See How'
    },
    technical: {
      heading: heading.replace('Solution', 'Framework').replace('Powerful', 'Advanced'),
      subheading: subheading.replace('streamline', 'optimize').replace('intuitive', 'sophisticated'),
      ctaPrimary: baseContent.primaryCta?.replace('Get Started', 'Implement Now') || 'Implement Now',
      ctaSecondary: baseContent.secondaryCta?.replace('Learn More', 'View Documentation') || 'View Documentation'
    },
    friendly: {
      heading: heading.replace('Powerful Solution', 'Friendly Help').replace('Business', 'Needs'),
      subheading: subheading.replace('streamline your workflow', 'make your life easier'),
      ctaPrimary: baseContent.primaryCta?.replace('Get Started', 'Let\'s Go') || 'Let\'s Go',
      ctaSecondary: baseContent.secondaryCta?.replace('Learn More', 'Tell Me More') || 'Tell Me More'
    },
    authoritative: {
      heading: heading.replace('Powerful', 'Industry-Leading').replace('Solution', 'System'),
      subheading: subheading.replace('streamline', 'transform').replace('boost', 'maximize'),
      ctaPrimary: baseContent.primaryCta?.replace('Get Started', 'Begin Transformation') || 'Begin Transformation',
      ctaSecondary: baseContent.secondaryCta?.replace('Learn More', 'Discover Advantages') || 'Discover Advantages'
    },
    playful: {
      heading: heading.replace('Powerful Solution', 'Awesome Tools').replace('Business', 'Adventures'),
      subheading: subheading.replace('streamline', 'supercharge').replace('boost', 'skyrocket'),
      ctaPrimary: baseContent.primaryCta?.replace('Get Started', 'Let\'s Play') || 'Let\'s Play',
      ctaSecondary: baseContent.secondaryCta?.replace('Learn More', 'Show Me the Magic') || 'Show Me the Magic'
    }
  };
  
  const adjustedContent = voiceAdjustments[brandVoice];
  
  return {
    heading: adjustedContent.heading,
    subheading: adjustedContent.subheading,
    ctaPrimary: adjustedContent.ctaPrimary,
    ctaSecondary: adjustedContent.ctaSecondary,
    body: baseContent.supportText
  };
}

/**
 * Generate placeholder paragraphs
 */
function generatePlaceholders(
  context: string = '', 
  paragraphCount: number = 1, 
  sentencesPerParagraph: number = 3
): string[] {
  const industryStarters = {
    'technology': [
      'Our innovative technology solutions drive business transformation.',
      'We leverage cutting-edge technologies to solve complex problems.',
      'Digital transformation requires strategic technology implementation.'
    ],
    'healthcare': [
      'Patient-centered care remains our highest priority.',
      'We combine medical expertise with compassionate service.',
      'Healthcare innovations improve outcomes for patients worldwide.'
    ],
    'finance': [
      'Financial stability begins with strategic planning and insight.',
      'Our solutions provide clarity in complex financial landscapes.',
      'Secure your financial future with expert guidance and tools.'
    ],
    'education': [
      'Learning experiences should be engaging and accessible to all.',
      'Education transforms lives and builds stronger communities.',
      'We believe in the power of knowledge and continuous growth.'
    ],
    'ecommerce': [
      'Creating seamless shopping experiences that delight customers.',
      'Our platform connects buyers with the products they love.',
      'Optimized e-commerce solutions drive conversion and loyalty.'
    ],
    'default': [
      'We deliver outstanding results through dedication and expertise.',
      'Our team works tirelessly to exceed client expectations.',
      'Quality and innovation are the cornerstones of our approach.'
    ]
  };
  
  // Determine which industry starters to use
  let startingSentences = industryStarters.default;
  
  Object.keys(industryStarters).forEach(industry => {
    if (context.toLowerCase().includes(industry)) {
      startingSentences = industryStarters[industry as keyof typeof industryStarters];
    }
  });
  
  const connectors = [
    'Furthermore, ', 'In addition, ', 'Moreover, ', 'As a result, ', 
    'Consequently, ', 'Therefore, ', 'Additionally, ', 'Importantly, '
  ];
  
  const closers = [
    'We continue to lead the industry through innovation and dedication.',
    'Our commitment to excellence separates us from competitors.',
    'Contact us today to learn how we can help you succeed.',
    'Discover the difference our solutions can make for your organization.',
    'We look forward to demonstrating our capabilities to you.',
    'Let us help you achieve your goals with our proven approach.'
  ];
  
  const paragraphs: string[] = [];
  
  // Generate the requested number of paragraphs
  for (let i = 0; i < paragraphCount; i++) {
    let paragraph = '';
    
    // Add a starter sentence for the first paragraph
    if (i === 0) {
      const randomIndex = Math.floor(Math.random() * startingSentences.length);
      paragraph += startingSentences[randomIndex] + ' ';
    }
    
    // Add middle sentences with connectors
    for (let j = 0; j < sentencesPerParagraph - (i === 0 ? 1 : 0) - (i === paragraphCount - 1 ? 1 : 0); j++) {
      const randomConnector = connectors[Math.floor(Math.random() * connectors.length)];
      const randomTopic = [
        'our approach to quality',
        'our client relationships',
        'our industry expertise',
        'our innovative solutions',
        'our team of professionals',
        'our dedication to excellence'
      ][Math.floor(Math.random() * 6)];
      
      paragraph += `${randomConnector}${randomTopic} remains central to our mission. `;
    }
    
    // Add a closer for the last paragraph
    if (i === paragraphCount - 1) {
      const randomCloser = closers[Math.floor(Math.random() * closers.length)];
      paragraph += randomCloser;
    }
    
    paragraphs.push(paragraph.trim());
  }
  
  return paragraphs;
}

/**
 * Generate list items based on section type and context
 */
function generateListItems(
  sectionType: string,
  industryContext: string = '',
  count: number = 4
): string[] {
  const featureItems = [
    'Intuitive dashboard for real-time insights',
    'Advanced analytics with customizable reports',
    'Seamless integration with existing systems',
    'Mobile-optimized interface for on-the-go access',
    'Enhanced security with multi-factor authentication',
    'Automated workflows to improve efficiency',
    'Collaborative tools for team productivity',
    'Customizable templates for quick deployment'
  ];
  
  const serviceItems = [
    'Comprehensive strategy development',
    'Expert implementation and onboarding',
    'Ongoing technical support and maintenance',
    'Performance optimization and analysis',
    'Custom solution development',
    'Training and knowledge transfer',
    'Quality assurance and testing',
    'Consultation and advisory services'
  ];
  
  const faqItems = [
    'How long does implementation typically take?',
    'What support options are available?',
    'How do you ensure data security?',
    'Can your solution integrate with our existing tools?',
    'What makes your approach different?',
    'Is customization available for our specific needs?',
    'What is your pricing model?',
    'Do you offer training for our team?'
  ];
  
  // Select the appropriate item list based on section type
  let items: string[];
  switch (sectionType.toLowerCase()) {
    case 'features':
      items = featureItems;
      break;
    case 'services':
      items = serviceItems;
      break;
    case 'faq':
      items = faqItems;
      break;
    default:
      items = featureItems; // Default to features
  }
  
  // Select a random subset of items up to the requested count
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, items.length));
}
