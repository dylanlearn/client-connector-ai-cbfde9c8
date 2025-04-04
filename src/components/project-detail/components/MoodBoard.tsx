
import React from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MoodBoardProps {
  projectId: string;
}

const MoodBoard: React.FC<MoodBoardProps> = ({ projectId }) => {
  // Simulated mood board images
  const images = [
    { id: '1', url: '/lovable-uploads/9d1c9181-4f19-48e3-b424-cbe28ccb9ad1.png' },
    { id: '2', url: '/lovable-uploads/a3b75d3c-550b-44e0-b81b-4d74404d106c.png' },
    { id: '3', url: '/lovable-uploads/d9eb0f5d-57b5-4d7e-8da0-23bc6c9c83f1.png' },
    { id: '4', url: '/lovable-uploads/480f7861-cc1e-41e1-9ee1-be7ba9aa52b9.png' }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Inspiration Gallery</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(image => (
          <Card key={image.id} className="overflow-hidden group relative cursor-pointer">
            <img 
              src={image.url} 
              alt="Mood board inspiration" 
              className="w-full h-40 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity" />
          </Card>
        ))}
        
        <Card className="border-dashed flex items-center justify-center h-40 cursor-pointer hover:bg-gray-50">
          <div className="text-center">
            <Plus className="h-6 w-6 mx-auto mb-1 text-gray-400" />
            <p className="text-sm text-gray-500">Add Image</p>
          </div>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Design Notes</h3>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <p className="text-gray-700 mb-3">
            The client prefers a clean, modern aesthetic with plenty of white space. They're drawn to minimal
            interfaces with bold typography and subtle animations. Color preferences lean toward blues and grays
            with occasional bright accent colors.
          </p>
          <p className="text-gray-700">
            Website analyzer insights suggest that their target audience responds well to immersive imagery
            and clear, direct call-to-actions. Navigation should be intuitive with minimal clicks required to
            reach important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodBoard;
