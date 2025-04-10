import React from 'react';
import { Button } from '@/components/ui/button';
import { useWireframeStore } from '@/stores/wireframe-store';
import { v4 as uuidv4 } from 'uuid';
import { WireframeSection, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';

const WireframeAISuggestions: React.FC = () => {
  const wireframeStore = useWireframeStore();

  const createHeroSection = () => {
    const id = uuidv4(); // Make sure you have uuidv4 imported
    
    const section: Omit<WireframeSection, "id"> = {
      name: "Hero Section",
      description: "Main hero section with headline, subheading, and call-to-action",
      sectionType: "hero",
      layoutType: "centered",
      components: [
        {
          id: uuidv4(),
          type: "heading",
          content: "Your Compelling Headline Here"
        },
        {
          id: uuidv4(),
          type: "text",
          content: "A brief description of your product or service that entices visitors to learn more or take action."
        },
        {
          id: uuidv4(),
          type: "button",
          content: "Get Started"
        }
      ]
    };
    
    wireframeStore.addSection(section);
  }

  const createFeaturesSection = () => {
    const id = uuidv4();
    
    const section: Omit<WireframeSection, "id"> = {
      name: "Features Section",
      description: "Showcase key features of your product or service",
      sectionType: "features",
      layoutType: "grid",
      components: [
        {
          id: uuidv4(),
          type: "image",
          content: "Feature Image"
        },
        {
          id: uuidv4(),
          type: "heading",
          content: "Feature Title"
        },
        {
          id: uuidv4(),
          type: "text",
          content: "Feature Description"
        }
      ]
    };
    
    wireframeStore.addSection(section);
  }

  const createContactSection = () => {
    const id = uuidv4();
    
    const section: Omit<WireframeSection, "id"> = {
      name: "Contact Section",
      description: "Allow users to get in touch with you",
      sectionType: "contact",
      layoutType: "form",
      components: [
        {
          id: uuidv4(),
          type: "text",
          content: "Contact Form"
        }
      ]
    };
    
    wireframeStore.addSection(section);
  }

  const createFooterSection = () => {
    const id = uuidv4();
    
    const section: Omit<WireframeSection, "id"> = {
      name: "Footer",
      description: "Page footer with copyright information and links",
      sectionType: "footer",
      layoutType: "horizontal",
      components: [
        {
          id: uuidv4(),
          type: "text",
          content: "Copyright Information"
        },
        {
          id: uuidv4(),
          type: "text",
          content: "Links"
        }
      ]
    };
    
    wireframeStore.addSection(section);
  }

  const createComponent = (type: string, content: string): WireframeComponent => {
    return {
      id: uuidv4(),
      type,
      content
    };
  };

  return (
    <div className="wireframe-ai-suggestions">
      <h3 className="text-lg font-medium mb-4">AI Suggestions</h3>
      <div className="space-y-2">
        <Button variant="outline" onClick={createHeroSection}>Add Hero Section</Button>
        <Button variant="outline" onClick={createFeaturesSection}>Add Features Section</Button>
        <Button variant="outline" onClick={createContactSection}>Add Contact Section</Button>
        <Button variant="outline" onClick={createFooterSection}>Add Footer Section</Button>
      </div>
    </div>
  );
};

export default WireframeAISuggestions;
