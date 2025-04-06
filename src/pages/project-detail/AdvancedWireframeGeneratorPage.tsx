import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdvancedWireframeGenerator } from '@/components/wireframe';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, BookOpen, History, PanelTop, Palette, Moon, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { HelpText } from '@/components/ui/help-text';
import { AdvancedWireframeService } from '@/services/ai/wireframe/advanced-wireframe-service';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const AdvancedWireframeGeneratorPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [styleModifiers, setStyleModifiers] = useState([]);
  const [componentVariants, setComponentVariants] = useState([]);
  const [activeTab, setActiveTab] = useState('generator');
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
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
    <div className={`container py-6 space-y-6 ${darkModeEnabled ? 'bg-gray-900 text-gray-100' : ''}`}>
      <PageHeader
        heading="Advanced Wireframe Generator"
        description="Create sophisticated wireframes using natural language and structured AI"
      />
      
      <div className="flex justify-end mb-2">
        <div className="flex items-center space-x-2">
          <Moon className="h-4 w-4 text-muted-foreground" />
          <Switch 
            checked={darkModeEnabled}
            onCheckedChange={setDarkModeEnabled}
            id="dark-mode"
          />
          <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
        </div>
      </div>
      
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
          <TabsTrigger value="styles" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            Styles
          </TabsTrigger>
          <TabsTrigger value="responsive" className="flex items-center gap-1">
            <Smartphone className="h-4 w-4" />
            Responsive
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
              darkMode={darkModeEnabled}
            />
          ) : (
            <Card className={`p-6 ${darkModeEnabled ? 'bg-gray-800 border-gray-700' : ''}`}>
              <HelpText>Select a project to generate wireframes</HelpText>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="guide" className="space-y-6">
          <Card className={`p-6 ${darkModeEnabled ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Wireframe Generation Guide</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Intent Extraction</h3>
                <p className={`${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  Describe what you want to build in natural language. Include:
                </p>
                <ul className={`list-disc list-inside mt-2 space-y-1 ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Page type (landing page, dashboard, etc.)</li>
                  <li>Visual style preferences (modern, minimal, bold)</li>
                  <li>Key sections you want to include</li>
                  <li>Any specific layout preferences</li>
                  <li>Interactive elements (collapsible sidebar, floating panels)</li>
                  <li>Color mode preferences (light/dark)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">2. Style Selection</h3>
                <p className={`${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  Choose from predefined style tokens that affect the overall design language:
                </p>
                <ul className={`list-disc list-inside mt-2 space-y-1 ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Modern - Clean and contemporary</li>
                  <li>Minimalist - Simplified and elegant</li>
                  <li>Brutalist - Raw and unconventional</li>
                  <li>Glassy - Transparent with blur effects</li>
                  <li>Corporate - Professional and structured</li>
                  <li>Playful - Energetic with vibrant elements</li>
                  <li>Editorial - Typography-focused with elegant spacing</li>
                  <li>Tech-forward - Modern with geometric shapes</li>
                  <li>Futuristic - Sleek with advanced UI patterns</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">3. Dashboard-Specific Features</h3>
                <p className={`${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  For dashboards, specify these important components:
                </p>
                <ul className={`list-disc list-inside mt-2 space-y-1 ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li><strong>Navigation:</strong> Sidebar (collapsible/fixed), top bar, or both</li>
                  <li><strong>Layout:</strong> Card-based, panels, or grid</li>
                  <li><strong>Data Visualization:</strong> Charts, metrics, tables</li>
                  <li><strong>Above-fold Content:</strong> Which KPIs should remain visible</li>
                  <li><strong>Interactivity:</strong> Draggable cards, expandable sections</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">4. Example Prompts</h3>
                <div className={`space-y-2 ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p className="font-medium">Finance Dashboard:</p>
                  <p className={`text-sm ${darkModeEnabled ? 'bg-gray-700' : 'bg-gray-50'} p-2 rounded`}>
                    "Create a sleek finance dashboard with a collapsible sidebar, floating metric cards, and dark mode. Include a main KPI section above the fold, transaction history table, and interactive charts. Use a futuristic style with subtle animations and make it fully responsive."
                  </p>
                  
                  <p className="font-medium mt-3">Analytics Platform:</p>
                  <p className={`text-sm ${darkModeEnabled ? 'bg-gray-700' : 'bg-gray-50'} p-2 rounded`}>
                    "Design a data analytics platform with a fixed side navigation, card-based metrics at the top, and detailed data tables below. Include filter controls and use a clean, minimal interface with clear data hierarchy."
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="space-y-6">
          <Card className={`p-6 ${darkModeEnabled ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Component Library</h2>
            <p className={`mb-6 ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
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
                  <div key={componentType} className={`border rounded-lg p-4 ${darkModeEnabled ? 'border-gray-700 bg-gray-800/50' : ''}`}>
                    <h3 className="font-medium mb-3">{componentType}</h3>
                    <div className="space-y-2">
                      {variants.map((variant: any) => (
                        <div key={variant.id} className={`flex justify-between text-sm border-b pb-2 ${darkModeEnabled ? 'border-gray-700' : ''}`}>
                          <span>{variant.variant_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className={`${darkModeEnabled ? 'text-gray-400' : 'text-gray-500'} col-span-2`}>Loading component variants...</p>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="styles" className="space-y-6">
          <Card className={`p-6 ${darkModeEnabled ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Style Presets</h2>
            <p className={`mb-6 ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
              Visual style tokens that define the look and feel of your wireframes:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {['Minimalist', 'Corporate', 'Tech', 'Futuristic', 'Glassy', 'Brutalist'].map((style) => (
                <div 
                  key={style} 
                  className={`p-4 rounded-lg border ${darkModeEnabled ? 'border-gray-700 hover:border-gray-500' : 'hover:border-gray-300'} cursor-pointer transition-colors`}
                >
                  <h3 className="font-medium">{style}</h3>
                  <p className={`text-sm mt-1 ${darkModeEnabled ? 'text-gray-400' : 'text-gray-500'}`}>
                    {style === 'Minimalist' && 'Clean, simple, and elegant'}
                    {style === 'Corporate' && 'Professional and structured'}
                    {style === 'Tech' && 'Modern with geometric elements'}
                    {style === 'Futuristic' && 'Sleek with advanced UI patterns'}
                    {style === 'Glassy' && 'Transparent with blur effects'}
                    {style === 'Brutalist' && 'Raw and unconventional'}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Dark Mode Variations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg bg-gray-900 border border-gray-800 text-gray-200`}>
                  <h4 className="font-medium text-white">Deep Dark</h4>
                  <p className="text-sm mt-1 text-gray-400">Rich blacks with high contrast</p>
                </div>
                <div className={`p-4 rounded-lg bg-gray-800 border border-gray-700 text-gray-200`}>
                  <h4 className="font-medium text-white">Soft Dark</h4>
                  <p className="text-sm mt-1 text-gray-400">Softer dark tones with less contrast</p>
                </div>
                <div className={`p-4 rounded-lg bg-[#1a1f2c] border border-gray-800 text-gray-200`}>
                  <h4 className="font-medium text-white">Dark Purple</h4>
                  <p className="text-sm mt-1 text-gray-400">Dark with subtle purple undertones</p>
                </div>
                <div className={`p-4 rounded-lg bg-[#0c1116] border border-gray-800 text-gray-200`}>
                  <h4 className="font-medium text-white">Midnight</h4>
                  <p className="text-sm mt-1 text-gray-400">Very dark with blue undertones</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="responsive" className="space-y-6">
          <Card className={`p-6 ${darkModeEnabled ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Responsive Design Patterns</h2>
            <p className={`mb-6 ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
              Approaches for creating responsive wireframes across different devices:
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Desktop to Mobile Transformation</h3>
                <div className={`p-4 rounded-lg ${darkModeEnabled ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <ul className={`list-disc list-inside space-y-2 ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li><strong>Sidebars:</strong> Transform to bottom navigation or hamburger menu</li>
                    <li><strong>Multi-column layouts:</strong> Stack vertically on mobile</li>
                    <li><strong>Data tables:</strong> Collapse or scroll horizontally</li>
                    <li><strong>KPI metrics:</strong> Prioritize which metrics remain visible</li>
                    <li><strong>Card grids:</strong> Convert to single-column scrollable list</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Dashboard-Specific Patterns</h3>
                <div className={`p-4 rounded-lg ${darkModeEnabled ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <ul className={`list-disc list-inside space-y-2 ${darkModeEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li><strong>Above-fold strategy:</strong> Keep critical KPIs visible in initial viewport</li>
                    <li><strong>Collapsible sections:</strong> Use accordions to manage vertical space</li>
                    <li><strong>Floating action buttons:</strong> For key actions on mobile</li>
                    <li><strong>Chart adaptations:</strong> Simplify complex visualizations for smaller screens</li>
                    <li><strong>Progressive disclosure:</strong> Hide secondary information behind interactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card className={`p-6 ${darkModeEnabled ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Wireframe History</h2>
            <p className={`${darkModeEnabled ? 'text-gray-400' : 'text-gray-500'}`}>
              Your previously generated wireframes will appear here.
            </p>
            
            {/* This would typically fetch and display wireframe history from the database */}
            <div className={`mt-4 text-center py-8 ${darkModeEnabled ? 'text-gray-500 border-gray-700' : 'text-gray-400'} border-2 border-dashed rounded-lg`}>
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
