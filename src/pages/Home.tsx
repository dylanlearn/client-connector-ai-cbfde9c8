
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

const Home = () => {
  return (
    <Layout showFormResumeHandler={false}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Welcome to our Design Collaboration Platform</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create, collaborate, and perfect your designs with our powerful suite of tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Wireframing</h2>
              <p className="text-gray-600 mb-4">
                Create responsive wireframes with AI assistance and collaborative editing.
              </p>
              <Link to="/wireframe-demo">
                <Button variant="outline">Try Wireframing</Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Advanced Design System</h2>
              <p className="text-gray-600 mb-4">
                Explore content hierarchies, context-aware components, and design adaptations.
              </p>
              <Link to="/advanced-design-system">
                <Button variant="outline">Explore Design System</Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Document Collaboration</h2>
              <p className="text-gray-600 mb-4">
                Edit documents in real-time with comprehensive annotation features.
              </p>
              <Link to="/collaborative-document">
                <Button variant="outline">Try Document Editor</Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/variant-logic">
              <Button size="lg">Component Variant Logic Demo</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
