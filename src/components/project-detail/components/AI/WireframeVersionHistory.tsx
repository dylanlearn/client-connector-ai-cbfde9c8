import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  History, 
  GitBranch, 
  GitMerge, 
  Clock, 
  User, 
  FileText, 
  GitCompare, 
  Check, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';

import { wireframeVersionControl } from '@/services/ai/wireframe/version-control';
import { 
  WireframeVersion,
  WireframeRevisionHistory
} from '@/services/ai/wireframe/wireframe-types';
import { formatDistanceToNow } from 'date-fns';

interface WireframeVersionHistoryProps {
  wireframeId: string;
  userId: string;
  onVersionSelect?: (version: WireframeVersion) => void;
}

const WireframeVersionHistory: React.FC<WireframeVersionHistoryProps> = ({ 
  wireframeId,
  userId,
  onVersionSelect 
}) => {
  const [history, setHistory] = useState<WireframeRevisionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('versions');
  
  const [isBranchDialogOpen, setBranchDialogOpen] = useState(false);
  const [isMergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [isCompareDialogOpen, setCompareDialogOpen] = useState(false);
  
  const [newBranchName, setNewBranchName] = useState('');
  const [branchDescription, setBranchDescription] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [compareVersions, setCompareVersions] = useState<{v1: string, v2: string} | null>(null);
  const [compareResult, setCompareResult] = useState<{
    changes: { type: 'added' | 'removed' | 'modified', path: string, values: [any, any] }[],
    summary: string
  } | null>(null);
  
  useEffect(() => {
    loadVersionHistory();
  }, [wireframeId]);
  
  const loadVersionHistory = async () => {
    setLoading(true);
    try {
      const history = await wireframeVersionControl.getVersionHistory(wireframeId);
      setHistory(history);
      setError(null);
    } catch (err) {
      setError("Failed to load version history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateBranch = async () => {
    if (!selectedVersion || !newBranchName) return;
    
    try {
      await wireframeVersionControl.createBranch(
        selectedVersion,
        newBranchName,
        userId
      );
      
      setNewBranchName('');
      setBranchDescription('');
      setBranchDialogOpen(false);
      loadVersionHistory();
    } catch (err) {
      setError("Failed to create branch");
      console.error(err);
    }
  };
  
  const handleMergeBranch = async () => {
    if (!selectedBranch) return;
    
    try {
      const branches = await wireframeVersionControl.getBranches(wireframeId);
      const branch = branches.find(b => b.name === selectedBranch);
      
      if (!branch) {
        throw new Error("Selected branch not found");
      }
      
      await wireframeVersionControl.mergeBranch(
        branch.latest_version_id,
        userId
      );
      
      setSelectedBranch(null);
      setMergeDialogOpen(false);
      loadVersionHistory();
    } catch (err) {
      setError("Failed to merge branch");
      console.error(err);
    }
  };
  
  const handleCompareVersions = async () => {
    if (!compareVersions) return;
    
    try {
      const result = await wireframeVersionControl.compareVersions(
        compareVersions.v1,
        compareVersions.v2
      );
      
      setCompareResult(result);
    } catch (err) {
      setError("Failed to compare versions");
      console.error(err);
    }
  };
  
  const handleRevertToVersion = async (versionId: string) => {
    try {
      await wireframeVersionControl.revertToVersion(
        versionId,
        userId
      );
      
      loadVersionHistory();
    } catch (err) {
      setError("Failed to revert to version");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error Loading Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={loadVersionHistory} className="mt-4" variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Version History
          </CardTitle>
          <CardDescription>
            No versions found for this wireframe
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <div className="mb-4">
            <History className="mx-auto h-10 w-10 opacity-30" />
          </div>
          <p>Version history will appear here once changes are made</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Version History
          </CardTitle>
          <CardDescription>
            Track and manage wireframe versions
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="versions">
                <Clock className="mr-2 h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="branches">
                <GitBranch className="mr-2 h-4 w-4" />
                Branches
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="versions">
            <ScrollArea className="h-[400px]">
              <div className="px-6 py-2 space-y-4">
                {history.versions
                  .filter(version => version.branch_name === 'main')
                  .map(version => (
                  <div
                    key={version.id}
                    className={`relative pl-6 border-l-2 ${
                      version.is_current ? 'border-primary' : 'border-border'
                    } pb-4`}
                  >
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${
                      version.is_current ? 'bg-primary' : 'bg-border'
                    }`}></div>
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">
                          {version.is_current && (
                            <Badge variant="default" className="mr-2">Current</Badge>
                          )}
                          {version.change_description || `Version ${version.version_number}`}
                        </div>
                        
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                          
                          <span className="inline-block mx-1">•</span>
                          
                          <User className="h-3 w-3" />
                          <span>{version.created_by ? 'User' : 'System'}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!version.is_current && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleRevertToVersion(version.id)}
                          >
                            Revert
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedVersion(version.id);
                            setBranchDialogOpen(true);
                          }}
                        >
                          Branch
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onVersionSelect?.(version)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                    
                    {version.parent_version_id && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="inline-flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          Based on previous version
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <CardFooter className="border-t bg-muted/50 flex justify-between py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompareDialogOpen(true)}
              >
                <GitCompare className="h-4 w-4 mr-2" />
                Compare Versions
              </Button>
              
              <span className="text-xs text-muted-foreground">
                {history.versions.filter(v => v.branch_name === 'main').length} versions
              </span>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="branches">
            <CardContent>
              {history.branches.length <= 1 ? (
                <div className="text-center py-6">
                  <GitBranch className="mx-auto h-10 w-10 opacity-30 mb-2" />
                  <p className="text-muted-foreground">
                    No branches created yet. Create a branch to explore design alternatives.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.branches
                    .filter(branch => branch !== 'main')
                    .map(branch => (
                    <Card key={branch}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center">
                            <GitBranch className="h-4 w-4 mr-2" />
                            {branch}
                          </CardTitle>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedBranch(branch);
                              setMergeDialogOpen(true);
                            }}
                          >
                            <GitMerge className="h-4 w-4 mr-1" />
                            Merge to Main
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="text-xs text-muted-foreground">
                          {history.versions.filter(v => v.branch_name === branch).length} versions in this branch
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="border-t bg-muted/50 flex justify-center py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (history.current) {
                    setSelectedVersion(history.current.id);
                  }
                  setBranchDialogOpen(true);
                }}
              >
                <GitBranch className="h-4 w-4 mr-2" />
                Create New Branch
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
      
      <Dialog open={isBranchDialogOpen} onOpenChange={setBranchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Branch</DialogTitle>
            <DialogDescription>
              Create a branch to explore design alternatives without affecting the main version
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Branch Name</label>
              <Input 
                placeholder="e.g., alternative-layout"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                placeholder="What's different about this branch..."
                value={branchDescription}
                onChange={(e) => setBranchDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBranchDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBranch} disabled={!newBranchName}>
              <GitBranch className="h-4 w-4 mr-2" />
              Create Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isMergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Branch</DialogTitle>
            <DialogDescription>
              Merge this branch into the main version
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="text-center p-2 border rounded-md">
                <GitBranch className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">{selectedBranch}</p>
              </div>
              
              <ChevronRight className="h-6 w-6" />
              
              <div className="text-center p-2 border rounded-md bg-muted">
                <GitBranch className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">main</p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="mb-2">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                This will create a new version in the main branch based on the latest version from the selected branch.
              </p>
              <p>
                <Check className="inline h-4 w-4 mr-1 text-green-500" />
                The original branch will be preserved.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMergeBranch}>
              <GitMerge className="h-4 w-4 mr-2" />
              Merge Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCompareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
            <DialogDescription>
              See what changed between two wireframe versions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {!compareResult ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Version 1</label>
                    <select 
                      className="w-full h-10 px-3 border rounded-md"
                      onChange={(e) => setCompareVersions(prev => ({ 
                        ...prev,
                        v1: e.target.value
                      } as any))}
                      value={compareVersions?.v1 || ''}
                    >
                      <option value="">Select version...</option>
                      {history.versions.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.change_description || `V${v.version_number}`} ({new Date(v.created_at).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Version 2</label>
                    <select 
                      className="w-full h-10 px-3 border rounded-md"
                      onChange={(e) => setCompareVersions(prev => ({ 
                        ...prev,
                        v2: e.target.value
                      } as any))}
                      value={compareVersions?.v2 || ''}
                    >
                      <option value="">Select version...</option>
                      {history.versions.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.change_description || `V${v.version_number}`} ({new Date(v.created_at).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setCompareDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCompareVersions}
                    disabled={!compareVersions?.v1 || !compareVersions?.v2}
                  >
                    <GitCompare className="h-4 w-4 mr-2" />
                    Compare
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <div className="p-4 border rounded-md bg-muted">
                  <h4 className="font-medium mb-2">Change Summary</h4>
                  <p>{compareResult.summary}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Detailed Changes</h4>
                  
                  <ScrollArea className="h-[300px] border rounded-md">
                    <div className="p-4 space-y-2">
                      {compareResult.changes.length > 0 ? (
                        compareResult.changes.map((change, i) => (
                          <div key={i} className="text-sm border-b pb-2">
                            <div className="flex items-center mb-1">
                              <Badge variant={
                                change.type === 'added' ? 'default' :
                                change.type === 'removed' ? 'destructive' : 'outline'
                              } className="mr-2">
                                {change.type}
                              </Badge>
                              <code className="text-xs bg-muted p-1 rounded">{change.path}</code>
                            </div>
                            {change.type === 'modified' && (
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <div className="text-xs bg-muted/50 p-2 rounded">
                                  <div className="text-muted-foreground mb-1">Before:</div>
                                  <div className="whitespace-pre-wrap break-all">
                                    {typeof change.values[0] === 'object' 
                                      ? JSON.stringify(change.values[0], null, 2)
                                      : String(change.values[0])
                                    }
                                  </div>
                                </div>
                                <div className="text-xs bg-muted/50 p-2 rounded">
                                  <div className="text-muted-foreground mb-1">After:</div>
                                  <div className="whitespace-pre-wrap break-all">
                                    {typeof change.values[1] === 'object' 
                                      ? JSON.stringify(change.values[1], null, 2)
                                      : String(change.values[1])
                                    }
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No differences found between these versions
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCompareResult(null);
                      setCompareVersions(null);
                    }}
                  >
                    Back
                  </Button>
                  <Button onClick={() => setCompareDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WireframeVersionHistory;
