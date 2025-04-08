
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WireframeData, WireframeSection } from '@/types/wireframe';
import { v4 as uuidv4 } from 'uuid';

interface IntakeWireframeBridgeProps {
  intakeData: any;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
}

const IntakeWireframeBridge: React.FC<IntakeWireframeBridgeProps> = ({
  intakeData,
  onWireframeGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [wireframeData, setWireframeData] = useState<WireframeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateWireframe = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Extract relevant information from intake data
      const { 
        businessName, 
        primaryColor, 
        secondaryColor,
        businessType,
        designPreferences = {},
      } = intakeData;
      
      // Create sections based on business type and intake data
      const sections: WireframeSection[] = generateSections(intakeData);
      
      // Create the wireframe data structure
      const generatedWireframe: WireframeData = {
        id: uuidv4(), // Ensure ID is always provided
        title: businessName || 'Wireframe Based on Intake Form',
        description: `Wireframe for ${businessType || 'business'} website`,
        sections,
        layoutType: designPreferences.layoutStyle || 'standard',
        colorScheme: {
          primary: primaryColor || '#3b82f6',
          secondary: secondaryColor || '#10b981',
          accent: designPreferences.accentColor || '#f97316',
          background: designPreferences.backgroundColor || '#ffffff',
        },
        typography: {
          headings: designPreferences.headingFont || 'Inter',
          body: designPreferences.bodyFont || 'Inter',
          fontPairings: designPreferences.fontPairings || []
        },
        style: designPreferences.visualStyle || 'modern'
      };
      
      setWireframeData(generatedWireframe);
      
      if (onWireframeGenerated) {
        onWireframeGenerated(generatedWireframe);
      }
      
    } catch (err) {
      console.error("Error generating wireframe from intake data:", err);
      setError("Failed to generate wireframe from intake data");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate wireframe sections based on intake data
  const generateSections = (data: any): WireframeSection[] => {
    const sections: WireframeSection[] = [];
    
    // Always add a hero section
    sections.push({
      id: uuidv4(),
      name: "Hero Section",
      sectionType: "hero",
      description: `Main hero section for ${data.businessName || 'the website'}`,
      components: [
        {
          id: uuidv4(),
          type: "heading",
          content: data.mainHeading || data.businessName || "Welcome to our website"
        },
        {
          id: uuidv4(),
          type: "paragraph",
          content: data.tagline || data.businessDescription || "We provide exceptional products and services"
        },
        {
          id: uuidv4(),
          type: "button",
          content: data.ctaText || "Get Started"
        }
      ],
      layout: {
        type: "flex",
        direction: "column",
        alignment: "center"
      },
      positionOrder: 0
    });
    
    // Add features section if available
    if (data.features && Array.isArray(data.features)) {
      sections.push({
        id: uuidv4(),
        name: "Features Section",
        sectionType: "features",
        description: "Highlighting key features and benefits",
        components: data.features.map((feature: string, index: number) => ({
          id: uuidv4(),
          type: "feature",
          content: feature
        })),
        layout: {
          type: "grid",
          columns: Math.min(data.features.length, 3)
        },
        positionOrder: 1
      });
    }
    
    // Add more sections based on business type
    if (data.businessType === "ecommerce") {
      sections.push({
        id: uuidv4(),
        name: "Product Showcase",
        sectionType: "products",
        description: "Featured products showcase",
        components: [],
        layout: { type: "grid", columns: 3 },
        positionOrder: 2
      });
    }
    
    return sections;
  };
  
  // Helper to render status message
  const renderStatus = () => {
    if (isGenerating) {
      return <p className="text-gray-500">Generating wireframe...</p>;
    }
    
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    
    if (wireframeData) {
      return <p className="text-green-500">Wireframe generated successfully!</p>;
    }
    
    return null; // Return null instead of an empty string to fix the ReactNode error
  };

  return (
    <div className="intake-wireframe-bridge p-4">
      <h3 className="text-lg font-medium mb-4">Generate Wireframe from Intake Data</h3>
      
      <div className="mb-4">
        {renderStatus()}
      </div>
      
      <Button 
        onClick={generateWireframe} 
        disabled={isGenerating || !intakeData}
      >
        {isGenerating ? "Generating..." : "Generate Wireframe"}
      </Button>
    </div>
  );
};

export default IntakeWireframeBridge;
