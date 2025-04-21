import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";

// Assuming this is a simplified version of the file with just the problematic parts
const NewProject = () => {
  // Component state, functions, etc.
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!projectName.trim()) {
        // Line 42 - Changed from toast.error("message", {options}) to toast({ description: "message", variant: "destructive" })
        toast({ 
          title: "Error",
          description: "Project name is required",
          variant: "destructive" 
        });
        setError("Project name is required");
        return;
      }
      
      if (projectName.length < 3) {
        // Line 50 - Changed from toast.error("message", {options}) to toast({ description: "message", variant: "destructive" })
        toast({ 
          title: "Invalid Input", 
          description: "Project name must be at least 3 characters",
          variant: "destructive" 
        });
        setError("Project name must be at least 3 characters");
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success case
      toast({ 
        title: "Success", 
        description: "Project created successfully",
        variant: "success" 
      });
      
      // Reset form
      setProjectName('');
      setProjectDescription('');
    } catch (error) {
      console.error("Error creating project:", error);
      
      // Line 72 - Changed from toast.error("message", {options}) to toast({ description: "message", variant: "destructive" })
      toast({ 
        title: "Project Creation Failed", 
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive" 
      });
      
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium">
            Project Description
          </label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProject;
