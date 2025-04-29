
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DesignConsistencyService, DesignConsistencyRule } from '@/services/testing/DesignConsistencyService';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { IconCirclePlus } from '@/components/ui/icons';
import { toast } from 'sonner';

interface DesignConsistencyRulesListProps {
  projectId: string;
}

const DesignConsistencyRulesList: React.FC<DesignConsistencyRulesListProps> = ({ projectId }) => {
  const [rules, setRules] = useState<DesignConsistencyRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState<Partial<DesignConsistencyRule>>({
    projectId,
    name: '',
    ruleType: 'color',
    severity: 'medium',
    isActive: true
  });

  useEffect(() => {
    loadRules();
  }, [projectId]);

  const loadRules = async () => {
    setIsLoading(true);
    try {
      const rulesData = await DesignConsistencyService.getRules(projectId);
      setRules(rulesData);
    } catch (error) {
      console.error('Error loading consistency rules:', error);
      toast.error('Failed to load consistency rules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRule = async () => {
    try {
      const createdRule = await DesignConsistencyService.createRule({
        ...newRule,
        projectId
      });
      setRules([...rules, createdRule]);
      setNewRule({
        projectId,
        name: '',
        ruleType: 'color',
        severity: 'medium',
        isActive: true
      });
      setShowAddForm(false);
      toast.success('Rule created successfully');
    } catch (error) {
      console.error('Error creating rule:', error);
      toast.error('Failed to create rule');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Design Consistency Rules</CardTitle>
          <CardDescription>
            Rules that define design consistency requirements
          </CardDescription>
        </div>
        <Button 
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-8"
        >
          <IconCirclePlus className="mr-1 h-4 w-4" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6 p-4 border rounded-md bg-slate-50">
            <h4 className="font-medium mb-4">Create New Rule</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Rule Name</label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  placeholder="e.g. Primary Button Color"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Rule Type</label>
                  <Select 
                    value={newRule.ruleType} 
                    onValueChange={(value) => setNewRule({...newRule, ruleType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="typography">Typography</SelectItem>
                      <SelectItem value="spacing">Spacing</SelectItem>
                      <SelectItem value="component">Component Structure</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Severity</label>
                  <Select 
                    value={newRule.severity} 
                    onValueChange={(value: any) => setNewRule({...newRule, severity: value})}
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
              </div>
              <div>
                <label className="block text-sm mb-1">Property Path</label>
                <Input
                  value={newRule.propertyPath || ''}
                  onChange={(e) => setNewRule({...newRule, propertyPath: e.target.value})}
                  placeholder="e.g. style.backgroundColor"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button onClick={handleCreateRule} disabled={!newRule.name}>Create Rule</Button>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="py-4">Loading rules...</div>
        ) : rules.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-md">
            <p className="text-muted-foreground">No consistency rules defined yet</p>
            <Button 
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="mt-4"
            >
              <IconCirclePlus className="mr-2 h-4 w-4" />
              Create Your First Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {rules.map((rule) => (
              <div 
                key={rule.id} 
                className={`p-4 border rounded-md ${rule.isActive ? '' : 'opacity-60'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                        {rule.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {rule.ruleType.charAt(0).toUpperCase() + rule.ruleType.slice(1)} rule
                      {rule.propertyPath && ` • ${rule.propertyPath}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Active</span>
                      <Switch checked={rule.isActive} />
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DesignConsistencyRulesList;
