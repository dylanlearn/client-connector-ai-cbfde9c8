
import { supabase } from "@/integrations/supabase/client";
import { WireframeData, WireframeSection } from "@/services/ai/wireframe/wireframe-types";
import { CompositionPrinciple, DesignPrincipleAnalysis, PrincipleScore } from "./types";
import { AIFeatureType, selectModelForFeature } from "../../ai-model-selector";

/**
 * Service to analyze design principles in wireframes
 */
export class DesignPrincipleAnalyzerService {
  /**
   * Analyze a wireframe for adherence to design composition principles
   */
  static async analyzeComposition(
    wireframe: WireframeData,
    principles?: CompositionPrinciple[]
  ): Promise<DesignPrincipleAnalysis> {
    try {
      // Select principles to analyze if not specified
      const principlesToAnalyze = principles || [
        'ruleOfThirds', 
        'goldenRatio', 
        'visualBalance',
        'contrast',
        'alignment'
      ];

      // Use GPT-4o for design analysis (higher quality)
      const model = selectModelForFeature(AIFeatureType.DesignAnalysis);
      
      // Create a prompt for the AI to analyze the design principles
      const promptContent = `
        Analyze this wireframe design for adherence to the following design principles:
        ${principlesToAnalyze.join(', ')}.
        
        Wireframe sections:
        ${JSON.stringify(wireframe.sections.map(section => ({
          id: section.id,
          type: section.sectionType,
          layout: section.layout,
          components: section.components?.length || 0,
          position: section.positionOrder
        })))}
        
        For each principle, provide:
        1. A score from 0-100
        2. Brief feedback explaining the score
        3. 1-3 specific improvement suggestions
        
        Also provide an overall score and a brief summary of the analysis.
        
        Return the analysis as a JSON object with this structure:
        {
          "overallScore": number,
          "principleScores": [
            {
              "principle": string,
              "score": number,
              "feedback": string,
              "suggestions": string[]
            }
          ],
          "summary": string,
          "topIssues": string[],
          "topStrengths": string[]
        }
      `;
      
      const systemPrompt = `You are an expert design evaluator that analyzes wireframes for adherence to 
        fundamental design principles. Focus on objective evaluation based on composition principles like 
        rule of thirds, golden ratio, visual balance, and other established design guidelines.
        Provide constructive feedback and actionable suggestions.`;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.2,
          model
        },
      });
      
      if (error) throw error;
      
      // Parse the AI response into our expected format
      let analysis: DesignPrincipleAnalysis;
      
      try {
        analysis = JSON.parse(data.response);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        // Fallback to a default response if parsing fails
        analysis = this.getDefaultAnalysis(principlesToAnalyze);
      }
      
      return analysis;
      
    } catch (error) {
      console.error("Error in design principle analysis:", error);
      return this.getDefaultAnalysis();
    }
  }
  
  /**
   * Generate a default analysis when the AI analysis fails
   */
  private static getDefaultAnalysis(principles?: CompositionPrinciple[]): DesignPrincipleAnalysis {
    const principlesToInclude = principles || [
      'ruleOfThirds', 
      'goldenRatio', 
      'visualBalance',
      'contrast',
      'alignment'
    ];
    
    const defaultScores: PrincipleScore[] = principlesToInclude.map(principle => ({
      principle,
      score: 70,
      feedback: `Unable to fully analyze ${principle}. Please try again later.`,
      suggestions: ["Ensure elements are properly positioned", "Consider the overall layout balance"]
    }));
    
    return {
      overallScore: 70,
      principleScores: defaultScores,
      summary: "Analysis could not be completed successfully. Using default values.",
      topIssues: ["Analysis incomplete - try again later"],
      topStrengths: ["Layout appears to have a basic structure"]
    };
  }
  
  /**
   * Apply design principle improvements to a wireframe
   */
  static async applyPrincipleImprovements(
    wireframe: WireframeData, 
    principle: CompositionPrinciple
  ): Promise<WireframeData> {
    // Create a copy of the wireframe to modify
    const updatedWireframe = { ...wireframe, sections: [...wireframe.sections] };
    
    // Apply improvements based on the principle
    switch (principle) {
      case 'ruleOfThirds':
        updatedWireframe.sections = this.applyRuleOfThirds(updatedWireframe.sections);
        break;
      case 'goldenRatio':
        updatedWireframe.sections = this.applyGoldenRatio(updatedWireframe.sections);
        break;
      case 'visualBalance':
        updatedWireframe.sections = this.improveVisualBalance(updatedWireframe.sections);
        break;
      default:
        // For other principles, just return the original wireframe
        break;
    }
    
    return updatedWireframe;
  }
  
  /**
   * Apply rule of thirds to section layouts
   */
  private static applyRuleOfThirds(sections: WireframeSection[]): WireframeSection[] {
    return sections.map(section => {
      // Apply rule of thirds to the section layout
      // For example, adjust component widths to align with thirds
      
      if (section.layout?.columns === 2) {
        // Two-column layout could use 2/3 + 1/3 ratio
        return {
          ...section,
          layout: {
            ...section.layout,
            columnWidths: ["2fr", "1fr"]
          }
        };
      }
      
      return section;
    });
  }
  
  /**
   * Apply golden ratio to section layouts
   */
  private static applyGoldenRatio(sections: WireframeSection[]): WireframeSection[] {
    const goldenRatio = 1.618;
    
    return sections.map(section => {
      // Apply golden ratio to the section layout
      // For example, set width/height ratio to golden ratio
      
      if (section.style?.height && typeof section.style.height === 'number') {
        const height = section.style.height;
        
        return {
          ...section,
          style: {
            ...section.style,
            width: Math.round(height * goldenRatio)
          }
        };
      }
      
      return section;
    });
  }
  
  /**
   * Improve visual balance in sections
   */
  private static improveVisualBalance(sections: WireframeSection[]): WireframeSection[] {
    return sections.map(section => {
      // Improve visual balance in the section
      // For example, center-align and add equal margin
      
      return {
        ...section,
        style: {
          ...section.style,
          margin: "0 auto",
          textAlign: "center"
        },
        layout: {
          ...section.layout,
          justifyContent: "center"
        }
      };
    });
  }
}
