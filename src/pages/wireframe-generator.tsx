
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WireframeEditor, AdvancedWireframeGenerator } from '@/components/wireframe';
import DashboardLayout from '@/components/layout/DashboardLayout';

const WireframeGeneratorPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Wireframe Generator</h1>
      <p className="text-muted-foreground mb-8">Create professional wireframes with our AI-powered generator</p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Advanced Wireframe Generator</CardTitle>
          <CardDescription>
            Generate complete wireframes based on your project requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-8">
          <div className="min-h-[600px] border rounded-md">
            <AdvancedWireframeGenerator
              viewMode="edit"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Wireframe Editor</CardTitle>
          <CardDescription>
            Edit and customize generated wireframes
          </CardDescription>
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
  );
};

export default WireframeGeneratorPage;
