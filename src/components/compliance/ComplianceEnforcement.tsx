'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ListChecks,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import { CompliancePolicy, ComplianceCheck } from "@/types/compliance";
import { ComplianceService } from "@/services/compliance/ComplianceService";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format } from 'date-fns';
import { CompliancePolicyDialog } from './CompliancePolicyDialog';

const ComplianceEnforcement = () => {
  const [policies, setPolicies] = useState<CompliancePolicy[]>([]);
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<CompliancePolicy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const workspaceId = 'your-workspace-id'; // Replace with actual workspace ID

  useEffect(() => {
    fetchPolicies();
    fetchComplianceChecks();
  }, [dateRange]);

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const fetchedPolicies = await ComplianceService.getPolicies(workspaceId);
      setPolicies(fetchedPolicies);
    } catch (error) {
      console.error("Error fetching compliance policies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComplianceChecks = async () => {
    setIsLoading(true);
    try {
      // Fetch compliance checks based on the selected date range
      const complianceStatus = await ComplianceService.getComplianceStatus(workspaceId);
      if (complianceStatus && complianceStatus.details) {
        setChecks(complianceStatus.details);
      } else {
        setChecks([]);
      }
    } catch (error) {
      console.error("Error fetching compliance checks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCheck = async (policyId: string) => {
    setIsSubmitting(true);
    try {
      // Replace with actual resource type and ID
      await ComplianceService.runComplianceCheck(policyId, 'design', '123');
      fetchComplianceChecks(); // Refresh checks after running
    } catch (error) {
      console.error("Error running compliance check:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePolicySubmit = async (policy: Partial<CompliancePolicy>) => {
    setIsSubmitting(true);
    try {
      if (selectedPolicy) {
        // Update existing policy
        await ComplianceService.updatePolicy(selectedPolicy.id, policy);
      } else {
        // Create new policy
        await ComplianceService.createPolicy({ ...policy, workspace_id: workspaceId });
      }
      fetchPolicies(); // Refresh policies after submitting
    } catch (error) {
      console.error("Error submitting policy:", error);
    } finally {
      setIsSubmitting(false);
      setPolicyDialogOpen(false);
      setSelectedPolicy(null);
    }
  };

  const handleEditPolicy = (policy: CompliancePolicy) => {
    setSelectedPolicy(policy);
    setPolicyDialogOpen(true);
  };

  const handleDeletePolicy = async (policyId: string) => {
    // Implement delete logic here (e.g., calling a delete API)
    console.log(`Deleting policy with ID: ${policyId}`);
    // After successful deletion, refresh the policies list
    fetchPolicies();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="text-green-500 h-5 w-5" />;
      case 'failed':
        return <XCircle className="text-red-500 h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500 h-5 w-5" />;
      case 'exempted':
        return <ShieldQuestion className="text-muted-foreground h-5 w-5" />;
      default:
        return <HelpCircle className="text-muted-foreground h-5 w-5" />;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Compliance Enforcement</h1>
          <p className="text-muted-foreground">
            Ensure your designs meet accessibility, brand, and regulatory standards
          </p>
        </div>
        <Button onClick={() => setPolicyDialogOpen(true)} disabled={isSubmitting}>
          Create Policy
        </Button>
      </div>

      <div className="mb-4">
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          onUpdate={(range) => {
            if (range.from && range.to) {
              setDateRange({ from: range.from, to: range.to });
            }
          }}
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Active Policies</CardTitle>
          <CardDescription>
            Manage and enforce compliance policies across your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading policies...</p>
          ) : policies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policies.map((policy) => (
                <div key={policy.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">{policy.name}</h3>
                    <div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditPolicy(policy)}
                        className="mr-2"
                      >
                        <ListChecks className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeletePolicy(policy.id)}
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{policy.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      {policy.is_active ? (
                        <ShieldCheck className="text-green-500 mr-2 h-4 w-4" />
                      ) : (
                        <ShieldAlert className="text-red-500 mr-2 h-4 w-4" />
                      )}
                      <span>{policy.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRunCheck(policy.id)}
                      disabled={isSubmitting}
                    >
                      Run Check
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No policies created yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Checks</CardTitle>
          <CardDescription>
            Review the latest compliance checks and their statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading compliance checks...</p>
          ) : checks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Checked
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {checks.map((check) => (
                    <tr key={check.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{check.policy_name}</div>
                        <div className="text-sm text-gray-500">{check.policy_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{check.resource_type}</div>
                        <div className="text-sm text-gray-500">{check.resource_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(check.status)}
                          <span className="ml-2 text-sm font-medium">{check.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(check.checked_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(check.checked_at), 'h:mm a')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No compliance checks found.</p>
          )}
        </CardContent>
      </Card>

      <CompliancePolicyDialog
        open={policyDialogOpen}
        onOpenChange={setPolicyDialogOpen}
        onSubmit={handlePolicySubmit}
        policy={selectedPolicy}
      />
    </div>
  );
};

export default ComplianceEnforcement;
