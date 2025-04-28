
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DesignSpecificationEditor } from '@/components/design-handoff/DesignSpecificationEditor';
import { CodeGenerator } from '@/components/design-handoff/CodeGenerator';
import { DocumentationGenerator } from '@/components/design-handoff/DocumentationGenerator';

const DesignHandoffPage = () => {
  const { wireframeId } = useParams();

  if (!wireframeId) {
    return <div>No wireframe ID provided</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-8">Design Handoff</h1>
        
        <div className="grid gap-8">
          <DesignSpecificationEditor wireframeId={wireframeId} />
          <CodeGenerator wireframeId={wireframeId} />
          <DocumentationGenerator wireframeId={wireframeId} />
        </div>
      </div>
    </Layout>
  );
};

export default DesignHandoffPage;
