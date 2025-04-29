
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, Trash } from "lucide-react";
import { WorkspaceCreateDialog } from "./WorkspaceCreateDialog";
import { TeamCreateDialog } from "./TeamCreateDialog";
import { WorkspaceService } from "@/services/workspace-service";
import { Workspace } from "@/types/workspace";
import { toast } from "sonner";

export default function WorkspaceManagement() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState<boolean>(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await WorkspaceService.getUserWorkspaces();
        setWorkspaces(data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        toast.error("Failed to fetch workspaces");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (name: string, description?: string) => {
    try {
      const newWorkspace = await WorkspaceService.createWorkspace({ name, description: description || '' });
      setWorkspaces([...workspaces, newWorkspace]);
      toast.success("Workspace created successfully");
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error("Failed to create workspace");
    }
  };

  const handleCreateTeam = async (name: string, description?: string) => {
    if (!selectedWorkspaceId) return;
    
    try {
      // In a real app, this would call your API
      // Since the WorkspaceService doesn't have team functions yet, we'll just show a toast
      toast.success(`Team "${name}" created in workspace`);
      setTeamDialogOpen(false);
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (!window.confirm("Are you sure you want to delete this workspace?")) return;
    
    try {
      await WorkspaceService.deleteWorkspace(workspaceId);
      setWorkspaces(workspaces.filter(w => w.id !== workspaceId));
      toast.success("Workspace deleted successfully");
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("Failed to delete workspace");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Workspace Management</h1>
        <p className="text-muted-foreground">Organize your projects and teams with workspaces</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="font-medium">{workspaces.length} Workspace{workspaces.length !== 1 ? 's' : ''}</span>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </div>
      
      {workspaces.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No workspaces yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first workspace to organize your projects and teams.</p>
            <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    {workspace.logo_url ? (
                      <Avatar className="h-8 w-8">
                        <img src={workspace.logo_url} alt={workspace.name} />
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{workspace.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <CardTitle>{workspace.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteWorkspace(workspace.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="pt-1">{workspace.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Members</h4>
                      <span className="text-xs text-muted-foreground">0 members</span>
                    </div>
                    <Separator />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Teams</h4>
                      <span className="text-xs text-muted-foreground">0 teams</span>
                    </div>
                    <Separator />
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-center"
                        onClick={() => {
                          setSelectedWorkspaceId(workspace.id);
                          setTeamDialogOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Team
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <WorkspaceCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateWorkspace}
      />
      
      <TeamCreateDialog
        open={teamDialogOpen}
        onOpenChange={setTeamDialogOpen}
        onSubmit={handleCreateTeam}
      />
    </div>
  );
}
