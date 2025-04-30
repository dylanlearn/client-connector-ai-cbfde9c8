
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Home = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Wireframe Builder</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Wireframe Editor</h2>
              <p className="text-gray-600 mb-4">
                Create and edit wireframes with our advanced editor.
              </p>
              <a 
                href="/wireframe-editor" 
                className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Open Editor
              </a>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Performance Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Monitor application performance metrics.
              </p>
              <a 
                href="/performance-monitoring" 
                className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                View Dashboard
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
