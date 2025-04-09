
import React from 'react';

export const HelpPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Help Center</h1>
        
        <div className="bg-card rounded-lg border p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">How do I create a new project?</h3>
              <p className="text-muted-foreground mt-1">
                To create a new project, log in to your account, navigate to the dashboard, and click the "New Project" button. From there, you can choose a template or start from scratch.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Can I collaborate with my team?</h3>
              <p className="text-muted-foreground mt-1">
                Yes, our platform supports real-time collaboration. You can invite team members to your projects from the project settings page and work together simultaneously.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">How do I export my designs?</h3>
              <p className="text-muted-foreground mt-1">
                You can export your designs by opening the project and clicking the "Export" button in the top-right corner. We support various formats including PNG, PDF, and HTML.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Is there a free trial available?</h3>
              <p className="text-muted-foreground mt-1">
                Yes, we offer a free plan with limited features. You can also start a 14-day trial of our Pro plan to access all features.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
              <input type="text" id="subject" className="w-full px-3 py-2 border rounded-md" placeholder="Help with..." />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea id="message" rows={4} className="w-full px-3 py-2 border rounded-md" placeholder="Describe your issue..."></textarea>
            </div>
            
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              Submit Request
            </button>
          </form>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-bold mb-4">Video Tutorials</h2>
          <div className="space-y-4">
            <div className="bg-muted rounded-md p-4 flex gap-4 items-center">
              <div className="bg-primary/20 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Getting Started Guide</h3>
                <p className="text-sm text-muted-foreground">Learn the basics of our platform in 5 minutes</p>
              </div>
            </div>
            
            <div className="bg-muted rounded-md p-4 flex gap-4 items-center">
              <div className="bg-primary/20 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Advanced Wireframing</h3>
                <p className="text-sm text-muted-foreground">Master wireframing techniques with our advanced tutorial</p>
              </div>
            </div>
            
            <div className="bg-muted rounded-md p-4 flex gap-4 items-center">
              <div className="bg-primary/20 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Collaboration Features</h3>
                <p className="text-sm text-muted-foreground">Learn how to collaborate effectively with your team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
