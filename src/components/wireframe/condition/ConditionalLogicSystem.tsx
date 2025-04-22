
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CircleCheck, CircleX, GitBranch, LayoutList, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface Condition {
  id: string;
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
  value: any;
}

export interface LogicGroup {
  id: string;
  type: 'and' | 'or';
  conditions: Condition[];
}

export interface ConditionalRule {
  id: string;
  name: string;
  logicGroups: LogicGroup[];
  action: {
    type: 'show' | 'hide' | 'style' | 'property';
    target: string;
    property?: string;
    value: any;
  };
  enabled: boolean;
}

interface ConditionalLogicSystemProps {
  rules: ConditionalRule[];
  onRuleChange: (rules: ConditionalRule[]) => void;
  availableFields?: string[];
  availableTargets?: string[];
}

const ConditionalLogicSystem: React.FC<ConditionalLogicSystemProps> = ({
  rules = [],
  onRuleChange,
  availableFields = ['title', 'subtitle', 'content', 'image', 'button'],
  availableTargets = ['section', 'heading', 'button', 'image', 'container']
}) => {
  const [selectedRule, setSelectedRule] = useState<string | null>(rules.length > 0 ? rules[0].id : null);
  
  const addNewRule = () => {
    const newRule: ConditionalRule = {
      id: `rule-${Date.now()}`,
      name: `Rule ${rules.length + 1}`,
      logicGroups: [
        {
          id: `group-${Date.now()}`,
          type: 'and',
          conditions: [
            {
              id: `condition-${Date.now()}`,
              field: availableFields[0] || 'field',
              operator: 'equals',
              value: ''
            }
          ]
        }
      ],
      action: {
        type: 'show',
        target: availableTargets[0] || 'target',
        value: true
      },
      enabled: true
    };
    
    onRuleChange([...rules, newRule]);
    setSelectedRule(newRule.id);
  };
  
  const deleteRule = (ruleId: string) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    onRuleChange(updatedRules);
    
    if (selectedRule === ruleId) {
      setSelectedRule(updatedRules.length > 0 ? updatedRules[0].id : null);
    }
  };
  
  const updateRule = (updatedRule: ConditionalRule) => {
    const updatedRules = rules.map(rule => 
      rule.id === updatedRule.id ? updatedRule : rule
    );
    onRuleChange(updatedRules);
  };
  
  const addCondition = (ruleId: string, groupId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    const updatedGroups = rule.logicGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: [
            ...group.conditions,
            {
              id: `condition-${Date.now()}`,
              field: availableFields[0] || 'field',
              operator: 'equals',
              value: ''
            }
          ]
        };
      }
      return group;
    });
    
    updateRule({
      ...rule,
      logicGroups: updatedGroups
    });
  };
  
  const addLogicGroup = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    const newGroup: LogicGroup = {
      id: `group-${Date.now()}`,
      type: 'and',
      conditions: [
        {
          id: `condition-${Date.now()}`,
          field: availableFields[0] || 'field',
          operator: 'equals',
          value: ''
        }
      ]
    };
    
    updateRule({
      ...rule,
      logicGroups: [...rule.logicGroups, newGroup]
    });
  };
  
  const updateCondition = (ruleId: string, groupId: string, conditionId: string, updates: Partial<Condition>) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    const updatedGroups = rule.logicGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.map(condition => {
            if (condition.id === conditionId) {
              return { ...condition, ...updates };
            }
            return condition;
          })
        };
      }
      return group;
    });
    
    updateRule({
      ...rule,
      logicGroups: updatedGroups
    });
  };
  
  const deleteCondition = (ruleId: string, groupId: string, conditionId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    const updatedGroups = rule.logicGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.filter(c => c.id !== conditionId)
        };
      }
      return group;
    });
    
    // Don't allow empty condition groups
    const finalGroups = updatedGroups.filter(group => group.conditions.length > 0);
    
    updateRule({
      ...rule,
      logicGroups: finalGroups.length > 0 ? finalGroups : [{
        id: `group-${Date.now()}`,
        type: 'and',
        conditions: [{
          id: `condition-${Date.now()}`,
          field: availableFields[0] || 'field',
          operator: 'equals',
          value: ''
        }]
      }]
    });
  };
  
  const updateGroupType = (ruleId: string, groupId: string, type: 'and' | 'or') => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    const updatedGroups = rule.logicGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, type };
      }
      return group;
    });
    
    updateRule({
      ...rule,
      logicGroups: updatedGroups
    });
  };
  
  const updateAction = (ruleId: string, updates: Partial<ConditionalRule['action']>) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    updateRule({
      ...rule,
      action: { ...rule.action, ...updates }
    });
  };
  
  const toggleRuleEnabled = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    updateRule({
      ...rule,
      enabled: !rule.enabled
    });
  };
  
  const selectedRuleData = selectedRule ? rules.find(r => r.id === selectedRule) : null;
  
  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Conditional Logic Rules</h3>
          <p className="text-sm text-muted-foreground">Define rules for component behavior based on conditions</p>
        </div>
        <Button onClick={addNewRule} size="sm">Add Rule</Button>
      </div>
      
      {rules.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <GitBranch className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4">No Rules Defined</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first conditional rule to control how components behave based on specific criteria.
              </p>
              <Button onClick={addNewRule} className="mt-4">Create Rule</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <Card className="h-full">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Rules</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {rules.map(rule => (
                    <li key={rule.id}>
                      <div 
                        className={`flex items-center p-2 rounded-md text-sm cursor-pointer ${
                          selectedRule === rule.id ? 'bg-primary/10' : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedRule(rule.id)}
                      >
                        <span className="flex-1">{rule.name}</span>
                        <span className="mr-2">
                          {rule.enabled ? 
                            <CircleCheck className="h-4 w-4 text-green-500" /> : 
                            <CircleX className="h-4 w-4 text-red-500" />
                          }
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            {selectedRuleData ? (
              <Card>
                <CardHeader className="py-4 flex flex-row items-center">
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center">
                      <Input 
                        value={selectedRuleData.name} 
                        onChange={(e) => updateRule({
                          ...selectedRuleData,
                          name: e.target.value
                        })}
                        className="h-7 text-base font-medium border-none shadow-none focus-visible:ring-0 p-0 mr-2"
                      />
                      <div className="flex items-center space-x-2 ml-auto">
                        <Switch 
                          id="rule-enabled"
                          checked={selectedRuleData.enabled}
                          onCheckedChange={() => toggleRuleEnabled(selectedRuleData.id)}
                        />
                        <Label htmlFor="rule-enabled" className="text-xs">Enabled</Label>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logic Groups */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium flex items-center">
                        <LayoutList className="h-4 w-4 mr-2" />
                        Conditions
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addLogicGroup(selectedRuleData.id)}
                      >
                        Add Group
                      </Button>
                    </div>
                    
                    {selectedRuleData.logicGroups.map((group, groupIndex) => (
                      <div key={group.id} className="border rounded-md p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <Select
                            value={group.type}
                            onValueChange={(value) => updateGroupType(
                              selectedRuleData.id, 
                              group.id, 
                              value as 'and' | 'or'
                            )}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="and">AND</SelectItem>
                              <SelectItem value="or">OR</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {groupIndex > 0 && (
                            <span className="text-sm text-muted-foreground">OR</span>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          {group.conditions.map((condition, index) => (
                            <div key={condition.id} className="grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-3">
                                <Select
                                  value={condition.field}
                                  onValueChange={(value) => updateCondition(
                                    selectedRuleData.id, 
                                    group.id, 
                                    condition.id, 
                                    { field: value }
                                  )}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableFields.map(field => (
                                      <SelectItem key={field} value={field}>
                                        {field}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="col-span-3">
                                <Select
                                  value={condition.operator}
                                  onValueChange={(value) => updateCondition(
                                    selectedRuleData.id, 
                                    group.id, 
                                    condition.id, 
                                    { operator: value as Condition['operator'] }
                                  )}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="equals">equals</SelectItem>
                                    <SelectItem value="notEquals">not equals</SelectItem>
                                    <SelectItem value="contains">contains</SelectItem>
                                    <SelectItem value="greaterThan">greater than</SelectItem>
                                    <SelectItem value="lessThan">less than</SelectItem>
                                    <SelectItem value="isEmpty">is empty</SelectItem>
                                    <SelectItem value="isNotEmpty">is not empty</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="col-span-4">
                                {!['isEmpty', 'isNotEmpty'].includes(condition.operator) && (
                                  <Input
                                    value={condition.value}
                                    onChange={(e) => updateCondition(
                                      selectedRuleData.id, 
                                      group.id, 
                                      condition.id, 
                                      { value: e.target.value }
                                    )}
                                    placeholder="Value"
                                  />
                                )}
                              </div>
                              
                              <div className="col-span-2 flex justify-end space-x-1">
                                {index === group.conditions.length - 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => addCondition(selectedRuleData.id, group.id)}
                                    className="h-8 w-8"
                                  >
                                    <span className="sr-only">Add condition</span>
                                    +
                                  </Button>
                                )}
                                
                                {group.conditions.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteCondition(selectedRuleData.id, group.id, condition.id)}
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                  >
                                    <span className="sr-only">Delete condition</span>
                                    ×
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      <h4 className="text-sm font-medium">Action</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-3">
                        <Select
                          value={selectedRuleData.action.type}
                          onValueChange={(value) => updateAction(
                            selectedRuleData.id, 
                            { type: value as ConditionalRule['action']['type'] }
                          )}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="show">Show</SelectItem>
                            <SelectItem value="hide">Hide</SelectItem>
                            <SelectItem value="style">Set Style</SelectItem>
                            <SelectItem value="property">Set Property</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-3">
                        <Select
                          value={selectedRuleData.action.target}
                          onValueChange={(value) => updateAction(selectedRuleData.id, { target: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Target" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTargets.map(target => (
                              <SelectItem key={target} value={target}>
                                {target}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {['style', 'property'].includes(selectedRuleData.action.type) && (
                        <div className="md:col-span-3">
                          <Input
                            value={selectedRuleData.action.property || ''}
                            onChange={(e) => updateAction(selectedRuleData.id, { property: e.target.value })}
                            placeholder={selectedRuleData.action.type === 'style' ? 'color' : 'visible'}
                          />
                        </div>
                      )}
                      
                      <div className="md:col-span-3">
                        {['show', 'hide'].includes(selectedRuleData.action.type) ? (
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="action-value"
                              checked={!!selectedRuleData.action.value}
                              onCheckedChange={(checked) => updateAction(selectedRuleData.id, { value: checked })}
                            />
                            <Label htmlFor="action-value">
                              {selectedRuleData.action.type === 'show' ? 'Visible' : 'Hidden'}
                            </Label>
                          </div>
                        ) : (
                          <Input
                            value={selectedRuleData.action.value || ''}
                            onChange={(e) => updateAction(selectedRuleData.id, { value: e.target.value })}
                            placeholder="Value"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t">
                    <Button 
                      variant="outline"
                      onClick={() => deleteRule(selectedRuleData.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete Rule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <GitBranch className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4">Select a Rule</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select a rule from the list or create a new one to get started.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConditionalLogicSystem;
