
import React, { createContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { AIMessage, AIAnalysis, AIContextType, DesignRecommendation } from "@/types/ai";
import { designAssistantPrompt, analyticsPrompt } from "./prompts";
import { 
  createUserMessage, 
  createAssistantMessage, 
  createErrorMessage,
  generateAIResponse,
  parseFallbackAnalysis
} from "./utils";
import { 
  AIAnalyzerService,
  AIGeneratorService,
  AIDesignService,
  AISummaryService
} from "@/services/ai";

export const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [designRecommendations, setDesignRecommendations] = useState<DesignRecommendation | null>(null);

  // Generate actual AI response using OpenAI
  const simulateResponse = async (userPrompt: string) => {
    // Add user message
    const userMessage = createUserMessage(userPrompt);
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Call our Supabase Edge Function
      const aiResponse = await generateAIResponse(
        [...messages, userMessage],
        designAssistantPrompt
      );

      // Add AI response
      const aiMessage = createAssistantMessage(aiResponse.content);
      setMessages((prev) => [...prev, aiMessage]);
      console.log("AI response generated using model:", aiResponse.model, "with usage:", aiResponse.usage);
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Add error message
      const errorMessage = createErrorMessage();
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyze questionnaire responses with AI
  const analyzeResponses = async (questionnaireData: Record<string, any>): Promise<AIAnalysis> => {
    setIsProcessing(true);
    
    try {
      const analysisResult = await AIAnalyzerService.analyzeResponses(questionnaireData);
      setAnalysis(analysisResult);
      return analysisResult;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      const fallbackAnalysis = parseFallbackAnalysis();
      setAnalysis(fallbackAnalysis);
      return fallbackAnalysis;
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate design recommendations
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
      
      setDesignRecommendations(recommendations);
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
      
      setDesignRecommendations(fallbackRecommendations);
      return fallbackRecommendations;
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate content using the AI
  const generateContent = async (options: any) => {
    setIsProcessing(true);
    try {
      const content = await AIGeneratorService.generateContent(options);
      return content;
    } catch (error) {
      console.error("Error generating content:", error);
      return `Error generating ${options.type || 'content'}`;
    } finally {
      setIsProcessing(false);
    }
  };

  // Summarize feedback into actionable items
  const summarizeFeedback = async (feedback: string) => {
    setIsProcessing(true);
    try {
      const actionItems = await AISummaryService.convertToActionItems(feedback);
      return actionItems.map(item => item.task);
    } catch (error) {
      console.error("Error summarizing feedback:", error);
      return ["Error processing feedback"];
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setAnalysis(null);
    setDesignRecommendations(null);
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        isProcessing,
        analysis,
        designRecommendations,
        simulateResponse,
        analyzeResponses,
        generateDesignRecommendations,
        generateContent,
        summarizeFeedback,
        reset
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
