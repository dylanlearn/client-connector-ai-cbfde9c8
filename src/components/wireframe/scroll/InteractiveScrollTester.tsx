
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ScrollAreaVisualizer from './ScrollAreaVisualizer';
import ScrollTriggerEffect from './ScrollTriggerEffect';
import { ArrowUp, Layers, PauseCircle, PlayCircle, Settings } from 'lucide-react';

interface InteractiveScrollTesterProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

/**
 * A tool for interactively testing scrollable areas, scroll events, and scroll-triggered effects
 */
export const InteractiveScrollTester: React.FC<InteractiveScrollTesterProps> = ({
  children,
  className,
  title = 'Interactive Scroll Tester',
}) => {
  // State for scroll settings
  const [scrollHeight, setScrollHeight] = useState<number>(600);
  const [scrollWidth, setScrollWidth] = useState<number>(300);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [highlightScrollbars, setHighlightScrollbars] = useState<boolean>(true);
  
  // State for scroll trigger settings
  const [triggerEffect, setTriggerEffect] = useState<'fade' | 'slide-up' | 'slide-left' | 'scale' | 'none'>('fade');
  const [triggerDelay, setTriggerDelay] = useState<number>(0);
  const [triggerDuration, setTriggerDuration] = useState<number>(500);
  const [triggerThreshold, setTriggerThreshold] = useState<number>(0.1);
  const [triggerOnce, setTriggerOnce] = useState<boolean>(true);
  const [debugMode, setDebugMode] = useState<boolean>(true);
  
  // Generated dummy content for testing if no children provided
  const [dummyContent, setDummyContent] = useState<JSX.Element[]>([]);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Generate dummy content for testing
  useEffect(() => {
    if (children) return;
    
    const generateContent = () => {
      const effects = ['fade', 'slide-up', 'slide-left', 'scale', 'none'] as const;
      const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100'];
      
      return Array.from({ length: 10 }, (_, i) => (
        <ScrollTriggerEffect
          key={i}
          effect={effects[i % effects.length]}
          delay={i * 100}
          duration={triggerDuration}
          threshold={triggerThreshold}
          triggerOnce={triggerOnce}
          debugMode={debugMode}
        >
          <div className={cn(
            "border rounded p-4 mb-4",
            colors[i % colors.length]
          )}>
            <h3 className="text-lg font-medium mb-2">Scroll Test Item {i + 1}</h3>
            <p className="text-sm text-gray-600">
              This is a test item with {effects[i % effects.length]} effect.
              Scroll to reveal more items below.
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Delay: {i * 100}ms, Duration: {triggerDuration}ms, Effect: {effects[i % effects.length]}
            </div>
          </div>
        </ScrollTriggerEffect>
      ));
    };
    
    setDummyContent(generateContent());
  }, [children, triggerDuration, triggerThreshold, triggerOnce, debugMode]);
  
  // Auto-scroll function for testing
  useEffect(() => {
    if (!isScrolling) return;
    
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;
    
    const scrollStep = 2;
    const interval = setInterval(() => {
      if (scrollDirection === 'down') {
        scrollContainer.scrollTop += scrollStep;
        if (scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          setScrollDirection('up');
        }
      } else {
        scrollContainer.scrollTop -= scrollStep;
        if (scrollContainer.scrollTop <= 0) {
          setScrollDirection('down');
        }
      }
    }, 16);
    
    return () => clearInterval(interval);
  }, [isScrolling, scrollDirection]);
  
  // Toggle auto-scroll
  const toggleAutoScroll = () => {
    setIsScrolling(!isScrolling);
  };
  
  // Scroll to top
  const scrollToTop = () => {
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  };
  
  return (
    <Card className={cn("interactive-scroll-tester", className)}>
      <CardHeader className="pb-0 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleAutoScroll}
            >
              {isScrolling ? (
                <PauseCircle size={16} className="mr-1" />
              ) : (
                <PlayCircle size={16} className="mr-1" />
              )}
              {isScrolling ? 'Stop' : 'Auto-scroll'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={scrollToTop}
            >
              <ArrowUp size={16} className="mr-1" />
              Top
            </Button>
            
            <Button
              variant={showSettings ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {showSettings && (
        <CardContent className="pt-4 px-4">
          <Tabs defaultValue="scroll-settings">
            <TabsList>
              <TabsTrigger value="scroll-settings">Scroll Area</TabsTrigger>
              <TabsTrigger value="trigger-settings">Trigger Effects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scroll-settings" className="pt-3 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scroll-height">Height (px)</Label>
                  <Input
                    id="scroll-height"
                    type="number"
                    value={scrollHeight}
                    onChange={(e) => setScrollHeight(parseInt(e.target.value) || 300)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scroll-width">Width</Label>
                  <Select
                    value={scrollWidth.toString()}
                    onValueChange={(val) => setScrollWidth(parseInt(val))}
                  >
                    <SelectTrigger id="scroll-width">
                      <SelectValue placeholder="Select width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100%">Full width (100%)</SelectItem>
                      <SelectItem value="300">300px</SelectItem>
                      <SelectItem value="500">500px</SelectItem>
                      <SelectItem value="800">800px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-controls"
                    checked={showControls}
                    onCheckedChange={setShowControls}
                  />
                  <Label htmlFor="show-controls">Show controls</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="highlight-scrollbars"
                    checked={highlightScrollbars}
                    onCheckedChange={setHighlightScrollbars}
                  />
                  <Label htmlFor="highlight-scrollbars">Highlight scrollbars</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trigger-settings" className="pt-3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trigger-effect">Effect Type</Label>
                <Select
                  value={triggerEffect}
                  onValueChange={(val) => setTriggerEffect(val as any)}
                >
                  <SelectTrigger id="trigger-effect">
                    <SelectValue placeholder="Select effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Fade In</SelectItem>
                    <SelectItem value="slide-up">Slide Up</SelectItem>
                    <SelectItem value="slide-left">Slide Left</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger-duration">
                    Duration: {triggerDuration}ms
                  </Label>
                  <Slider
                    id="trigger-duration"
                    value={[triggerDuration]}
                    min={0}
                    max={2000}
                    step={50}
                    onValueChange={([val]) => setTriggerDuration(val)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trigger-delay">
                    Delay: {triggerDelay}ms
                  </Label>
                  <Slider
                    id="trigger-delay"
                    value={[triggerDelay]}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={([val]) => setTriggerDelay(val)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trigger-threshold">
                  Intersection Threshold: {triggerThreshold}
                </Label>
                <Slider
                  id="trigger-threshold"
                  value={[triggerThreshold * 100]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={([val]) => setTriggerThreshold(val / 100)}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trigger-once"
                    checked={triggerOnce}
                    onCheckedChange={setTriggerOnce}
                  />
                  <Label htmlFor="trigger-once">Trigger once</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="debug-mode"
                    checked={debugMode}
                    onCheckedChange={setDebugMode}
                  />
                  <Label htmlFor="debug-mode">Debug mode</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
      
      <CardContent className={showSettings ? "pt-2" : "pt-4"} style={{ padding: '1rem' }}>
        <ScrollAreaVisualizer
          height={scrollHeight}
          width={scrollWidth === 100 ? '100%' : scrollWidth}
          showControls={showControls}
          highlightScrollbars={highlightScrollbars}
          showScrollPosition={true}
        >
          <div className="p-4 space-y-4">
            {/* Display provided children or dummy content */}
            {children || dummyContent}
          </div>
        </ScrollAreaVisualizer>
      </CardContent>
      
      <CardFooter className="px-4 py-2 text-xs text-gray-500 flex justify-between">
        <div className="flex items-center gap-1">
          <Layers size={14} />
          <span>Scroll event visualization</span>
        </div>
        
        {isScrolling && (
          <div className="flex items-center">
            <span>Auto-scrolling {scrollDirection}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default InteractiveScrollTester;
