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
  deviceType?: DeviceType;
  viewMode?: ViewMode;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ projectId, wireframeId, deviceType: propDeviceType = 'desktop', viewMode: propViewMode = 'preview' }) => {
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
  const [showAISectionComponentTypeSuggestions, setShowAISectionComponentTypeSuggestions] = useState(
