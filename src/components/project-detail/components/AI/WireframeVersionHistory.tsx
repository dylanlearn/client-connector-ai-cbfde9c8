import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CalendarIcon, Copy, GitBranch, GitPullRequest, Save, Sparkles, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { WireframeVersion, BranchInfo } from '@/services/ai/wireframe/wireframe-types';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast";

interface WireframeVersionHistoryProps {
  wireframeId: string;
  versions: WireframeVersion[];
  branches: BranchInfo[];
  currentVersion?: WireframeVersion | null;
  onVersionSelect?: (version: WireframeVersion) => void;
  onCreateBranch?: (versionId: string, branchName: string) => void;
  onMergeBranch?: (versionId: string) => void;
  onRevertToVersion?: (versionId: string) => void;
  onDeleteVersion?: (versionId: string) => void;
  isLoading?: boolean;
}

const WireframeVersionHistory: React.FC<WireframeVersionHistoryProps> = ({
  wireframeId,
  versions,
  branches,
  currentVersion,
  onVersionSelect,
  onCreateBranch,
  onMergeBranch,
  onRevertToVersion,
  onDeleteVersion,
  isLoading
}) => {
  const [selectedVersion, setSelectedVersion] = useState<WireframeVersion | null>(null);
  const [newBranchName, setNewBranchName] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (currentVersion) {
      setSelectedVersion(currentVersion);
    }
  }, [currentVersion]);

  const handleVersionClick = (version: WireframeVersion) => {
    setSelectedVersion(version);
    onVersionSelect?.(version);
  };

  const handleCreateBranch = (versionId: string) => {
    if (!newBranchName.trim()) {
      toast({
        title: "Please enter a branch name",
        description: "You must provide a name for the new branch.",
        variant: "destructive"
      });
      return;
    }
    onCreateBranch?.(versionId, newBranchName);
    setNewBranchName('');
  };

  const handleMergeBranch = (versionId: string) => {
    onMergeBranch?.(versionId);
  };

  const handleRevertToVersion = (versionId: string) => {
    onRevertToVersion?.(versionId);
  };

  const handleDeleteVersion = (versionId: string) => {
    onDeleteVersion?.(versionId);
  };

  const renderBranchContent = (branch: BranchInfo) => {
    const latestVersionId = branch.latestVersion?.id || branch.latest_version_id;
    
    return (
      <div key={branch.name} className="mb-4">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          {branch.name} Branch
        </h4>
        <Table className="mt-2">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Version #</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branch.versions.map((version) => (
              <TableRow
                key={version.id}
                onClick={() => handleVersionClick(version)}
                className={`cursor-pointer hover:bg-accent ${selectedVersion?.id === version.id ? 'bg-accent' : ''}`}
              >
                <TableCell className="font-medium">{version.version_number}</TableCell>
                <TableCell>{version.change_description}</TableCell>
                <TableCell>{format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleRevertToVersion(version.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Revert to Version
                      </DropdownMenuItem>
                      {branch.name !== 'main' && version.id === latestVersionId && (
                        <DropdownMenuItem onClick={() => handleMergeBranch(version.id)}>
                          <GitPullRequest className="h-4 w-4 mr-2" />
                          Merge to Main
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteVersion(version.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Version
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>
          Browse and manage different versions of your wireframe.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Version #</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton loading state
                [...Array(5)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  </TableRow>
                ))
              ) : versions.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No versions available.
                  </TableCell>
                </TableRow>
              ) : (
                // Version data
                versions.map((version) => (
                  <TableRow
                    key={version.id}
                    onClick={() => handleVersionClick(version)}
                    className={`cursor-pointer hover:bg-accent ${selectedVersion?.id === version.id ? 'bg-accent' : ''}`}
                  >
                    <TableCell className="font-medium">{version.version_number}</TableCell>
                    <TableCell>{version.change_description}</TableCell>
                    <TableCell>{format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Sparkles className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleRevertToVersion(version.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Revert to Version
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteVersion(version.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Version
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WireframeVersionHistory;
