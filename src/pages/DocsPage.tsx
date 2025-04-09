
import React from 'react';

export const DocsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to our documentation. This guide will help you get started with our design platform and make the most of its features.
            </p>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">Quick Start Guide</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Create an account or sign in</li>
                <li>Create a new project</li>
                <li>Choose a template or start from scratch</li>
                <li>Use the wireframe studio to design your interface</li>
                <li>Save and export your designs</li>
              </ol>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Wireframe Studio</h3>
                <p className="text-muted-foreground">
                  Our drag-and-drop wireframe studio allows you to quickly create interactive wireframes and prototypes.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Design Canvas</h3>
                <p className="text-muted-foreground">
                  The advanced design canvas gives you pixel-perfect control over your designs with powerful editing tools.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Collaboration</h3>
                <p className="text-muted-foreground">
                  Work together with your team in real-time, with commenting and feedback features built-in.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">API Reference</h2>
            <p className="text-muted-foreground mb-4">
              For developers looking to integrate with our platform, we provide a comprehensive API.
            </p>
            <div className="bg-card p-6 rounded-lg border">
              <code className="block whitespace-pre overflow-x-auto bg-muted p-4 rounded">
{`// Example API request
fetch('https://api.example.com/designs', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
              </code>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
