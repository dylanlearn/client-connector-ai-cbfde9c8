
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const HelpPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Help & Support</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Find answers to common questions and get support for any issues.
        </p>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create a new project?</AccordionTrigger>
              <AccordionContent>
                To create a new project, log in to your account and click on the "New Project" button 
                on your dashboard. You'll be prompted to select a template or start from scratch, 
                add a project name, and then you'll be taken to the design canvas.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I invite team members to collaborate?</AccordionTrigger>
              <AccordionContent>
                Open your project and click on the "Share" button in the top right corner. 
                Enter the email addresses of team members you want to invite and select their 
                permission level. They'll receive an email invitation to join your project.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I export my designs?</AccordionTrigger>
              <AccordionContent>
                Yes! You can export your designs in various formats including PNG, JPG, PDF, 
                and SVG. Simply select the elements you want to export, click on the "Export" 
                button in the toolbar, and choose your preferred format and settings.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>How does the AI design feature work?</AccordionTrigger>
              <AccordionContent>
                Our AI design assistant can help generate wireframes based on your project requirements. 
                Simply describe what you're looking for, and the AI will create a starting point that you 
                can then customize and refine to match your vision.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>What is the difference between the subscription plans?</AccordionTrigger>
              <AccordionContent>
                Our plans differ in the number of projects you can create, team collaboration features, 
                access to advanced tools like design systems, AI features, and priority support. 
                Visit our pricing page for a detailed comparison of all features included in each plan.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="bg-card border rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-2">For general inquiries and help:</p>
              <a href="mailto:support@example.com" className="text-primary hover:underline">
                support@example.com
              </a>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-muted-foreground mb-2">Available Monday-Friday, 9am-5pm EST</p>
              <button className="text-primary hover:underline">
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
