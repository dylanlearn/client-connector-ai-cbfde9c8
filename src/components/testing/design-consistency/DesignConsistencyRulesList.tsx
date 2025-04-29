
import React, { useEffect, useState } from 'react';
import { DesignConsistencyService, DesignConsistencyRule } from '@/services/testing/DesignConsistencyService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusCircle, X, Check, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DesignConsistencyRulesListProps {
  projectId: string;
}

const DesignConsistencyRulesList: React.FC<DesignConsistencyRulesListProps> = ({ projectId }) => {
  const [rules, setRules] = useState<DesignConsistencyRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingRule, setIsAddingRule] = useState(false);
  
  // Form state for new rule
  const [newRule, setNewRule] = useState<Partial<DesignConsistencyRule>>({
    name: '',
    ruleType: 'color',
    propertyPath: '',
    severity: 'medium',
    isActive: true,
  });

  useEffect(() => {
    const loadRules = async () => {
      setIsLoading(true);
      try {
        const data = await DesignConsistencyService.getRules(projectId);
        setRules(data);
      } catch (error) {
        console.error('Error loading consistency rules:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRules();
  }, [projectId]);

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.ruleType) {
      toast.error('Please provide a name and rule type');
      return;
    }

    try {
      const createdRule = await DesignConsistencyService.createRule({
        projectId,
        name: newRule.name || '',
        ruleType: newRule.ruleType || 'color',
        propertyPath: newRule.propertyPath,
        allowedValues: newRule.allowedValues,
        referenceComponentId: newRule.referenceComponentId,
        severity: newRule.severity as any || 'medium',
        isActive: newRule.isActive !== false,
      });

      setRules([...rules, createdRule]);
      toast.success('Consistency rule created successfully');
      setIsAddingRule(false);
      setNewRule({
        name: '',
        ruleType: 'color',
        propertyPath: '',
        severity: 'medium',
        isActive: true,
      });
    } catch (error) {
      console.error('Error creating rule:', error);
      toast.error('Failed to create consistency rule');
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading design consistency rules...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Consistency Rules</h3>
        <Dialog open={isAddingRule} onOpenChange={setIsAddingRule}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Consistency Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="block text-sm font-medium mb-1">Rule Name</label>
                <Input 
                  value={newRule.name || ''} 
                  onChange={e => setNewRule({...newRule, name: e.target.value})}
                  placeholder="e.g., Primary Button Color"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rule Type</label>
                <Select 
                  value={newRule.ruleType || 'color'} 
                  onValueChange={value => setNewRule({...newRule, ruleType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Color</SelectItem>
                    <SelectItem value="typography">Typography</SelectItem>
                    <SelectItem value="spacing">Spacing</SelectItem>
                    <SelectItem value="sizing">Sizing</SelectItem>
                    <SelectItem value="component">Component</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Property Path</label>
                <Input 
                  value={newRule.propertyPath || ''} 
                  onChange={e => setNewRule({...newRule, propertyPath: e.target.value})}
                  placeholder="e.g., button.primary.backgroundColor"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Severity</label>
                <Select 
                  value={newRule.severity || 'medium'} 
                  onValueChange={value => setNewRule({...newRule, severity: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingRule(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRule}>
                  Create Rule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {rules.length === 0 ? (
        <div className="bg-muted/50 border rounded-md p-6 text-center">
          <p className="mb-3">No consistency rules defined yet.</p>
          <Button onClick={() => setIsAddingRule(true)}>
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Your First Rule
          </Button>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Property Path</th>
                <th className="p-2 text-left">Severity</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-t">
                  <td className="p-2">{rule.name}</td>
                  <td className="p-2">
                    <span className="capitalize">{rule.ruleType}</span>
                  </td>
                  <td className="p-2 max-w-xs truncate">{rule.propertyPath || '-'}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      rule.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      rule.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                      rule.severity === 'low' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td className="p-2">
                    {rule.isActive ? (
                      <span className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center text-slate-500">
                        <X className="h-4 w-4 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DesignConsistencyRulesList;
