import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CirclePlus, Building2, Users, Briefcase, Settings2, 
  ChevronRight, ArrowRight, MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";
import { Workspace, WorkspaceMember, WorkspaceTeam } from "@/types/workspace";
import { WorkspaceCreateDialog } from "./WorkspaceCreateDialog";
import { MemberInviteDialog } from "./MemberInviteDialog";
import { TeamCreateDialog } from "./TeamCreateDialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceManagement() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [teams, setTeams] = useState<WorkspaceTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      loadWorkspaceDetails(selectedWorkspace.id);
    }
  }, [selectedWorkspace]);

  const loadWorkspaces = async () => {
    setLoading(true);
    const result = await WorkspaceService.getUserWorkspaces();
    setWorkspaces(result);
    
    if (result.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(result[0]);
    } else {
      setLoading(false);
    }
  };

  const loadWorkspaceDetails = async (workspaceId: string) => {
    setLoading(true);
    
    // Load members
    const membersResult = await WorkspaceService.getWorkspaceMembers(workspaceId);
    setMembers(membersResult);
    
    // Load teams
    const teamsResult = await WorkspaceService.getWorkspaceTeams(workspaceId);
    setTeams(teamsResult);
    
    setLoading(false);
  };

  const handleCreateWorkspace = async (name: string, description?: string) => {
    const newWorkspace = await WorkspaceService.createWorkspace(name, description);
    if (newWorkspace) {
      setWorkspaces([...workspaces, newWorkspace]);
      setSelectedWorkspace(newWorkspace);
      toast.success(`Workspace '${name}' created successfully`);
    }
    setCreateDialogOpen(false);
  };

  const handleInviteMember = async (email: string, role: string) => {
    if (!selectedWorkspace) return;
    
    const success = await WorkspaceService.addWorkspaceMember(
      selectedWorkspace.id, 
      email, 
      role
    );
    
    if (success) {
      loadWorkspaceDetails(selectedWorkspace.id);
    }
    
    setInviteDialogOpen(false);
  };

  const handleCreateTeam = async (name: string, description?: string) => {
    if (!selectedWorkspace) return;
    
    const newTeam = await WorkspaceService.createTeam(
      selectedWorkspace.id,
      name,
      description
    );
    
    if (newTeam) {
      setTeams([...teams, newTeam]);
      toast.success(`Team '${name}' created successfully`);
    }
    
    setTeamDialogOpen(false);
  };

  const getMemberRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge variant="default">Owner</Badge>;
      case 'admin':
        return <Badge variant="secondary">Admin</Badge>;
      case 'member':
        return <Badge variant="outline">Member</Badge>;
      case 'guest':
        return <Badge variant="ghost">Guest</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workspace Management</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <CirclePlus className="mr-2 h-4 w-4" /> New Workspace
        </Button>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Workspace Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>My Workspaces</CardTitle>
              <CardDescription>Manage your workspaces</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {workspaces.map(workspace => (
                  <button 
                    key={workspace.id} 
                    className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-accent/50 ${selectedWorkspace?.id === workspace.id ? 'bg-accent' : ''}`}
                    onClick={() => setSelectedWorkspace(workspace)}
                  >
                    <div className="rounded-md w-8 h-8 flex items-center justify-center bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{workspace.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {workspace.description || 'No description'}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
                
                {workspaces.length === 0 && !loading && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-muted-foreground">No workspaces found</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setCreateDialogOpen(true)}
                    >
                      Create Workspace
                    </Button>
                  </div>
                )}
                
                {loading && (
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="col-span-9">
          {selectedWorkspace ? (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{selectedWorkspace.name}</CardTitle>
                  <CardDescription>
                    {selectedWorkspace.description || 'No description'}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Workspace Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Workspace Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete Workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              
              <Tabs defaultValue="members">
                <CardContent className="pb-0">
                  <TabsList>
                    <TabsTrigger value="members">
                      <Users className="h-4 w-4 mr-2" /> Members
                    </TabsTrigger>
                    <TabsTrigger value="teams">
                      <Users className="h-4 w-4 mr-2" /> Teams
                    </TabsTrigger>
                    <TabsTrigger value="projects">
                      <Briefcase className="h-4 w-4 mr-2" /> Projects
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      <Settings2 className="h-4 w-4 mr-2" /> Settings
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
                
                <TabsContent value="members">
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Members</h3>
                      <Button onClick={() => setInviteDialogOpen(true)}>
                        <CirclePlus className="mr-2 h-4 w-4" /> Invite Member
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {loading ? (
                        Array(3).fill(0).map((_, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))
                      ) : members.length > 0 ? (
                        members.map(member => (
                          <div key={member.id} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{getInitials(member.email || '')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.email}</div>
                                <div className="text-sm text-muted-foreground">
                                  Joined {new Date(member.joined_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {getMemberRoleBadge(member.role)}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No members found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="teams">
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Teams</h3>
                      <Button onClick={() => setTeamDialogOpen(true)}>
                        <CirclePlus className="mr-2 h-4 w-4" /> Create Team
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {loading ? (
                        Array(2).fill(0).map((_, i) => (
                          <Card key={i}>
                            <CardHeader className="pb-2">
                              <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent>
                              <Skeleton className="h-4 w-full" />
                            </CardContent>
                            <CardFooter>
                              <Skeleton className="h-9 w-full" />
                            </CardFooter>
                          </Card>
                        ))
                      ) : teams.length > 0 ? (
                        teams.map(team => (
                          <Card key={team.id}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{team.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <p className="text-sm text-muted-foreground">
                                {team.description || 'No description'}
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" className="w-full">
                                Manage Team <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-6">
                          <p className="text-muted-foreground">No teams found</p>
                          <Button 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => setTeamDialogOpen(true)}
                          >
                            Create Team
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="projects">
                  <CardContent>
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">Project Management</h3>
                      <p className="text-muted-foreground mb-4">
                        Connect projects to this workspace to manage resources and team assignments.
                      </p>
                      <Button>
                        <CirclePlus className="mr-2 h-4 w-4" /> Add Project
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="settings">
                  <CardContent>
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">Workspace Settings</h3>
                      <p className="text-muted-foreground mb-4">
                        Configure workspace settings, permissions, and integrations.
                      </p>
                      <Button>
                        <Settings2 className="mr-2 h-4 w-4" /> Manage Settings
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-lg font-medium mb-2">Select a Workspace</h2>
                <p className="text-muted-foreground mb-4">
                  Choose a workspace from the sidebar or create a new one.
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <CirclePlus className="mr-2 h-4 w-4" /> Create Workspace
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <WorkspaceCreateDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSubmit={handleCreateWorkspace}
      />
      
      <MemberInviteDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen} 
        onSubmit={handleInviteMember}
      />
      
      <TeamCreateDialog
        open={teamDialogOpen}
        onOpenChange={setTeamDialogOpen}
        onSubmit={handleCreateTeam}
      />
    </div>
  );
}
