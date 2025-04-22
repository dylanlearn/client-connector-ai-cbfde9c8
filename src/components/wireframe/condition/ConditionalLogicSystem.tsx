
import React, { useState } from 'react';
import { Check, X, Plus, Trash2, Settings2, SlidersHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Define specific operator types to avoid string type errors
export type ConditionOperator = 
  | "equals" 
  | "notEquals" 
  | "contains" 
  | "greaterThan" 
  | "lessThan" 
  | "isEmpty" 
  | "isNotEmpty"
  | "isTrue"
  | "isFalse";

// Define the structure of a single condition
export interface Condition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean;
}

// Define the structure of a logic group
export interface LogicGroup {
  id: string;
  type: 'and' | 'or';
  conditions: Condition[];
}

// Define effect types that can be applied when conditions are met
export type EffectType = 'show' | 'hide' | 'style' | 'class' | 'property';

// Define the structure of effects applied when conditions are met
export interface Effect {
  type: EffectType;
  target: string;
  value: any;
  property?: string;
}

// Define the complete conditional rule structure
export interface ConditionalRule {
  id: string;
  name: string;
  logicGroups: LogicGroup[];
  effect: Effect;
  active: boolean;
}

interface ConditionalLogicSystemProps {
  rules?: ConditionalRule[];
  onRulesChange?: (rules: ConditionalRule[]) => void;
  availableFields?: string[];
}

export const ConditionalLogicSystem: React.FC<ConditionalLogicSystemProps> = ({
  rules: initialRules = [],
  onRulesChange,
  availableFields = ['text', 'visible', 'enabled', 'size', 'color', 'style']
}) => {
  const [rules, setRules] = useState<ConditionalRule[]>(initialRules);

  const handleAddRule = () => {
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
              field: availableFields[0] || 'text',
              operator: 'equals',
              value: ''
            }
          ]
        }
      ],
      effect: {
        type: 'style',
        target: 'component',
        value: 'bg-blue-500',
        property: 'backgroundColor'
      },
      active: true
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onRulesChange?.(updatedRules);
  };

  const handleRuleChange = (index: number, rule: ConditionalRule) => {
    const updatedRules = [...rules];
    updatedRules[index] = rule;
    setRules(updatedRules);
    onRulesChange?.(updatedRules);
  };

  const handleDeleteRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
    onRulesChange?.(updatedRules);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Conditional Logic Rules</h2>
        <Button onClick={handleAddRule}>
          <Plus className="mr-2 h-4 w-4" /> Add Rule
        </Button>
      </div>

      {rules.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>No rules defined yet. Click "Add Rule" to create your first conditional rule.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              availableFields={availableFields}
              onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
              onDelete={() => handleDeleteRule(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface RuleCardProps {
  rule: ConditionalRule;
  availableFields: string[];
  onChange: (rule: ConditionalRule) => void;
  onDelete: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({
  rule,
  availableFields,
  onChange,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...rule, name: e.target.value });
  };

  const handleActiveChange = (checked: boolean) => {
    onChange({ ...rule, active: checked });
  };

  const handleAddLogicGroup = () => {
    const newGroup: LogicGroup = {
      id: `group-${Date.now()}`,
      type: 'and',
      conditions: [
        {
          id: `condition-${Date.now()}`,
          field: availableFields[0] || 'text',
          operator: 'equals',
          value: ''
        }
      ]
    };

    onChange({
      ...rule,
      logicGroups: [...rule.logicGroups, newGroup]
    });
  };

  const handleLogicGroupChange = (index: number, group: LogicGroup) => {
    const updatedGroups = [...rule.logicGroups];
    updatedGroups[index] = group;
    onChange({ ...rule, logicGroups: updatedGroups });
  };

  const handleLogicGroupDelete = (index: number) => {
    if (rule.logicGroups.length <= 1) return;
    const updatedGroups = rule.logicGroups.filter((_, i) => i !== index);
    onChange({ ...rule, logicGroups: updatedGroups });
  };

  const handleEffectChange = (effect: Effect) => {
    onChange({ ...rule, effect });
  };

  return (
    <Card className={rule.active ? 'border-primary' : 'border-muted'}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <Input
              value={rule.name}
              onChange={handleNameChange}
              className="text-lg font-bold h-8 p-2"
            />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={rule.active}
                onCheckedChange={handleActiveChange}
                id={`rule-active-${rule.id}`}
              />
              <Label htmlFor={`rule-active-${rule.id}`} className="cursor-pointer">
                {rule.active ? 'Active' : 'Inactive'}
              </Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="pb-3 pt-0 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">When these conditions are met:</h4>
                {rule.logicGroups.length > 1 && (
                  <p className="text-sm text-muted-foreground">Logic groups are combined with OR operator</p>
                )}
              </div>
              
              {rule.logicGroups.map((group, index) => (
                <LogicGroupCard
                  key={group.id}
                  group={group}
                  availableFields={availableFields}
                  onChange={(updatedGroup) => handleLogicGroupChange(index, updatedGroup)}
                  onDelete={() => handleLogicGroupDelete(index)}
                  showDelete={rule.logicGroups.length > 1}
                />
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddLogicGroup}
                className="w-full mt-2"
              >
                <Plus className="mr-2 h-3 w-3" /> Add Logic Group (OR)
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Then apply this effect:</h4>
              <EffectEditor
                effect={rule.effect}
                onChange={handleEffectChange}
              />
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

interface LogicGroupCardProps {
  group: LogicGroup;
  availableFields: string[];
  onChange: (group: LogicGroup) => void;
  onDelete: () => void;
  showDelete: boolean;
}

const LogicGroupCard: React.FC<LogicGroupCardProps> = ({
  group,
  availableFields,
  onChange,
  onDelete,
  showDelete
}) => {
  const handleTypeChange = (type: 'and' | 'or') => {
    onChange({ ...group, type });
  };

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: `condition-${Date.now()}`,
      field: availableFields[0] || 'text',
      operator: 'equals',
      value: ''
    };

    onChange({
      ...group,
      conditions: [...group.conditions, newCondition]
    });
  };

  const handleConditionChange = (index: number, condition: Condition) => {
    const updatedConditions = [...group.conditions];
    updatedConditions[index] = condition;
    onChange({ ...group, conditions: updatedConditions });
  };

  const handleConditionDelete = (index: number) => {
    if (group.conditions.length <= 1) return;
    const updatedConditions = group.conditions.filter((_, i) => i !== index);
    onChange({ ...group, conditions: updatedConditions });
  };

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-3 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Logic:</span>
            <div className="flex rounded-md overflow-hidden">
              <Button
                size="sm"
                variant={group.type === 'and' ? 'default' : 'outline'}
                className="rounded-none rounded-l-md px-2 py-1 h-8"
                onClick={() => handleTypeChange('and')}
              >
                AND
              </Button>
              <Button
                size="sm"
                variant={group.type === 'or' ? 'default' : 'outline'}
                className="rounded-none rounded-r-md px-2 py-1 h-8"
                onClick={() => handleTypeChange('or')}
              >
                OR
              </Button>
            </div>
          </div>
          {showDelete && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {group.conditions.map((condition, index) => (
            <ConditionEditor
              key={condition.id}
              condition={condition}
              availableFields={availableFields}
              onChange={(updatedCondition) => handleConditionChange(index, updatedCondition)}
              onDelete={() => handleConditionDelete(index)}
              showDelete={group.conditions.length > 1}
            />
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddCondition}
            className="w-full mt-2 border border-dashed"
          >
            <Plus className="mr-1 h-3 w-3" /> Add Condition
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ConditionEditorProps {
  condition: Condition;
  availableFields: string[];
  onChange: (condition: Condition) => void;
  onDelete: () => void;
  showDelete: boolean;
}

const ConditionEditor: React.FC<ConditionEditorProps> = ({
  condition,
  availableFields,
  onChange,
  onDelete,
  showDelete
}) => {
  const operators: { value: ConditionOperator; label: string }[] = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'isNotEmpty', label: 'Is Not Empty' },
    { value: 'isTrue', label: 'Is True' },
    { value: 'isFalse', label: 'Is False' }
  ];

  const handleFieldChange = (value: string) => {
    onChange({ ...condition, field: value });
  };

  const handleOperatorChange = (value: ConditionOperator) => {
    onChange({ ...condition, operator: value });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...condition, value: e.target.value });
  };

  const needsValueInput = !['isEmpty', 'isNotEmpty', 'isTrue', 'isFalse'].includes(condition.operator);

  return (
    <div className="flex gap-2 items-center">
      <div className="w-1/3">
        <Select
          value={condition.field}
          onValueChange={handleFieldChange}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {availableFields.map(field => (
              <SelectItem key={field} value={field}>{field}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-1/3">
        <Select
          value={condition.operator}
          onValueChange={handleOperatorChange as (value: string) => void}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            {operators.map(op => (
              <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {needsValueInput ? (
        <div className="flex-1">
          <Input
            value={condition.value as string}
            onChange={handleValueChange}
            placeholder="Value"
            className="h-8"
          />
        </div>
      ) : (
        <div className="flex-1 h-8 flex items-center px-2 bg-muted rounded-md">
          <span className="text-sm text-muted-foreground">No value needed</span>
        </div>
      )}

      {showDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

interface EffectEditorProps {
  effect: Effect;
  onChange: (effect: Effect) => void;
}

const EffectEditor: React.FC<EffectEditorProps> = ({
  effect,
  onChange
}) => {
  const effectTypes = [
    { value: 'show', label: 'Show Element' },
    { value: 'hide', label: 'Hide Element' },
    { value: 'style', label: 'Apply Style' },
    { value: 'class', label: 'Toggle Class' },
    { value: 'property', label: 'Set Property' }
  ];

  const handleTypeChange = (value: string) => {
    onChange({ ...effect, type: value as EffectType });
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...effect, target: e.target.value });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...effect, value: e.target.value });
  };

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...effect, property: e.target.value });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="effect-type">Effect Type</Label>
          <Select
            value={effect.type}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger id="effect-type">
              <SelectValue placeholder="Select effect" />
            </SelectTrigger>
            <SelectContent>
              {effectTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="effect-target">Target Element</Label>
          <Input
            id="effect-target"
            value={effect.target}
            onChange={handleTargetChange}
            placeholder="Element ID or selector"
          />
        </div>
      </div>

      {(effect.type === 'style' || effect.type === 'property') && (
        <div>
          <Label htmlFor="effect-property">Property Name</Label>
          <Input
            id="effect-property"
            value={effect.property || ''}
            onChange={handlePropertyChange}
            placeholder={effect.type === 'style' ? 'backgroundColor' : 'enabled'}
          />
        </div>
      )}

      {effect.type !== 'show' && effect.type !== 'hide' && (
        <div>
          <Label htmlFor="effect-value">Value</Label>
          <Input
            id="effect-value"
            value={effect.value}
            onChange={handleValueChange}
            placeholder={effect.type === 'class' ? 'active highlighted' : 
                        effect.type === 'style' ? 'rgb(59, 130, 246)' : 'true'}
          />
        </div>
      )}
    </div>
  );
};

export default ConditionalLogicSystem;
