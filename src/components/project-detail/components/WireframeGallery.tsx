
import React from 'react';
import { Grid2X2, Grid3X3, Plus, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WireframeGalleryProps {
  projectId: string;
}

const WireframeGallery: React.FC<WireframeGalleryProps> = ({ projectId }) => {
  // Simulated wireframes data
  const wireframes = [
    { id: '1', title: 'Homepage', image: '/lovable-uploads/0392ac21-110f-484c-8f3d-5fcbb0dcefc6.png', lastModified: new Date() },
    { id: '2', title: 'About Us', image: '/lovable-uploads/23ecc16f-a53c-43af-8d71-1034d90498b3.png', lastModified: new Date() },
    { id: '3', title: 'Services', image: '/lovable-uploads/3ffcf93f-2dca-479f-867d-cc445acdac8d.png', lastModified: new Date() },
    { id: '4', title: 'Contact', image: '/lovable-uploads/4efe39c0-e0e0-4c25-a11a-d9f9648b0495.png', lastModified: new Date() }
  ];
  
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid2X2 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Wireframe
        </Button>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wireframes.map(wireframe => (
            <Card key={wireframe.id} className="overflow-hidden cursor-pointer group">
              <div className="relative">
                <img 
                  src={wireframe.image} 
                  alt={wireframe.title} 
                  className="w-full h-48 object-cover object-top transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button size="sm" variant="outline" className="text-white border-white">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium">{wireframe.title}</h3>
                <p className="text-xs text-gray-500">
                  Last updated: {wireframe.lastModified.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
          
          <Card className="border-dashed flex items-center justify-center h-48 cursor-pointer hover:bg-gray-50">
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Add New Wireframe</p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {wireframes.map(wireframe => (
            <Card key={wireframe.id} className="overflow-hidden">
              <div className="flex items-center p-3">
                <img 
                  src={wireframe.image} 
                  alt={wireframe.title} 
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{wireframe.title}</h3>
                  <p className="text-xs text-gray-500">
                    Last updated: {wireframe.lastModified.toLocaleDateString()}
                  </p>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WireframeGallery;
