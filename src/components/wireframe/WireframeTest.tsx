
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Wireframe from './Wireframe';
import { useWireframeStore } from '@/stores/wireframe-store';
import { v4 as uuidv4 } from 'uuid';
import { WireframeData } from '@/types/wireframe';

const WireframeTest = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'flowchart'>('preview');
  
  // Create a sample wireframe for testing
  const [sampleWireframe, setSampleWireframe] = useState<WireframeData>({
    id: uuidv4(),
    title: "Sample Wireframe",
    sections: [
      {
        id: uuidv4(),
        name: "Hero Section",
        sectionType: "hero",
        description: "Main hero section",
        position: { x: 20, y: 20 },
        dimensions: { width: 800, height: 400 }
      },
      {
        id: uuidv4(),
        name: "Features Section",
        sectionType: "features",
        description: "Features showcase",
        position: { x: 20, y: 440 },
        dimensions: { width: 800, height: 300 }
      },
      {
        id: uuidv4(),
        name: "Footer",
        sectionType: "footer",
        description: "Page footer",
        position: { x: 20, y: 760 },
        dimensions: { width: 800, height: 200 }
      }
    ]
  });

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="wireframe-test">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Wireframe Test</span>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={viewMode === 'preview' ? 'default' : 'outline'} 
                onClick={() => setViewMode('preview')}
              >
                Preview
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === 'code' ? 'default' : 'outline'} 
                onClick={() => setViewMode('code')}
              >
                Code
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === 'flowchart' ? 'default' : 'outline'} 
                onClick={() => setViewMode('flowchart')}
              >
                Flowchart
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={deviceType === 'desktop' ? 'default' : 'outline'} 
                onClick={() => setDeviceType('desktop')}
              >
                Desktop
              </Button>
              <Button 
                size="sm" 
                variant={deviceType === 'tablet' ? 'default' : 'outline'} 
                onClick={() => setDeviceType('tablet')}
              >
                Tablet
              </Button>
              <Button 
                size="sm" 
                variant={deviceType === 'mobile' ? 'default' : 'outline'} 
                onClick={() => setDeviceType('mobile')}
              >
                Mobile
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Wireframe 
              wireframe={sampleWireframe}
              viewMode={viewMode}
              darkMode={darkMode}
              deviceType={deviceType}
              onSectionClick={handleSectionClick}
              activeSection={activeSection}
            />
          </div>
          
          {activeSection && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium">Selected Section: {activeSection}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {sampleWireframe.sections.find(s => s.id === activeSection)?.description || 'No description'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WireframeTest;
