import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import WireframeVisualizer from '@/components/wireframe/WireframeVisualizer';
import { useNavigate } from 'react-router-dom';

interface WireframeListProps {
  projectId: string;
}

const WireframeList: React.FC<WireframeListProps> = ({ projectId }) => {
  const navigate = useNavigate();
  
  // Mock data for wireframes
  const wireframes = [
    {
      id: '1',
      title: 'Homepage Wireframe',
      description: 'Main landing page wireframe',
      sections: []
    },
    {
      id: '2',
      title: 'About Page',
      description: 'About page with team info',
      sections: []
    }
  ];

  const handleNavigateToGenerator = () => {
    navigate(`/project/${projectId}/advanced-wireframe`);
  };
  
  const handleWireframeGenerated = () => {
    // Mock implementation
    console.log('Wireframe generated');
  };
  
  return (
    <div className="space-y-6">
      {wireframes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wireframes.map(wireframe => (
            <Card key={wireframe.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{wireframe.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 border-t">
                <WireframeVisualizer 
                  wireframe={wireframe}
                  darkMode={false}
                  deviceType="desktop"
                />
              </CardContent>
            </Card>
          ))}
          
          <Card className="border-dashed flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <Button 
                variant="outline" 
                className="h-16 w-16 rounded-full mb-4"
                onClick={handleNavigateToGenerator}
              >
                <Plus className="h-6 w-6" />
              </Button>
              <h3 className="font-medium">Create New Wireframe</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Generate a custom wireframe for this project
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="font-medium text-lg mb-2">No Wireframes Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first wireframe to visualize your project
          </p>
          <Button onClick={handleNavigateToGenerator}>
            <Plus className="h-4 w-4 mr-2" />
            Create Wireframe
          </Button>
        </div>
      )}
    </div>
  );
};

export default WireframeList;
