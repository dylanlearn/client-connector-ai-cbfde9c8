
import React from 'react';

export const DocsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Documentation</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to use our wireframing and design tools effectively.
        </p>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Creating Your First Project</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to set up your first wireframe project and understand the basics of our interface.
                </p>
                <a href="#" className="text-primary hover:underline">Read Guide →</a>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Understanding the Canvas</h3>
                <p className="text-muted-foreground mb-4">
                  Get familiar with the canvas area, toolbars, and how to navigate your wireframe effectively.
                </p>
                <a href="#" className="text-primary hover:underline">Read Guide →</a>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Working with Components</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to use our component library and create custom components for your designs.
                </p>
                <a href="#" className="text-primary hover:underline">Read Guide →</a>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Advanced Features</h2>
            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to collaborate with your team in real-time and manage design permissions.
                </p>
                <a href="#" className="text-primary hover:underline">Read Guide →</a>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Design Systems</h3>
                <p className="text-muted-foreground mb-4">
                  Create and manage design systems to ensure consistency across all your projects.
                </p>
                <a href="#" className="text-primary hover:underline">Read Guide →</a>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">AI Design Assistance</h3>
                <p className="text-muted-foreground mb-4">
                  Leverage our AI tools to generate wireframes and get design suggestions.
                </p>
                <a href="#" className="text-primary hover:underline">Read Guide →</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
