
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="py-6 px-4 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">DezignSync</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <Button 
                variant="default" 
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => navigate('/login')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">AI-Powered Wireframe Design</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Create stunning wireframes and prototypes with our AI-assisted design platform.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => navigate(user ? '/wireframe-editor' : '/login')}
          >
            {user ? 'Start Designing' : 'Get Started'}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-xl font-semibold mb-2">AI-Powered Design</h4>
                <p className="text-gray-600">
                  Generate wireframes automatically with our advanced AI algorithms.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-xl font-semibold mb-2">Performance Monitoring</h4>
                <p className="text-gray-600">
                  Track and optimize the performance of your designs in real-time.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-xl font-semibold mb-2">Client Collaboration</h4>
                <p className="text-gray-600">
                  Share designs with clients and collect feedback seamlessly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to transform your design workflow?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of designers who are already using DezignSync.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/login')}
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-800 text-white">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} DezignSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
