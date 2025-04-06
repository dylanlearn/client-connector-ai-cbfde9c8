
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdvancedWireframeGenerator } from '@/components/wireframe';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, BookOpen, History, PanelTop } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { HelpText } from '@/components/ui/help-text';
import { AdvancedWireframeService } from '@/services/ai/wireframe/advanced-wireframe-service';
import { supabase } from '@/integrations/supabase/client';

const AdvancedWireframeGeneratorPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [styleModifiers, setStyleModifiers] = useState([]);
  const [componentVariants, setComponentVariants] = useState([]);
  const [activeTab, setActiveTab] = useState('generator');
  
  // Fetch style modifiers and component variants on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [styleData, componentsData] = await Promise.all([
          AdvancedWireframeService.getStyleModifiers(),
          AdvancedWireframeService.getComponentVariants()
        ]);
        
        setStyleModifiers(styleData);
        setComponentVariants(componentsData);
      } catch (error) {
        console.error("Error fetching wireframe data:", error);
      }
    };
    
    fetchData();
  }, []);
  
  const refreshWireframes = () => {
    // This would typically fetch updated wireframe data
    console.log("Refreshing wireframes");
  };

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        heading="Advanced Wireframe Generator"
        description="Create sophisticated wireframes using natural language and structured AI"
      />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="generator" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-1">
            <PanelTop className="h-4 w-4" />
            Components
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6">
          {projectId ? (
            <AdvancedWireframeGenerator
              projectId={projectId}
              onWireframeGenerated={refreshWireframes}
              onWireframeSaved={refreshWireframes}
            />
          ) : (
            <Card className="p-6">
              <HelpText>Select a project to generate wireframes</HelpText>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="guide" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Wireframe Generation Guide</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Intent Extraction</h3>
                <p className="text-gray-600">
                  Describe what you want to build in natural language. Include:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                  <li>Page type (landing page, dashboard, etc.)</li>
                  <li>Visual style preferences (modern, minimal, bold)</li>
                  <li>Key sections you want to include</li>
                  <li>Any specific layout preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">2. Style Selection</h3>
                <p className="text-gray-600">
                  Choose from predefined style tokens that affect the overall design language:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                  <li>Modern - Clean and contemporary</li>
                  <li>Minimalist - Simplified and elegant</li>
                  <li>Brutalist - Raw and unconventional</li>
                  <li>Glassy - Transparent with blur effects</li>
                  <li>Corporate - Professional and structured</li>
                  <li>Playful - Energetic with vibrant elements</li>
                  <li>Editorial - Typography-focused with elegant spacing</li>
                  <li>Tech-forward - Modern with geometric shapes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">3. Design Memory</h3>
                <p className="text-gray-600">
                  Enable design memory to let the system learn from your previous wireframes.
                  This helps maintain consistency across your project's design language.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Example Prompts</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="font-medium">Landing Page:</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">
                    "Create a modern SaaS landing page with hero section, feature highlights, pricing table, and testimonials. Use a clean blue color scheme with subtle gradients."
                  </p>
                  
                  <p className="font-medium mt-3">Dashboard:</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">
                    "Design a dark-themed analytics dashboard with sidebar navigation, key metrics at the top, interactive charts in the middle, and a recent activity feed at the bottom."
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Component Library</h2>
            <p className="text-gray-600 mb-6">
              Available component variants that can be used in wireframes:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {componentVariants.length > 0 ? (
                Object.entries(
                  componentVariants.reduce((acc: any, curr: any) => {
                    if (!acc[curr.component_type]) {
                      acc[curr.component_type] = [];
                    }
                    acc[curr.component_type].push(curr);
                    return acc;
                  }, {})
                ).map(([componentType, variants]: [string, any]) => (
                  <div key={componentType} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">{componentType}</h3>
                    <div className="space-y-2">
                      {variants.map((variant: any) => (
                        <div key={variant.id} className="flex justify-between text-sm border-b pb-2">
                          <span>{variant.variant_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-2">Loading component variants...</p>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Wireframe History</h2>
            <p className="text-gray-500">
              Your previously generated wireframes will appear here.
            </p>
            
            {/* This would typically fetch and display wireframe history from the database */}
            <div className="mt-4 text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
              {projectId ? (
                "No wireframe history available for this project yet"
              ) : (
                "Select a project to view wireframe history"
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedWireframeGeneratorPage;
