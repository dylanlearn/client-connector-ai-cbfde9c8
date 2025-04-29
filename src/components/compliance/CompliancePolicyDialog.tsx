
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CompliancePolicy, ComplianceRule } from '@/types/compliance';
import { ComplianceService } from '@/services/compliance-service';
import { v4 as uuidv4 } from 'uuid';

interface CompliancePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (policy: Partial<CompliancePolicy>) => Promise<void>;
  existingPolicy?: CompliancePolicy;
}

const CompliancePolicyDialog: React.FC<CompliancePolicyDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  existingPolicy
}) => {
  const [name, setName] = useState(existingPolicy?.name || '');
  const [description, setDescription] = useState(existingPolicy?.description || '');
  const [policyType, setPolicyType] = useState<'accessibility' | 'brand' | 'regulatory' | 'security' | 'custom'>(
    existingPolicy?.policy_type || 'security'
  );
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>(
    existingPolicy?.severity || 'medium'
  );
  const [isActive, setIsActive] = useState(existingPolicy?.is_active ?? true);
  const [rules, setRules] = useState<ComplianceRule[]>(existingPolicy?.rules || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name) return;
    
    setIsSubmitting(true);
    
    try {
      const policyData: Partial<CompliancePolicy> = {
        id: existingPolicy?.id || uuidv4(),
        name,
        description,
        policy_type: policyType,
        severity,
        is_active: isActive,
        rules: rules.length > 0 ? rules : [
          {
            id: uuidv4(),
            name: "Default Rule",
            description: "Default rule for " + name
          } as ComplianceRule
        ],
      };
      
      if (existingPolicy?.id) {
        // If we're updating, call the update method
        // await ComplianceService.updatePolicy(policyData);
      }
      
      await onSubmit(policyData);
      resetForm();
    } catch (error) {
      console.error('Error submitting policy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (!existingPolicy) {
      setName('');
      setDescription('');
      setPolicyType('security');
      setSeverity('medium');
      setIsActive(true);
      setRules([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingPolicy ? 'Edit Compliance Policy' : 'Create New Compliance Policy'}
          </DialogTitle>
          <DialogDescription>
            {existingPolicy 
              ? 'Update the policy information and rules.' 
              : 'Define a new compliance policy for your organization.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Policy Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter policy name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter policy description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Policy Type</Label>
              <Select 
                value={policyType} 
                onValueChange={(val) => setPolicyType(val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accessibility">Accessibility</SelectItem>
                  <SelectItem value="brand">Brand Guidelines</SelectItem>
                  <SelectItem value="regulatory">Regulatory</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={severity} 
                onValueChange={(val) => setSeverity(val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="active">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this policy
              </p>
            </div>
            <Switch 
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || isSubmitting}>
            {isSubmitting ? 'Saving...' : existingPolicy ? 'Update Policy' : 'Create Policy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompliancePolicyDialog;
