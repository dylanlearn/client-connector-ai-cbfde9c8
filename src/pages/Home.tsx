
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Design Better Websites with AI
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
                  Create stunning wireframes, analyze design patterns, and get AI-powered suggestions to build exceptional user experiences.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/login')} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/design-process')}
                  >
                    Explore Design Process
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Design Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900 flex items-center justify-center rounded-lg mb-4">
                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI Wireframe Generator</h3>
                  <p className="text-gray-600 dark:text-gray-300">Generate professional wireframes instantly with our AI-powered tool. Save time and focus on what matters.</p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900 flex items-center justify-center rounded-lg mb-4">
                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Website Pattern Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300">Analyze successful websites to identify patterns and insights for your own designs.</p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900 flex items-center justify-center rounded-lg mb-4">
                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Design Suggestions</h3>
                  <p className="text-gray-600 dark:text-gray-300">Get intelligent design recommendations to enhance user experience and visual appeal.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-blue-600 dark:bg-blue-800">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Design Process?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of designers and developers who are creating better websites faster with our AI-powered tools.</p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/register')}
              >
                Create Free Account
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">DesignAI</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">AI-powered design tools for the modern web.</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
              <p>&copy; 2025 DesignAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default Home;
