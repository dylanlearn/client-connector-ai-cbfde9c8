
import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Laptop, Tablet, Smartphone, Sun, Moon, Sparkles, Download } from "lucide-react";
import { useWireframeGeneration } from "@/hooks/use-wireframe-generation";
import { WireframeVisualizer } from ".";
import { v4 as uuidv4 } from 'uuid';
import { ViewMode, DeviceType } from './types';
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";

export interface AdvancedWireframeGeneratorProps {
  projectId?: string;
  viewMode?: ViewMode;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
  initialPrompt?: string;
  enhancedCreativity?: boolean;
  intakeData?: any;
}

export const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  viewMode = "preview",
  onWireframeGenerated,
  initialPrompt = "",
  enhancedCreativity = true,
  intakeData,
}) => {
  // Local state
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType>("desktop");
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("generator");

  // Use the generation hook
  const {
    isGenerating,
    currentWireframe,
    generateWireframe,
    creativityLevel,
    setCreativityLevel,
  } = useWireframeGeneration();

  // Generate wireframe from the prompt
  const handleGenerateClick = useCallback(async () => {
    if (!prompt.trim()) return;

    // Ensure there's a valid project ID
    const effectiveProjectId = projectId || uuidv4();
    
    // Set up color scheme for the wireframe
    const colorScheme = {
      primary: "#3b82f6", // Blue
      secondary: "#10b981", // Green
      accent: "#f97316", // Orange
      background: darkMode ? "#1f2937" : "#ffffff",
    };
    
    // Generate the wireframe
    const result = await generateWireframe({
      description: prompt,
      projectId: effectiveProjectId,
      enhancedCreativity,
      creativityLevel,
      colorScheme,
      customParams: {
        darkMode: darkMode,
        deviceType: selectedDeviceType,
      },
    });

    // If there's a callback, pass the generated wireframe
    if (result && result.wireframe && onWireframeGenerated) {
      onWireframeGenerated(result.wireframe);
    }

  }, [prompt, projectId, generateWireframe, darkMode, selectedDeviceType, creativityLevel, enhancedCreativity, onWireframeGenerated]);

  // Process intake data if provided
  useEffect(() => {
    if (intakeData && Object.keys(intakeData).length > 0) {
      // Extract relevant information for the prompt
      const { businessName, businessType, mission, vision } = intakeData;
      
      // Create a prompt based on the intake data
      let generatedPrompt = `Create a ${businessType || 'business'} website`;
      
      if (businessName) {
        generatedPrompt += ` for ${businessName}`;
      }
      
      if (mission || vision) {
        generatedPrompt += ` that focuses on ${mission || vision}`;
      }
      
      // Set the generated prompt
      setPrompt(generatedPrompt);
    }
  }, [intakeData]);

  // Export wireframe to JSON
  const handleExport = () => {
    if (!currentWireframe?.wireframe) return;
    
    const dataStr = JSON.stringify(currentWireframe.wireframe, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `wireframe-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Wireframe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                    Describe your website
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the website you want to create, e.g., 'A modern SaaS landing page with features, pricing, and testimonials'"
                    className="min-h-[100px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">Creativity Level:</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={creativityLevel}
                    onChange={(e) => setCreativityLevel(parseInt(e.target.value))}
                    className="w-full max-w-xs"
                  />
                  <span className="text-sm">{creativityLevel}/10</span>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleGenerateClick}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full max-w-xs"
                  >
                    {isGenerating ? "Generating..." : "Generate Wireframe"}
                    {enhancedCreativity && !isGenerating && <Sparkles className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Wireframe Preview</CardTitle>
              <div className="flex items-center space-x-2">
                <Toggle
                  pressed={darkMode}
                  onPressedChange={setDarkMode}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Toggle>
                <div className="flex border rounded-md">
                  <Button
                    variant={selectedDeviceType === "desktop" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDeviceType("desktop")}
                    className="rounded-r-none"
                  >
                    <Laptop className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedDeviceType === "tablet" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDeviceType("tablet")}
                    className="rounded-none"
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedDeviceType === "mobile" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDeviceType("mobile")}
                    className="rounded-l-none"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-auto">
              {currentWireframe?.wireframe ? (
                <div className={`border-t p-4 ${selectedDeviceType === "mobile" ? "max-w-[375px]" : selectedDeviceType === "tablet" ? "max-w-[768px]" : "w-full"} mx-auto`}>
                  <WireframeVisualizer
                    wireframe={currentWireframe.wireframe}
                    darkMode={darkMode}
                    deviceType={selectedDeviceType}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center p-12 border-t text-muted-foreground">
                  Generate a wireframe to preview it here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleExport} 
                disabled={!currentWireframe?.wireframe}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
              <p className="text-sm text-muted-foreground">
                The exported file contains all wireframe data that you can import later or use in other applications.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedWireframeGenerator;
