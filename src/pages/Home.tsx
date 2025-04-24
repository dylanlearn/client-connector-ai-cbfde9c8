
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
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
            <h2 className="text-xl font-semibold mb-3">Client Collaboration</h2>
            <p className="text-gray-600 mb-4">
              Easily share designs with clients and gather feedback in one place.
            </p>
            <Link to="/client-hub">
              <Button variant="outline">View Client Hub</Button>
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
          <Link to="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
