
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, FileText, Plus, Settings, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { CompliancePolicy, ComplianceCheck } from '@/types/compliance';
import CompliancePolicyDialog from './CompliancePolicyDialog';
import { ComplianceService } from '@/services/compliance-service';

const ComplianceEnforcement: React.FC = () => {
  const [policies, setPolicies] = useState<CompliancePolicy[]>([]);
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('policies');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [policiesData, checksData] = await Promise.all([
        ComplianceService.getPolicies(),
        ComplianceService.getChecks()
      ]);
      setPolicies(policiesData);
      setChecks(checksData);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async (policy: Partial<CompliancePolicy>) => {
    try {
      await ComplianceService.createPolicy(policy);
      setAddDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'exempted': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <ShieldAlert className="h-4 w-4" />;
      case 'exempted': return <Shield className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const renderPoliciesList = () => {
    if (loading) {
      return <div className="text-center py-8">Loading policies...</div>;
    }

    if (policies.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No compliance policies found.</p>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Policy
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {policies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{policy.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {policy.description || "No description provided"}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityBadgeClass(policy.severity)}`}>
                    {policy.severity.charAt(0).toUpperCase() + policy.severity.slice(1)}
                  </span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${policy.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {policy.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center">
                <span className="capitalize">
                  {policy.policy_type.replace(/-/g, ' ')}
                </span>
                <span className="mx-2">•</span>
                <span>{policy.rules.length} Rules</span>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="mr-2">
                  <Settings className="mr-1 h-4 w-4" /> Configure
                </Button>
                <Button variant="outline" size="sm">
                  <ShieldCheck className="mr-1 h-4 w-4" /> Run Check
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderChecksList = () => {
    if (loading) {
      return <div className="text-center py-8">Loading compliance checks...</div>;
    }

    if (checks.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No compliance checks found.</p>
          <Button onClick={() => setActiveTab('policies')}>
            <Plus className="mr-2 h-4 w-4" /> Add Policy First
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {checks.map((check) => (
          <Card key={check.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {check.policy_name || `Check ${check.id.substring(0, 8)}`}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {check.resource_type}: {check.resource_id.substring(0, 8)}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityBadgeClass(check.severity || 'medium')}`}>
                    {(check.severity || 'medium').charAt(0).toUpperCase() + (check.severity || 'medium').slice(1)}
                  </span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full flex items-center ${getStatusBadgeClass(check.status)}`}>
                    {getStatusIcon(check.status)}
                    <span className="ml-1 capitalize">{check.status}</span>
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center">
                <span className="capitalize">
                  {check.policy_type?.replace(/-/g, ' ') || 'General Check'}
                </span>
                <span className="mx-2">•</span>
                <span>
                  {new Date(check.checked_at).toLocaleDateString()}
                </span>
                {check.issues.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{check.issues.length} Issues</span>
                  </>
                )}
              </div>
              
              {check.status === 'failed' && check.issues.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium">Issues:</p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5">
                    {check.issues.slice(0, 2).map((issue, index) => (
                      <li key={index}>{issue.message}</li>
                    ))}
                    {check.issues.length > 2 && (
                      <li>...and {check.issues.length - 2} more issues</li>
                    )}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="mr-2">
                  <FileText className="mr-1 h-4 w-4" /> Details
                </Button>
                <Button variant="outline" size="sm">
                  <ShieldCheck className="mr-1 h-4 w-4" /> Re-check
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Compliance Enforcement</h1>
          <p className="text-muted-foreground">
            Manage policies and ensure enterprise-wide compliance
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Policy
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="policies">
            <Shield className="mr-2 h-4 w-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="checks">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Compliance Checks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="policies" className="space-y-4">
          {renderPoliciesList()}
        </TabsContent>
        
        <TabsContent value="checks" className="space-y-4">
          {renderChecksList()}
        </TabsContent>
      </Tabs>

      <CompliancePolicyDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleCreatePolicy}
      />
    </div>
  );
};

export default ComplianceEnforcement;
