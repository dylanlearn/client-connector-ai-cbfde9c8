
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

type OverflowValue = 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
type TextOverflowValue = 'clip' | 'ellipsis' | 'initial';

interface OverflowBehaviorDemoProps {
  className?: string;
  title?: string;
}

/**
 * A demo component for visualizing different overflow behaviors
 */
export const OverflowBehaviorDemo: React.FC<OverflowBehaviorDemoProps> = ({
  className,
  title = 'Overflow Behavior Demonstration'
}) => {
  const [overflowX, setOverflowX] = useState<OverflowValue>('auto');
  const [overflowY, setOverflowY] = useState<OverflowValue>('auto');
  const [textOverflow, setTextOverflow] = useState<TextOverflowValue>('ellipsis');
  const [whiteSpace, setWhiteSpace] = useState<'normal' | 'nowrap' | 'pre' | 'pre-wrap'>('normal');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [containerWidth, setContainerWidth] = useState<number>(300);
  const [containerHeight, setContainerHeight] = useState<number>(200);
  
  // Sample text for demo
  const sampleText = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur 
    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  `;
  
  // Sample grid for demo
  const sampleGrid = (
    <div className="grid grid-cols-4 gap-4 w-[500px]">
      {Array.from({ length: 16 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-blue-100 p-4 text-center rounded"
          style={{
            width: '100px',
            height: '80px'
          }}
        >
          Item {i+1}
        </div>
      ))}
    </div>
  );
  
  return (
    <Card className={cn("overflow-behavior-demo", className)}>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs defaultValue="container">
          <TabsList className="mb-4">
            <TabsTrigger value="container">Container Overflow</TabsTrigger>
            <TabsTrigger value="text">Text Overflow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="container">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overflow-x">Overflow X</Label>
                  <Select
                    value={overflowX}
                    onValueChange={(val) => setOverflowX(val as OverflowValue)}
                  >
                    <SelectTrigger id="overflow-x">
                      <SelectValue placeholder="Select overflow-x" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visible">visible</SelectItem>
                      <SelectItem value="hidden">hidden</SelectItem>
                      <SelectItem value="scroll">scroll</SelectItem>
                      <SelectItem value="auto">auto</SelectItem>
                      <SelectItem value="clip">clip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="overflow-y">Overflow Y</Label>
                  <Select
                    value={overflowY}
                    onValueChange={(val) => setOverflowY(val as OverflowValue)}
                  >
                    <SelectTrigger id="overflow-y">
                      <SelectValue placeholder="Select overflow-y" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visible">visible</SelectItem>
                      <SelectItem value="hidden">hidden</SelectItem>
                      <SelectItem value="scroll">scroll</SelectItem>
                      <SelectItem value="auto">auto</SelectItem>
                      <SelectItem value="clip">clip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Content Type</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-grid"
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                    <Label htmlFor="show-grid">Show Grid</Label>
                  </div>
                </div>
              </div>
              
              <div className="border border-dashed border-gray-300 p-4 rounded-md">
                <div
                  className="overflow-demo-container border border-gray-300 rounded-md p-2 relative"
                  style={{
                    width: `${containerWidth}px`,
                    height: `${containerHeight}px`,
                    overflowX: overflowX,
                    overflowY: overflowY,
                  }}
                >
                  <div className="absolute top-0 right-0 px-1 py-0.5 text-xs bg-black/50 text-white rounded-bl">
                    {containerWidth}×{containerHeight}
                  </div>
                  
                  {showGrid ? (
                    sampleGrid
                  ) : (
                    <div style={{ width: '400px' }}>
                      {sampleText.repeat(3)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-xs bg-gray-50 p-2 rounded border">
                <code className="font-mono">
                  overflow-x: {overflowX};<br />
                  overflow-y: {overflowY};
                </code>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="text-overflow">Text Overflow</Label>
                  <Select
                    value={textOverflow}
                    onValueChange={(val) => setTextOverflow(val as TextOverflowValue)}
                  >
                    <SelectTrigger id="text-overflow">
                      <SelectValue placeholder="Select text-overflow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clip">clip</SelectItem>
                      <SelectItem value="ellipsis">ellipsis</SelectItem>
                      <SelectItem value="initial">initial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="white-space">White Space</Label>
                  <Select
                    value={whiteSpace}
                    onValueChange={(val) => setWhiteSpace(val as any)}
                  >
                    <SelectTrigger id="white-space">
                      <SelectValue placeholder="Select white-space" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">normal</SelectItem>
                      <SelectItem value="nowrap">nowrap</SelectItem>
                      <SelectItem value="pre">pre</SelectItem>
                      <SelectItem value="pre-wrap">pre-wrap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="border border-dashed border-gray-300 p-4 rounded-md">
                <div
                  className="text-overflow-demo border border-gray-300 rounded-md p-2"
                  style={{
                    width: '300px',
                    textOverflow,
                    whiteSpace,
                    overflow: textOverflow === 'ellipsis' ? 'hidden' : 'visible'
                  }}
                >
                  <span className="text-sm">
                    This is a very long text that demonstrates text overflow behavior with different settings. It should overflow the container.
                  </span>
                </div>
              </div>
              
              <div className="text-xs bg-gray-50 p-2 rounded border">
                <code className="font-mono">
                  text-overflow: {textOverflow};<br />
                  white-space: {whiteSpace};<br />
                  {textOverflow === 'ellipsis' && 'overflow: hidden;'}
                </code>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OverflowBehaviorDemo;
