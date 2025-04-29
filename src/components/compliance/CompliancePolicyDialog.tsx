
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CompliancePolicy, ComplianceRule } from "@/types/compliance";
import { ComplianceService } from "@/services/compliance/ComplianceService";
import { v4 as uuidv4 } from 'uuid';

export interface CompliancePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (policy: Partial<CompliancePolicy>) => Promise<void>;
  policy?: CompliancePolicy;
}

export const CompliancePolicyDialog: React.FC<CompliancePolicyDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  policy
}) => {
  const [name, setName] = useState(policy?.name || '');
  const [description, setDescription] = useState(policy?.description || '');
  const [policyType, setPolicyType] = useState<CompliancePolicy['policy_type']>(policy?.policy_type || 'accessibility');
  const [severity, setSeverity] = useState<CompliancePolicy['severity']>(policy?.severity || 'medium');
  const [isActive, setIsActive] = useState(policy?.is_active !== false);
  const [rules, setRules] = useState<ComplianceRule[]>(policy?.rules || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRule = () => {
    const newRule: ComplianceRule = {
      id: uuidv4(),
      name: `Rule ${rules.length + 1}`,
      description: '',
    };
    setRules([...rules, newRule]);
  };

  const handleRuleChange = (index: number, field: keyof ComplianceRule, value: string) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setRules(updatedRules);
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const policyData: Partial<CompliancePolicy> = {
        name,
        description,
        policy_type: policyType,
        severity,
        is_active: isActive,
        rules
      };

      await onSubmit(policyData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting policy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>{policy ? 'Edit Policy' : 'Create Policy'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="policy-type" className="text-right">Policy Type</Label>
            <Select value={policyType} onValueChange={(value: CompliancePolicy['policy_type']) => setPolicyType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Policy Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accessibility">Accessibility</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="severity" className="text-right">Severity</Label>
            <Select value={severity} onValueChange={(value: CompliancePolicy['severity']) => setSeverity(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is-active" className="text-right">Active</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="is-active" className="cursor-pointer">
                {isActive ? 'Policy is active' : 'Policy is inactive'}
              </Label>
            </div>
          </div>
          
          <div className="my-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Rules</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddRule}>
                Add Rule
              </Button>
            </div>
            
            {rules.length > 0 ? (
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={rule.id} className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Rule {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRule(index)}
                        className="h-8 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`rule-id-${index}`} className="text-right">ID</Label>
                        <Input
                          id={`rule-id-${index}`}
                          value={rule.id}
                          onChange={(e) => handleRuleChange(index, 'id', e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`rule-name-${index}`} className="text-right">Name</Label>
                        <Input
                          id={`rule-name-${index}`}
                          value={rule.name}
                          onChange={(e) => handleRuleChange(index, 'name', e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`rule-desc-${index}`} className="text-right">Description</Label>
                        <Input
                          id={`rule-desc-${index}`}
                          value={rule.description}
                          onChange={(e) => handleRuleChange(index, 'description', e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border rounded-md">
                <p className="text-muted-foreground">No rules added yet. Click "Add Rule" to create one.</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name}
          >
            {isSubmitting ? 'Saving...' : (policy ? 'Update Policy' : 'Create Policy')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompliancePolicyDialog;
