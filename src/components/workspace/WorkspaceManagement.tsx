import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, MoreHorizontal, Eye, Edit, Trash, Users } from "lucide-react";
import { Workspace } from "@/types/workspace";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";
import { toast } from "sonner";

const WorkspaceManagement = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const fetchedWorkspaces = await WorkspaceService.getWorkspaces();
      setWorkspaces(fetchedWorkspaces);
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
      toast.error("Failed to fetch workspaces");
    }
  };

  const handleCreateWorkspace = async () => {
    setIsCreating(true);
    try {
      const newWorkspace = await WorkspaceService.createWorkspace({
        name: newWorkspaceName,
        description: newWorkspaceDescription,
      });
      if (newWorkspace) {
        setWorkspaces([...workspaces, newWorkspace]);
        setNewWorkspaceName('');
        setNewWorkspaceDescription('');
        toast.success("Workspace created successfully!");
      } else {
        toast.error("Failed to create workspace.");
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error("Failed to create workspace");
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewWorkspace = (workspaceId: string) => {
    console.log(`View workspace with ID: ${workspaceId}`);
    // Implement navigation or modal to view workspace details
  };

  const handleEditWorkspace = (workspaceId: string) => {
    console.log(`Edit workspace with ID: ${workspaceId}`);
    // Implement navigation or modal to edit workspace details
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await WorkspaceService.deleteWorkspace(workspaceId);
      setWorkspaces(workspaces.filter(workspace => workspace.id !== workspaceId));
      toast.success("Workspace deleted successfully!");
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("Failed to delete workspace");
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workspace Management</h1>
        <Button onClick={handleCreateWorkspace} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Workspace'}
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Workspace</CardTitle>
          <CardDescription>
            Define the name and description for your new workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              placeholder="Enter workspace name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workspace-description">Description</Label>
            <Input
              id="workspace-description"
              placeholder="Enter workspace description"
              value={newWorkspaceDescription}
              onChange={(e) => setNewWorkspaceDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {workspace.logo_url ? (
                      <img 
                        src={workspace.logo_url} 
                        alt={workspace.name} 
                        className="h-8 w-8 rounded"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-primary/20 rounded flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {workspace.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <CardTitle>{workspace.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleViewWorkspace(workspace.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditWorkspace(workspace.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteWorkspace(workspace.id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {workspace.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{workspace.members?.length || 0} members</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewWorkspace(workspace.id)}
                >
                  Manage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <Building2 className="h-16 w-16 text-muted-foreground/60 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Workspaces Found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create a workspace to start organizing your projects, teams, and resources.
            </p>
            <Button onClick={handleCreateWorkspace}>Create Your First Workspace</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WorkspaceManagement;
