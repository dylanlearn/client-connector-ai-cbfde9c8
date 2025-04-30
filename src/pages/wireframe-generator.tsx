
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WireframeEditor } from '@/components/wireframe';
import DashboardLayout from '@/components/layout/DashboardLayout';

const WireframeGeneratorPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Wireframe Editor</h1>
        <p className="text-muted-foreground mb-8">Create and edit wireframes with our performance-optimized editor</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Wireframe Editor</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-8">
            <div className="min-h-[600px] border rounded-md">
              <WireframeEditor
                viewMode="edit"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WireframeGeneratorPage;
