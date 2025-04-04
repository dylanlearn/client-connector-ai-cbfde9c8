
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Project detail page component
 */
const ProjectDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Project Details</h1>
      <p className="text-gray-500">Project ID: {id}</p>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Project Information</h2>
        <p>This is a placeholder for the project detail page.</p>
      </Card>
    </div>
  );
};

export default ProjectDetail;
