import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CompliancePolicy, ComplianceRule } from "@/types/compliance";
import { ComplianceService } from "@/services/compliance/ComplianceService";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface CompliancePolicyDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  policy?: CompliancePolicy;
  onComplete?: () => void;
}

interface RuleForm {
  id: string;
  name: string;
  description: string;
  validator?: string;
  params?: Record<string, any>;
}

export function CompliancePolicyDialog({
  open,
  setOpen,
  policy,
  onComplete
}: CompliancePolicyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formRules, setFormRules] = useState<RuleForm[]>(policy ? policy.rules : [{ id: uuidv4(), name: '', description: '' }]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (policy) {
      setFormRules(policy.rules.map(rule => ({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        validator: rule.validator,
        params: rule.params
      })));
    } else {
      // Initialize with a single empty rule when creating a new policy
      setFormRules([{ id: uuidv4(), name: '', description: '' }]);
    }
  }, [policy]);

  const addRule = () => {
    setFormRules([...formRules, { id: uuidv4(), name: '', description: '' }]);
  };

  const removeRule = (id: string) => {
    setFormRules(formRules.filter(rule => rule.id !== id));
  };

  const updateRule = (id: string, field: string, value: string) => {
    setFormRules(formRules.map(rule =>
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Extract rules and ensure each has an id property
      const rules = formRules.map(rule => ({
        id: rule.id || crypto.randomUUID(), // Ensure id is present
        name: rule.name || '',
        description: rule.description || '',
        validator: rule.validator,
        params: rule.params
      }));
      
      const policyData: Partial<CompliancePolicy> = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        policy_type: formData.get('policy_type') as CompliancePolicy['policy_type'],
        severity: formData.get('severity') as CompliancePolicy['severity'],
        is_active: formData.get('is_active') === 'true',
        rules: rules, // Now correctly typed as ComplianceRule[]
      };
      
      let result;
      if (policy) {
        result = await ComplianceService.updatePolicy(policy.id, policyData);
      } else {
        result = await ComplianceService.createPolicy(policyData);
      }
      
      if (result) {
        toast.success(policy ? "Policy updated successfully" : "Policy created successfully");
        setOpen(false);
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error('Error saving compliance policy:', error);
      toast.error('Failed to save compliance policy');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          {policy ? "Edit Policy" : "Add Policy"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{policy ? "Edit Policy" : "Add Policy"}</AlertDialogTitle>
          <AlertDialogDescription>
            {policy ? "Update the compliance policy details." : "Create a new compliance policy."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmit(formData);
        }}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input type="text" id="name" name="name" defaultValue={policy?.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input type="text" id="description" name="description" defaultValue={policy?.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="policy_type" className="text-right">
                Policy Type
              </Label>
              <Select defaultValue={policy?.policy_type || 'security'} name="policy_type">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="accessibility">Accessibility</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="regulatory">Regulatory</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="severity" className="text-right">
                Severity
              </Label>
              <Select defaultValue={policy?.severity || 'high'} name="severity">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">
                Active
              </Label>
              <Switch id="is_active" name="is_active" defaultChecked={policy?.is_active} />
            </div>

            {/* Rules Form */}
            <div className="col-span-4">
              <h4 className="mb-2 font-semibold">Rules</h4>
              {formRules.map((rule, index) => (
                <div key={rule.id} className="grid grid-cols-4 items-center gap-4 mb-2">
                  <Label htmlFor={`rule_name_${index}`} className="text-right">
                    Rule {index + 1}
                  </Label>
                  <Input
                    type="text"
                    id={`rule_name_${index}`}
                    value={rule.name}
                    onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                    className="col-span-2"
                    placeholder="Rule Name"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeRule(rule.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Label htmlFor={`rule_description_${index}`} className="text-right">
                    Description
                  </Label>
                  <Input
                    type="text"
                    id={`rule_description_${index}`}
                    value={rule.description}
                    onChange={(e) => updateRule(rule.id, 'description', e.target.value)}
                    className="col-span-3"
                    placeholder="Description"
                  />
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addRule}>
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
