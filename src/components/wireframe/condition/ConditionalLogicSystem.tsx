
import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2, Condition, LogicAnd, LogicOr, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

// Condition types
export type ConditionOperator = 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isTrue' | 'isFalse' | 'isEmpty' | 'isNotEmpty';
export type ConditionLogic = 'and' | 'or';

export interface ConditionalRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: Condition[];
  logic: ConditionLogic;
  effect: {
    type: 'visibility' | 'style' | 'behavior';
    action: string;
    value?: any;
  };
}

export interface Condition {
  id: string;
  property: string;
  operator: ConditionOperator;
  value: any;
}

export interface ConditionalLogicSystemProps {
  componentId: string;
  rules: ConditionalRule[];
  availableProperties: Array<{id: string; name: string; type: string}>;
  onRuleCreate?: (rule: ConditionalRule) => void;
  onRuleUpdate?: (id: string, rule: Partial<ConditionalRule>) => void;
  onRuleDelete?: (id: string) => void;
  onRuleToggle?: (id: string, enabled: boolean) => void;
}

export const ConditionalLogicSystem: React.FC<ConditionalLogicSystemProps> = ({
  componentId,
  rules = [],
  availableProperties = [],
  onRuleCreate,
  onRuleUpdate,
  onRuleDelete,
  onRuleToggle
}) => {
  const [newRule, setNewRule] = useState<Partial<ConditionalRule>>({
    name: '',
    enabled: true,
    conditions: [],
    logic: 'and',
    effect: { type: 'visibility', action: 'show' }
  });
  
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const handleAddCondition = (ruleId: string | null) => {
    const newCondition = {
      id: `condition-${Date.now()}`,
      property: availableProperties[0]?.id || '',
      operator: 'equals' as ConditionOperator,
      value: ''
    };
    
    if (ruleId === null) {
      // Adding to the new rule form
      setNewRule({
        ...newRule,
        conditions: [...(newRule.conditions || []), newCondition]
      });
    } else {
      // Adding to an existing rule
      const rule = rules.find(r => r.id === ruleId);
      if (rule && onRuleUpdate) {
        onRuleUpdate(ruleId, {
          conditions: [...rule.conditions, newCondition]
        });
      }
    }
  };
  
  const handleRemoveCondition = (ruleId: string | null, conditionId: string) => {
    if (ruleId === null) {
      // Removing from new rule form
      setNewRule({
        ...newRule,
        conditions: (newRule.conditions || []).filter(c => c.id !== conditionId)
      });
    } else {
      // Removing from existing rule
      const rule = rules.find(r => r.id === ruleId);
      if (rule && onRuleUpdate) {
        onRuleUpdate(ruleId, {
          conditions: rule.conditions.filter(c => c.id !== conditionId)
        });
      }
    }
  };
  
  const handleUpdateCondition = (
    ruleId: string | null, 
    conditionId: string, 
    updates: Partial<Condition>
  ) => {
    if (ruleId === null) {
      // Updating in new rule form
      setNewRule({
        ...newRule,
        conditions: (newRule.conditions || []).map(c => 
          c.id === conditionId ? { ...c, ...updates } : c
        )
      });
    } else {
      // Updating in existing rule
      const rule = rules.find(r => r.id === ruleId);
      if (rule && onRuleUpdate) {
        onRuleUpdate(ruleId, {
          conditions: rule.conditions.map(c => 
            c.id === conditionId ? { ...c, ...updates } : c
          )
        });
      }
    }
  };
  
  const handleCreateRule = () => {
    if (!newRule.name || !newRule.effect?.type) return;
    
    const ruleToCreate: ConditionalRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name,
      enabled: newRule.enabled || true,
      conditions: newRule.conditions || [],
      logic: newRule.logic || 'and',
      effect: newRule.effect as ConditionalRule['effect']
    };
    
    onRuleCreate?.(ruleToCreate);
    setNewRule({
      name: '',
      enabled: true,
      conditions: [],
      logic: 'and',
      effect: { type: 'visibility', action: 'show' }
    });
    setShowNewRuleForm(false);
  };

  const getOperatorOptions = (propertyType: string) => {
    const commonOptions = [
      { value: 'equals', label: 'Equals' },
      { value: 'notEquals', label: 'Not Equals' }
    ];
    
    switch (propertyType) {
      case 'string':
        return [
          ...commonOptions,
          { value: 'contains', label: 'Contains' },
          { value: 'isEmpty', label: 'Is Empty' },
          { value: 'isNotEmpty', label: 'Is Not Empty' }
        ];
      case 'number':
        return [
          ...commonOptions,
          { value: 'greaterThan', label: 'Greater Than' },
          { value: 'lessThan', label: 'Less Than' }
        ];
      case 'boolean':
        return [
          { value: 'isTrue', label: 'Is True' },
          { value: 'isFalse', label: 'Is False' }
        ];
      default:
        return commonOptions;
    }
  };

  const getActionOptions = (effectType: string) => {
    switch (effectType) {
      case 'visibility':
        return [
          { value: 'show', label: 'Show' },
          { value: 'hide', label: 'Hide' }
        ];
      case 'style':
        return [
          { value: 'addClass', label: 'Add Class' },
          { value: 'removeClass', label: 'Remove Class' },
          { value: 'setStyle', label: 'Set Style' }
        ];
      case 'behavior':
        return [
          { value: 'enable', label: 'Enable' },
          { value: 'disable', label: 'Disable' },
          { value: 'trigger', label: 'Trigger Action' }
        ];
      default:
        return [];
    }
  };

  const renderConditionForm = (
    condition: Condition,
    index: number,
    ruleId: string | null
  ) => {
    const propertyType = availableProperties.find(p => p.id === condition.property)?.type || 'string';
    const operators = getOperatorOptions(propertyType);

    return (
      <div key={condition.id} className="p-3 bg-muted/40 rounded-md mb-2 border">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{`Condition ${index + 1}`}</Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveCondition(ruleId, condition.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid gap-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Property</Label>
              <Select
                value={condition.property}
                onValueChange={(value) => 
                  handleUpdateCondition(ruleId, condition.id, { property: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {availableProperties.map(prop => (
                    <SelectItem key={prop.id} value={prop.id}>
                      {prop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs">Operator</Label>
              <Select
                value={condition.operator}
                onValueChange={(value) => 
                  handleUpdateCondition(ruleId, condition.id, { 
                    operator: value as ConditionOperator 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs">Value</Label>
              {propertyType === 'boolean' ? (
                <Select
                  value={String(condition.value)}
                  onValueChange={(value) => 
                    handleUpdateCondition(ruleId, condition.id, { 
                      value: value === 'true' 
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={condition.value}
                  onChange={(e) => 
                    handleUpdateCondition(ruleId, condition.id, { 
                      value: propertyType === 'number' 
                        ? Number(e.target.value) 
                        : e.target.value 
                    })
                  }
                  type={propertyType === 'number' ? 'number' : 'text'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Condition className="h-5 w-5 mr-2" />
          Conditional Logic
        </h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowNewRuleForm(!showNewRuleForm)}
        >
          {showNewRuleForm ? 'Cancel' : (
            <>
              <Plus className="h-4 w-4 mr-1" /> Add Rule
            </>
          )}
        </Button>
      </div>

      {showNewRuleForm && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Create New Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rule Name</Label>
                  <Input 
                    value={newRule.name} 
                    onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                    placeholder="Enter rule name..."
                  />
                </div>
                <div>
                  <Label>Logic Type</Label>
                  <Select
                    value={newRule.logic}
                    onValueChange={(value) => 
                      setNewRule({...newRule, logic: value as ConditionLogic})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="and">AND (All conditions must match)</SelectItem>
                      <SelectItem value="or">OR (Any condition can match)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Conditions</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAddCondition(null)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Condition
                  </Button>
                </div>
                
                {(newRule.conditions || []).length === 0 ? (
                  <div className="text-center p-4 border rounded-md bg-muted/40 text-muted-foreground">
                    No conditions added yet. Add at least one condition.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(newRule.conditions || []).map((condition, index) => 
                      renderConditionForm(condition, index, null)
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Effect Type</Label>
                  <Select
                    value={newRule.effect?.type}
                    onValueChange={(value) => 
                      setNewRule({
                        ...newRule, 
                        effect: { 
                          ...newRule.effect!, 
                          type: value as ConditionalRule['effect']['type'],
                          action: getActionOptions(value)[0]?.value || ''
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visibility">Visibility</SelectItem>
                      <SelectItem value="style">Style</SelectItem>
                      <SelectItem value="behavior">Behavior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Action</Label>
                  <Select
                    value={newRule.effect?.action}
                    onValueChange={(value) => 
                      setNewRule({
                        ...newRule, 
                        effect: { ...newRule.effect!, action: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getActionOptions(newRule.effect?.type || 'visibility').map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {newRule.effect?.type === 'style' && (
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={newRule.effect?.value || ''}
                      onChange={(e) => 
                        setNewRule({
                          ...newRule, 
                          effect: { ...newRule.effect!, value: e.target.value }
                        })
                      }
                      placeholder={
                        newRule.effect?.action === 'addClass' || newRule.effect?.action === 'removeClass'
                          ? "Class name"
                          : "CSS property: value"
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowNewRuleForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateRule}>
                  Create Rule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {rules.length === 0 ? (
        <div className="text-center p-8 border rounded-lg text-muted-foreground">
          No conditional rules defined yet. Add a rule to get started.
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-2">
          {rules.map(rule => (
            <AccordionItem 
              key={rule.id} 
              value={rule.id}
              className="border rounded-md overflow-hidden"
            >
              <AccordionTrigger className="px-4 hover:bg-accent/20">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {rule.effect.type === 'visibility' ? (
                      rule.effect.action === 'show' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />
                    ) : rule.effect.type === 'style' ? (
                      <Filter className="h-4 w-4" />
                    ) : (
                      <Condition className="h-4 w-4" />
                    )}
                    <span>{rule.name}</span>
                    
                    <Badge 
                      variant={rule.logic === 'and' ? 'outline' : 'secondary'} 
                      className="ml-2"
                    >
                      {rule.logic === 'and' ? (
                        <LogicAnd className="h-3 w-3 mr-1" />
                      ) : (
                        <LogicOr className="h-3 w-3 mr-1" />
                      )}
                      {rule.logic.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center mr-8">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) => onRuleToggle?.(rule.id, checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium mb-1">Effect Type</p>
                      <p className="capitalize">{rule.effect.type}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Action</p>
                      <p className="capitalize">{rule.effect.action}</p>
                    </div>
                    {rule.effect.value && (
                      <div>
                        <p className="text-xs font-medium mb-1">Value</p>
                        <p>{rule.effect.value}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Conditions</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddCondition(rule.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    
                    {rule.conditions.map((condition, index) => 
                      renderConditionForm(condition, index, rule.id)
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onRuleDelete?.(rule.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete Rule
                    </Button>
                    {editingRuleId === rule.id && (
                      <Button onClick={() => setEditingRuleId(null)}>
                        Update Rule
                      </Button>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default ConditionalLogicSystem;
