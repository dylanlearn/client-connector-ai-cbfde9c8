
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Badge } from '@/components/ui/badge';

interface HeroSectionRendererProps {
  section: WireframeSection;
  viewMode: 'preview' | 'flowchart';
  darkMode?: boolean;
}

const HeroSectionRenderer: React.FC<HeroSectionRendererProps> = ({ 
  section, 
  viewMode,
  darkMode = false
}) => {
  // Extract relevant properties from the section
  const variant = section.componentVariant || 'hero-standard-001';
  const styleProperties = section.styleProperties || {};
  
  // Basic rendering for flowchart mode (simplified representation)
  if (viewMode === 'flowchart') {
    return (
      <div className="border-2 border-dashed p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{section.sectionType}: {variant}</Badge>
        </div>
        <h3 className="text-md font-medium">{section.name}</h3>
        <p className="text-sm text-muted-foreground">{section.description || 'Hero section'}</p>
      </div>
    );
  }
  
  // Preview mode rendering - select the appropriate variant
  switch (variant) {
    case 'hero-centered-001':
      return (
        <div className={`py-16 px-4 text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Your Main Headline</h1>
            <p className="text-xl mb-8">A supporting subheading that provides more context and details about your offer.</p>
            <div className="flex justify-center space-x-4">
              <button className={`px-6 py-3 rounded-md ${darkMode ? 'bg-primary text-primary-foreground' : 'bg-primary text-white'}`}>
                Primary CTA
              </button>
              <button className={`px-6 py-3 rounded-md border ${darkMode ? 'border-white text-white' : 'border-gray-800 text-gray-800'}`}>
                Secondary CTA
              </button>
            </div>
          </div>
        </div>
      );
      
    case 'hero-split-001':
      return (
        <div className={`grid md:grid-cols-2 gap-8 items-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">Split Hero Headline</h1>
            <p className="text-lg mb-6">A detailed description of your product or service that appears next to an image.</p>
            <button className={`px-6 py-3 rounded-md ${darkMode ? 'bg-primary text-primary-foreground' : 'bg-primary text-white'}`}>
              Learn More
            </button>
          </div>
          <div className={`h-64 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} flex items-center justify-center`}>
            <span className="text-lg">Image Placeholder</span>
          </div>
        </div>
      );
    
    case 'hero-ecom-001':
      return (
        <div className={`px-8 py-12 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <h1 className="text-3xl font-bold mb-2">Product Headline</h1>
              <p className="text-lg mb-4">Short product description highlighting key benefits.</p>
              <div className="mb-6">
                <span className={`text-2xl font-bold ${darkMode ? 'text-primary' : 'text-primary'}`}>$199.00</span>
                <span className="ml-2 line-through text-muted-foreground">$249.00</span>
              </div>
              <div className="flex space-x-3">
                <button className={`px-6 py-3 rounded-md ${darkMode ? 'bg-primary text-primary-foreground' : 'bg-primary text-white'}`}>
                  Add to Cart
                </button>
                <button className={`px-6 py-3 rounded-md border ${darkMode ? 'border-white text-white' : 'border-gray-800 text-gray-800'}`}>
                  Details
                </button>
              </div>
            </div>
            <div className={`md:col-span-2 h-64 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} flex items-center justify-center rounded-lg`}>
              <span className="text-lg">Product Image</span>
            </div>
          </div>
        </div>
      );
          
    // Default to standard hero
    default:
      return (
        <div className={`py-16 px-8 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">Standard Hero Headline</h1>
            <p className="text-xl mb-8 max-w-2xl">A compelling description that explains the value of your product or service.</p>
            <div className="flex space-x-4">
              <button className={`px-6 py-3 rounded-md ${darkMode ? 'bg-primary text-primary-foreground' : 'bg-primary text-white'}`}>
                Get Started
              </button>
              <button className={`px-6 py-3 rounded-md border ${darkMode ? 'border-white text-white' : 'border-gray-800 text-gray-800'}`}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      );
  }
};

export default HeroSectionRenderer;
