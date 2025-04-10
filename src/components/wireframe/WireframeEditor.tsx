
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useWireframeStore } from '@/stores/wireframe-store';
import { DeviceType, ViewMode } from './types';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Eye, EyeOff, Code2, LayoutDashboard, Smartphone, Tablet, Monitor, Save, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiWireframeToWireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useAIContent } from '@/hooks/use-ai-content';
import { useWireframeSections } from '@/hooks/wireframe/use-wireframe-sections';
import { useDebounce } from '@/hooks/use-debounce';
import { ComponentRegistration } from './registry/ComponentRegistration';
import WireframeVisualizer from './WireframeVisualizer';

interface WireframeEditorProps {
  projectId?: string;
  wireframeId?: string;
  wireframe?: WireframeData;
  deviceType?: DeviceType;
  viewMode?: ViewMode;
  onUpdate?: (updatedWireframe: WireframeData) => void;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ 
  projectId, 
  wireframeId, 
  wireframe,
  deviceType: propDeviceType = 'desktop', 
  viewMode: propViewMode = 'preview',
  onUpdate
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCanvasConfig, setShowCanvasConfig] = useState(false);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [showStyleGuide, setShowStyleGuide] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [showAIInspector, setShowAIInspector] = useState(false);
  const [showAISectionSuggestions, setShowAISectionSuggestions] = useState(false);
  const [showAIComponentSuggestions, setShowAIComponentSuggestions] = useState(false);
  const [showAIStyleSuggestions, setShowAIStyleSuggestions] = useState(false);
  const [showAILayoutSuggestions, setShowAILayoutSuggestions] = useState(false);
  const [showAICopySuggestions, setShowAICopySuggestions] = useState(false);
  const [showAIAnimationSuggestions, setShowAIAnimationSuggestions] = useState(false);
  const [showAIDesignReasoning, setShowAIDesignReasoning] = useState(false);
  const [showAIComponentVariantSuggestions, setShowAIComponentVariantSuggestions] = useState(false);
  const [showAISectionVariantSuggestions, setShowAISectionVariantSuggestions] = useState(false);
  const [showAISectionTypeSuggestions, setShowAISectionTypeSuggestions] = useState(false);
  const [showAISectionLayoutSuggestions, setShowASectionLayoutSuggestions] = useState(false);
  const [showAISectionStyleSuggestions, setShowAISectionStyleSuggestions] = useState(false);
  const [showAISectionAnimationSuggestions, setShowAISectionAnimationSuggestions] = useState(false);
  const [showAISectionCopySuggestions, setShowAISectionCopySuggestions] = useState(false);
  const [showAISectionComponentSuggestions, setShowAISectionComponentSuggestions] = useState(false);
  const [showAISectionComponentVariantSuggestions, setShowAISectionComponentVariantSuggestions] = useState(false);
  const [showAISectionComponentStyleSuggestions, setShowAISectionComponentStyleSuggestions] = useState(false);
  const [showAISectionComponentLayoutSuggestions, setShowAISectionComponentLayoutSuggestions] = useState(false);
  const [showAISectionComponentCopySuggestions, setShowAISectionComponentCopySuggestions] = useState(false);
  const [showAISectionComponentAnimationSuggestions, setShowAISectionComponentAnimationSuggestions] = useState(false);
  const [showAISectionComponentDesignReasoning, setShowAISectionComponentDesignReasoning] = useState(false);
  const [showAISectionComponentTypeSuggestions, setShowAISectionComponentTypeSuggestions] = useState(false);

  const [deviceType, setDeviceType] = useState<DeviceType>(propDeviceType);
  const [viewMode, setViewMode] = useState<ViewMode>(propViewMode);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | null>(wireframe || null);

  useEffect(() => {
    if (wireframe) {
      setCurrentWireframe(wireframe);
    }
  }, [wireframe]);

  const handleSectionClick = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
  }, []);

  useEffect(() => {
    if (currentWireframe && onUpdate) {
      onUpdate(currentWireframe);
    }
  }, [currentWireframe, onUpdate]);

  return (
    <div className="wireframe-editor flex flex-col h-full">
      <div className="toolbar flex items-center justify-between p-2 border-b">
        <div className="device-controls flex items-center space-x-2">
          <Button 
            size="sm" 
            variant={deviceType === 'desktop' ? 'default' : 'outline'}
            onClick={() => setDeviceType('desktop')}
          >
            <Monitor className="h-4 w-4 mr-1" /> Desktop
          </Button>
          <Button 
            size="sm" 
            variant={deviceType === 'tablet' ? 'default' : 'outline'}
            onClick={() => setDeviceType('tablet')}
          >
            <Tablet className="h-4 w-4 mr-1" /> Tablet
          </Button>
          <Button 
            size="sm" 
            variant={deviceType === 'mobile' ? 'default' : 'outline'}
            onClick={() => setDeviceType('mobile')}
          >
            <Smartphone className="h-4 w-4 mr-1" /> Mobile
          </Button>
        </div>
        
        <div className="view-controls flex items-center space-x-2">
          <Button 
            size="sm" 
            variant={viewMode === 'preview' ? 'default' : 'outline'}
            onClick={() => setViewMode('preview')}
          >
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === 'editor' ? 'default' : 'outline'}
            onClick={() => setViewMode('editor')}
          >
            <LayoutDashboard className="h-4 w-4 mr-1" /> Editor
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === 'code' ? 'default' : 'outline'}
            onClick={() => setViewMode('code')}
          >
            <Code2 className="h-4 w-4 mr-1" /> Code
          </Button>
        </div>
      </div>
      
      <div className="content-area flex flex-1">
        <div className="wireframe-canvas flex-1 p-4">
          {currentWireframe && (
            <WireframeVisualizer
              wireframe={currentWireframe}
              darkMode={false}
              deviceType={deviceType}
              viewMode={viewMode}
              onSectionClick={handleSectionClick}
              selectedSectionId={selectedSectionId}
            />
          )}
          
          {!currentWireframe && (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No wireframe data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WireframeEditor;
