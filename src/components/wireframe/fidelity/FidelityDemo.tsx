
import React, { useState } from 'react';
import { FidelityProvider } from './FidelityContext';
import FidelityControls from '../controls/FidelityControls';
import { useFidelityRenderer } from '@/hooks/wireframe/use-fidelity-renderer';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import './fidelity-styles.css';

interface FidelityDemoProps {
  content?: React.ReactNode;
  className?: string;
}

const DemoContent = () => {
  const { currentLevel, settings } = useFidelityRenderer();
  
  return (
    <div className="space-y-6">
      <div className="rounded-lg overflow-hidden border">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Hero Section</h2>
          <p className="opacity-90">This is how the hero section would appear at {currentLevel} fidelity.</p>
          <Button className="mt-4 bg-white text-blue-600 hover:bg-gray-100">Learn More</Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <div className="text-2xl text-gray-400">Image {i}</div>
            </div>
            <CardContent className="pt-4">
              <h3 className="font-medium text-lg">Feature {i}</h3>
              <p className="text-muted-foreground mt-1">Description of this awesome feature that makes our product stand out.</p>
            </CardContent>
            <CardFooter className="border-t pt-2 text-xs text-muted-foreground small-detail">
              Last updated: 3 days ago
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="tertiary-element bg-muted p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Additional Information</h3>
        <p className="text-xs text-muted-foreground">This content will have lower visibility or be hidden at lower fidelity levels.</p>
      </div>
      
      <div className="micro-detail text-[10px] text-muted-foreground/70 text-center">
        Some very small detailed information that is only visible at high fidelity
      </div>
    </div>
  );
};

const FidelityDemo: React.FC<FidelityDemoProps> = ({ 
  content,
  className
}) => {
  const [activeTab, setActiveTab] = useState<string>('demo');
  
  return (
    <FidelityProvider initialLevel="medium" transitionDuration={500}>
      <div className={className}>
        <Tabs defaultValue="demo" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Multi-Level Fidelity System</h2>
            <TabsList>
              <TabsTrigger value="demo">Demo</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
            <TabsContent value="demo">
              {content || <DemoContent />}
            </TabsContent>
            
            <TabsContent value="controls">
              <div className="max-w-md mx-auto">
                <FidelityControls showDetailControls={true} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </FidelityProvider>
  );
};

export default FidelityDemo;
