
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FabricDesignCanvas from '@/components/wireframe/fabric/FabricDesignCanvas';
import { useToast } from '@/hooks/use-toast';

const DesignCanvasPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const handleSaveCanvas = (canvasData: any) => {
    try {
      // Here you would typically save the canvas data to your backend
      // For now we'll just log to console and show a toast
      console.log('Saved canvas data:', canvasData);
      toast({
        title: "Canvas saved",
        description: "Your design has been saved successfully."
      });
      
      // You could also save to localStorage for demo purposes
      localStorage.setItem(`canvas-${id || 'default'}`, JSON.stringify(canvasData));
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast({
        title: "Error saving canvas",
        description: "There was an error saving your design. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Load canvas data from localStorage or backend
  const loadCanvasData = () => {
    try {
      const savedData = localStorage.getItem(`canvas-${id || 'default'}`);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error loading canvas data:', error);
      return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Design Canvas</h1>
          <p className="text-muted-foreground">
            Create and customize your design using the interactive canvas
          </p>
        </div>
        
        <div className="bg-card rounded-lg shadow-lg overflow-hidden h-[calc(100vh-12rem)]">
          <FabricDesignCanvas 
            onSave={handleSaveCanvas} 
            initialJson={loadCanvasData()}
            showRulers={true}
            showPropertyPanel={true}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DesignCanvasPage;
