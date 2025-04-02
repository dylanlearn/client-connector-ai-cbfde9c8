
import { useState } from "react";
import { DesignRecommendation } from "@/types/ai";
import { 
  AIAnalyzerService,
  AIDesignService 
} from "@/services/ai";

export const useDesignRecommendations = () => {
  const [designRecommendations, setDesignRecommendations] = useState<DesignRecommendation[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateDesignRecommendations = async (questionnaire: Record<string, any>): Promise<DesignRecommendation> => {
    setIsProcessing(true);
    
    try {
      // Extract relevant data from questionnaire
      const industry = questionnaire.industry || '';
      const preferences = Object.values(questionnaire).filter(value => typeof value === 'string').join(' ');
      
      // Generate brand personality
      const brandPersonality = await AIAnalyzerService.detectBrandPersonality(questionnaire);
      
      // Get dominant mood/tone
      const dominantTone = Object.entries(brandPersonality)
        .reduce((max, [tone, value]) => (value > max.value ? { tone, value } : max), { tone: "", value: 0 })
        .tone;
      
      // Generate color palette
      const colorPalette = await AIDesignService.suggestColorPalette({
        industry,
        mood: dominantTone,
        preferences: Object.values(questionnaire).filter(value => typeof value === 'string') as string[]
      });
      
      // Generate typography suggestions
      const typography = await AIDesignService.suggestTypography(brandPersonality);
      
      // Generate layout recommendations
      const layouts = await AIDesignService.recommendLayouts({
        siteType: questionnaire.siteType || 'business',
        audience: questionnaire.audience || ''
      });
      
      // Generate component suggestions
      const features = Object.values(questionnaire)
        .filter(value => typeof value === 'string') as string[];
      
      const components = await AIDesignService.suggestComponents(
        questionnaire.siteType || 'business',
        features
      );
      
      // Combine all recommendations
      const recommendations: DesignRecommendation = {
        colorPalette,
        typography,
        layouts,
        components
      };
      
      setDesignRecommendations([recommendations]);
      return recommendations;
    } catch (error) {
      console.error("Error generating design recommendations:", error);
      
      // Return fallback recommendations
      const fallbackRecommendations: DesignRecommendation = {
        colorPalette: [
          { name: "Primary Blue", hex: "#4F46E5", usage: "primary" },
          { name: "Secondary Teal", hex: "#0EA5E9", usage: "secondary" },
          { name: "Background Gray", hex: "#F9FAFB", usage: "background" }
        ],
        typography: {
          headings: "Montserrat",
          body: "Open Sans",
          accents: "Montserrat"
        },
        layouts: [
          "Hero section with clear value proposition",
          "Feature grid with icons and brief descriptions",
          "Testimonials section with client quotes"
        ]
      };
      
      setDesignRecommendations([fallbackRecommendations]);
      return fallbackRecommendations;
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDesignRecommendations = () => {
    setDesignRecommendations(null);
  };

  return {
    designRecommendations,
    isProcessing,
    generateDesignRecommendations,
    resetDesignRecommendations
  };
};
