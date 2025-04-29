
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, Paintbrush, FileText, AlertTriangle, 
  CheckCircle, XCircle, AlertCircle, Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ComplianceService } from "@/services/compliance/ComplianceService";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";
import { Workspace } from "@/types/workspace";
import { 
  CompliancePolicy, 
  ComplianceCheck, 
  ComplianceStatus,
  AccessibilityStandard,
  BrandGuideline
} from "@/types/compliance";
import { AccessibilityStandardsView } from "./AccessibilityStandardsView";
import { BrandGuidelinesView } from "./BrandGuidelinesView";
import { ComplianceChecksTable } from "./ComplianceChecksTable";
import { CompliancePolicyDialog } from "./CompliancePolicyDialog";
import { ComplianceRunDialog } from "./ComplianceRunDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function ComplianceEnforcement() {
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [policies, setPolicies] = useState<CompliancePolicy[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [accessibilityStandards, setAccessibilityStandards] = useState<AccessibilityStandard[]>([]);
  const [brandGuidelines, setBrandGuidelines] = useState<BrandGuideline[]>([]);
  
  const [createPolicyDialogOpen, setCreatePolicyDialogOpen] = useState(false);
  const [runCheckDialogOpen, setRunCheckDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<CompliancePolicy | null>(null);
  
  useEffect(() => {
    loadWorkspaces();
  }, []);
  
  useEffect(() => {
    if (selectedWorkspace) {
      loadComplianceData(selectedWorkspace.id);
    }
  }, [selectedWorkspace]);
  
  const loadWorkspaces = async () => {
    setLoading(true);
    const result = await WorkspaceService.getUserWorkspaces();
    setWorkspaces(result);
    
    if (result.length > 0) {
      setSelectedWorkspace(result[0]);
    } else {
      setLoading(false);
      toast.error("No workspaces found. Please create a workspace first.");
    }
  };
  
  const loadComplianceData = async (workspaceId: string) => {
    setLoading(true);
    
    try {
      // Load workspace-specific and global policies
      const workspacePolicies = await ComplianceService.getPolicies(workspaceId);
      const globalPolicies = await ComplianceService.getPolicies();
      setPolicies([...workspacePolicies, ...globalPolicies]);
      
      // Load compliance status for the workspace
      const status = await ComplianceService.getComplianceStatus(workspaceId);
      setComplianceStatus(status);
      
      // Load accessibility standards
      const standards = await ComplianceService.getAccessibilityStandards(workspaceId);
      const globalStandards = await ComplianceService.getAccessibilityStandards();
      setAccessibilityStandards([...standards, ...globalStandards]);
      
      // Load brand guidelines
      const guidelines = await ComplianceService.getBrandGuidelines(workspaceId);
      setBrandGuidelines(guidelines);
      
    } catch (error) {
      console.error("Error loading compliance data:", error);
      toast.error("Failed to load compliance data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreatePolicy = async (policy: Partial<CompliancePolicy>) => {
    const newPolicy = await ComplianceService.createPolicy({
      ...policy,
      workspace_id: selectedWorkspace?.id
    });
    
    if (newPolicy) {
      setPolicies([...policies, newPolicy]);
      toast.success("Compliance policy created successfully");
    }
    
    setCreatePolicyDialogOpen(false);
  };
  
  const handleRunCheck = async (policyId: string, resourceType: string, resourceId: string) => {
    const check = await ComplianceService.runComplianceCheck(
      policyId,
      resourceType,
      resourceId
    );
    
    if (check) {
      // Refresh compliance status
      if (selectedWorkspace) {
        const status = await ComplianceService.getComplianceStatus(selectedWorkspace.id);
        setComplianceStatus(status);
      }
    }
    
    setRunCheckDialogOpen(false);
  };
  
  const getComplianceStatusBadge = (status?: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Passed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Failed</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Warning</Badge>;
      case 'exempted':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700">Exempted</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const calculateComplianceRate = () => {
    if (!complianceStatus) return 0;
    
    const { passed, total } = complianceStatus.summary;
    if (total === 0) return 100; // No checks means full compliance
    
    return Math.round((passed / total) * 100);
  };
  
  const handleWorkspaceChange = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setSelectedWorkspace(workspace);
    }
  };
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Compliance Enforcement</h1>
          <p className="text-muted-foreground">
            Enforce accessibility standards, brand guidelines, and regulatory requirements
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setRunCheckDialogOpen(true)}>
            Run Compliance Check
          </Button>
          <Button onClick={() => setCreatePolicyDialogOpen(true)}>
            Create Compliance Policy
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Select value={selectedWorkspace?.id} onValueChange={handleWorkspaceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map(workspace => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {!loading && complianceStatus && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Compliance Overview</CardTitle>
                  <CardDescription>
                    Current compliance status for all resources
                  </CardDescription>
                </div>
                <div className="text-2xl font-bold">
                  {calculateComplianceRate()}%
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={calculateComplianceRate()} className="h-2 mb-4" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-background border rounded-md">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 mb-2">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">Passed</span>
                  <span className="font-bold">{complianceStatus.summary.passed}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-background border rounded-md">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 mb-2">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">Failed</span>
                  <span className="font-bold">{complianceStatus.summary.failed}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-background border rounded-md">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 mb-2">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">Warning</span>
                  <span className="font-bold">{complianceStatus.summary.warning}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-background border rounded-md">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 mb-2">
                    <Ban className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">Exempted</span>
                  <span className="font-bold">{complianceStatus.summary.exempted}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {loading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="h-64 space-y-2">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="checks">
          <div className="border-b mb-4">
            <TabsList className="mb-[-1px]">
              <TabsTrigger value="checks">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Compliance Checks
              </TabsTrigger>
              <TabsTrigger value="accessibility">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Accessibility
              </TabsTrigger>
              <TabsTrigger value="brand">
                <Paintbrush className="mr-2 h-4 w-4" />
                Brand Guidelines
              </TabsTrigger>
              <TabsTrigger value="regulatory">
                <FileText className="mr-2 h-4 w-4" />
                Regulatory
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="checks">
            <Card>
              <CardHeader>
                <CardTitle>Recent Compliance Checks</CardTitle>
                <CardDescription>
                  Results from recent compliance validation checks
                </CardDescription>
              </CardHeader>
              <CardContent>
                {complianceStatus && complianceStatus.details.length > 0 ? (
                  <ComplianceChecksTable checks={complianceStatus.details} />
                ) : (
                  <div className="text-center py-8">
                    <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">No compliance checks found</h3>
                    <p className="text-muted-foreground mb-4">
                      Run a compliance check to validate your resources against defined policies.
                    </p>
                    <Button onClick={() => setRunCheckDialogOpen(true)}>
                      Run Compliance Check
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accessibility">
            <AccessibilityStandardsView
              standards={accessibilityStandards}
              workspaceId={selectedWorkspace?.id || ''}
            />
          </TabsContent>
          
          <TabsContent value="brand">
            <BrandGuidelinesView
              guidelines={brandGuidelines}
              workspaceId={selectedWorkspace?.id || ''}
            />
          </TabsContent>
          
          <TabsContent value="regulatory">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Requirements</CardTitle>
                <CardDescription>
                  Manage compliance with regulatory and legal requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">Regulatory Compliance</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Configure and enforce regulatory requirements such as GDPR, CCPA, ADA, and other legal standards.
                </p>
                <Button>Configure Requirements</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {selectedWorkspace && (
        <>
          <CompliancePolicyDialog
            open={createPolicyDialogOpen}
            onOpenChange={setCreatePolicyDialogOpen}
            onSubmit={handleCreatePolicy}
          />
          
          <ComplianceRunDialog
            open={runCheckDialogOpen}
            onOpenChange={setRunCheckDialogOpen}
            onSubmit={handleRunCheck}
            policies={policies}
          />
        </>
      )}
    </div>
  );
}
