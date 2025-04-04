
import React, { useState } from 'react';
import { Map, Plus, Download, Share2 } from 'lucide-react';
import { Project } from '@/types/project';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import SiteMapSection from '../components/SiteMapSection';
import SiteMapVisualization from '../components/SiteMapVisualization';

interface ProjectSiteMapTabProps {
  project: Project;
}

const ProjectSiteMapTab: React.FC<ProjectSiteMapTabProps> = ({ project }) => {
  const [viewMode, setViewMode] = useState<'list' | 'visual'>('visual');
  
  // These would come from the database in a real implementation
  const siteMapSections = [
    { id: '1', name: 'Homepage', type: 'page', children: [] },
    { id: '2', name: 'About Us', type: 'page', children: [] },
    { id: '3', name: 'Services', type: 'page', children: [
      { id: '3.1', name: 'Service A', type: 'section' },
      { id: '3.2', name: 'Service B', type: 'section' },
      { id: '3.3', name: 'Service C', type: 'section' },
    ]},
    { id: '4', name: 'Portfolio', type: 'page', children: [] },
    { id: '5', name: 'Contact', type: 'page', children: [] },
    { id: '6', name: 'Blog', type: 'page', children: [] }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === 'visual' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('visual')}
          >
            <Map className="h-4 w-4 mr-2" />
            Visual Sitemap
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ul className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      {viewMode === 'visual' ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <SiteMapVisualization sections={siteMapSections} />
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Site Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {siteMapSections.map(section => (
                <SiteMapSection key={section.id} section={section} />
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Headers</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <h1 className="text-3xl font-bold mb-2">H1 Header</h1>
                <p className="text-sm text-gray-500">Font: Montserrat Bold, 36px</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mt-3">
                <h2 className="text-2xl font-bold mb-2">H2 Header</h2>
                <p className="text-sm text-gray-500">Font: Montserrat Bold, 28px</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mt-3">
                <h3 className="text-xl font-bold mb-2">H3 Header</h3>
                <p className="text-sm text-gray-500">Font: Montserrat SemiBold, 22px</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Paragraphs</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-2">Regular paragraph text.</p>
                <p className="text-sm text-gray-500">Font: Inter Regular, 16px</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Buttons & Links</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md mb-2">Button Text</button>
                <p className="text-sm text-gray-500">Font: Inter SemiBold, 14px</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md mt-3">
                <a href="#" className="text-blue-600 underline mb-2">Link Text</a>
                <p className="text-sm text-gray-500">Font: Inter Medium, 16px</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="h-20 rounded-md bg-blue-600 mb-2"></div>
                <p className="font-medium">Primary Blue</p>
                <p className="text-sm text-gray-500">#2563EB</p>
              </div>
              <div>
                <div className="h-20 rounded-md bg-gray-800 mb-2"></div>
                <p className="font-medium">Dark Gray</p>
                <p className="text-sm text-gray-500">#1F2937</p>
              </div>
              <div>
                <div className="h-20 rounded-md bg-green-500 mb-2"></div>
                <p className="font-medium">Success Green</p>
                <p className="text-sm text-gray-500">#10B981</p>
              </div>
              <div>
                <div className="h-20 rounded-md bg-red-500 mb-2"></div>
                <p className="font-medium">Error Red</p>
                <p className="text-sm text-gray-500">#EF4444</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectSiteMapTab;
