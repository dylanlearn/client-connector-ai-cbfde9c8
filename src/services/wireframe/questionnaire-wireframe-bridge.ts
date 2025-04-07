import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeSection, WireframeComponent, CopySuggestions } from "@/services/ai/wireframe/wireframe-types";
import { IntakeFormData } from '@/types/intake-form';

/**
 * Bridges the questionnaire data to a wireframe data structure.
 */
export const questionnaireWireframeBridge = {
  /**
   * Transforms questionnaire data into a structured wireframe format.
   * @param questionnaireData - The data collected from the questionnaire.
   * @returns A WireframeData object representing the structured wireframe.
   */
  transform: (questionnaireData: any): WireframeData => {
    // Extract relevant information from the questionnaire data
    const projectName = questionnaireData.projectName || "Untitled Project";
    const projectDescription = questionnaireData.projectDescription || "A new project";
    const primaryColor = questionnaireData.primaryColor || "#007BFF";
    const secondaryColor = questionnaireData.secondaryColor || "#6C757D";
    const accentColor = questionnaireData.accentColor || "#FFC107";
    const backgroundColor = questionnaireData.backgroundColor || "#FFFFFF";
    const textColor = questionnaireData.textColor || "#000000";
    const headingFont = questionnaireData.headingFont || "Arial, sans-serif";
    const bodyFont = questionnaireData.bodyFont || "Arial, sans-serif";
    const ctaButtonText = questionnaireData.ctaButtonText || "Learn More";
    const industry = questionnaireData.industry || "General";
    const targetAudience = questionnaireData.targetAudience || "Everyone";
    const projectGoal = questionnaireData.projectGoal || "Inform and engage visitors";
    const logoUrl = questionnaireData.logoUrl || "";
    const numberOfSections = parseInt(questionnaireData.numberOfSections || "3", 10);
    const sectionHeadings = questionnaireData.sectionHeadings || ["Section 1", "Section 2", "Section 3"];
    const sectionDescriptions = questionnaireData.sectionDescriptions || ["Description 1", "Description 2", "Description 3"];
    const sectionLayouts = questionnaireData.sectionLayouts || ["Layout 1", "Layout 2", "Layout 3"];
    const sectionTypes = questionnaireData.sectionTypes || ["Type 1", "Type 2", "Type 3"];
    const sectionImages = questionnaireData.sectionImages || ["Image 1", "Image 2", "Image 3"];
    const sectionCTAs = questionnaireData.sectionCTAs || ["CTA 1", "CTA 2", "CTA 3"];
    const sectionCopy = questionnaireData.sectionCopy || ["Copy 1", "Copy 2", "Copy 3"];
    const sectionComponentTypes = questionnaireData.sectionComponentTypes || [["text"], ["image"], ["button"]];

    // Helper function to create a default section
    const createDefaultSection = (index: number): WireframeSection => {
      return {
        name: sectionHeadings[index] || `Section ${index + 1}`,
        sectionType: sectionTypes[index] || "generic",
        layoutType: sectionLayouts[index] || "standard",
        layout: {
          type: "standard-layout",
          alignment: "center"
        },
        components: [
          { type: "heading", content: sectionHeadings[index] || `Section ${index + 1}` },
          { type: "paragraph", content: sectionDescriptions[index] || "Default section description." }
        ],
        copySuggestions: {
          heading: sectionHeadings[index] || `Section ${index + 1}`,
          subheading: sectionDescriptions[index] || "A brief overview of this section."
        },
        description: sectionDescriptions[index] || "Default section description." // Add description property
      };
    };

    // Create sections based on the number of sections specified
    const sections: WireframeSection[] = Array.from({ length: numberOfSections }, (_, index) => {
      // Ensure that the index does not exceed the length of the arrays
      const sectionHeading = sectionHeadings[index] || `Section ${index + 1}`;
      const sectionDescription = sectionDescriptions[index] || "Default section description.";
      const sectionLayout = sectionLayouts[index] || "standard";
      const sectionType = sectionTypes[index] || "generic";
      const sectionImage = sectionImages[index] || "";
      const sectionCTA = sectionCTAs[index] || "Learn More";
      const sectionCopyText = sectionCopy[index] || "Default copy text.";
      const componentTypes = sectionComponentTypes[index] || ["text"];

      // Create components based on the component types specified
      const components: WireframeComponent[] = componentTypes.map(componentType => {
        switch (componentType) {
          case "image":
            return { type: "image", content: sectionImage };
          case "button":
            return { type: "button", content: sectionCTA };
          default:
            return { type: "text", content: sectionCopyText };
        }
      });

      return {
        name: sectionHeading,
        sectionType: sectionType,
        layoutType: sectionLayout,
        layout: {
          type: "standard-layout",
          alignment: "center"
        },
        components: components,
        copySuggestions: {
          heading: sectionHeading,
          subheading: sectionDescription
        },
        description: sectionDescription // Add description property
      };
    });

    // Construct the wireframe data object
    const wireframeData: WireframeData = {
      title: projectName,
      description: projectDescription,
      sections: sections,
      designTokens: {
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
          accent: accentColor,
          background: backgroundColor,
          text: textColor
        },
        typography: {
          headings: headingFont,
          body: bodyFont
        }
      },
      // Using style object for style to match WireframeData interface
      style: {
        colorScheme: {
          primary: primaryColor,
          secondary: secondaryColor,
          accent: accentColor,
          background: backgroundColor,
          text: textColor
        },
        typography: {
          headingFont: headingFont,
          bodyFont: bodyFont
        },
        spacing: {
          unit: 8,
          scale: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
      },
      // Add these fields as they now exist in both WireframeData interfaces
      mobileConsiderations: "Responsive design with mobile-first approach.",
      accessibilityNotes: "Ensure all elements meet WCAG 2.1 AA standards."
    };

    return wireframeData;
  },
  
  /**
   * Transforms intake data to wireframe generation parameters
   */
  transformIntakeToWireframeParams: (intakeData: IntakeFormData, recommendations?: any): WireframeGenerationParams => {
    const promptText = `Create a wireframe for ${intakeData.projectName || 'a website'} focused on ${intakeData.siteType || 'general use'}`;
    const stylePreferences = intakeData.designStyle || 'modern';

    // Create components with proper IDs
    const components: WireframeComponent[] = [
      { id: uuidv4(), type: 'header', content: intakeData.companyName },
      { id: uuidv4(), type: 'footer', content: intakeData.contactInfo }
    ];

    // Create sections with proper IDs
    const sections: WireframeSection[] = getRecommendedSections(intakeData).map(sectionType => ({
      id: uuidv4(),
      name: sectionNameFromType(sectionType),
      sectionType: sectionType,
      layoutType: sectionLayoutFromType(sectionType),
      layout: {
        type: 'flex',
        alignment: 'center',
      },
      components: components.filter(c => c.type === sectionType),
      copySuggestions: {
        heading: intakeData.keyMessages,
        subheading: intakeData.secondaryMessages,
      },
      description: `${sectionNameFromType(sectionType)} for ${intakeData.companyName}`
    }));

    return {
      description: promptText,
      projectId: intakeData.formId,
      industry: intakeData.industry,
      pageType: intakeData.siteType,
      stylePreferences: stylePreferences,
      complexity: 'moderate',
    };
  },
  
  /**
   * Get recommended sections based on intake data
   */
  getRecommendedSections: (intakeData: any): string[] => {
    // Default sections
    const defaultSections = ['hero', 'features', 'footer'];
    
    // Add sections based on site type
    const siteType = intakeData.siteType?.toLowerCase() || '';
    
    if (siteType.includes('ecommerce')) {
      return [...defaultSections, 'products', 'testimonials', 'cart'];
    } else if (siteType.includes('portfolio')) {
      return [...defaultSections, 'work', 'skills', 'contact'];
    } else if (siteType.includes('blog')) {
      return [...defaultSections, 'posts', 'categories', 'subscribe'];
    }
    
    return defaultSections;
  }
};

// Export alias for backward compatibility
export const QuestionnaireWireframeBridge = questionnaireWireframeBridge;
