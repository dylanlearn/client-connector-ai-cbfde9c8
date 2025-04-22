
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Check, X, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react';

// Type definitions for the conditional logic system

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

export interface Condition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: any;
}

export type LogicOperator = "and" | "or";

export interface LogicGroup {
  id: string;
  type: LogicOperator;
  conditions: Condition[];
}

export type EffectType = "style" | "class" | "property" | "show" | "hide";

export interface Effect {
  type: EffectType;
  target: string;
  value: any;
  property?: string;
}

export interface ConditionalRule {
  id: string;
  name: string;
  active: boolean;
  logicGroups: LogicGroup[];
  effect: Effect;
}

export interface ConditionalLogicSystemProps {
  rules: ConditionalRule[];
  onAddRule?: (rule: ConditionalRule) => void;
  onUpdateRule?: (ruleId: string, updates: Partial<ConditionalRule>) => void;
  onDeleteRule?: (ruleId: string) => void;
}

export const createDefaultRule = (): ConditionalRule => {
  return {
    id: uuidv4(),
    name: "New Rule",
    active: true,
    logicGroups: [
      {
        id: uuidv4(),
        type: "and",
        conditions: [
          {
            id: uuidv4(),
            field: "visible",
            operator: "equals",
            value: true
          }
        ]
      }
    ],
    effect: {
      type: "style",
      target: "component",
      property: "backgroundColor",
      value: "#3498db"
    }
  };
};

const ConditionalLogicSystem: React.FC<ConditionalLogicSystemProps> = ({
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule
}) => {
  const handleAddRule = () => {
    if (onAddRule) {
      onAddRule(createDefaultRule());
    }
  };
  
  const handleToggleRule = (ruleId: string, active: boolean) => {
    if (onUpdateRule) {
      onUpdateRule(ruleId, { active });
    }
  };
  
  const handleDeleteRule = (ruleId: string) => {
    if (onDeleteRule) {
      onDeleteRule(ruleId);
    }
  };
  
  return (
    <div className="conditional-logic-system">
      <h3 className="text-lg font-medium mb-4">Conditional Logic Rules</h3>
      
      {rules.length === 0 ? (
        <div className="text-gray-500 text-sm p-4 border border-dashed rounded-md">
          No rules defined. Add a rule to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map(rule => (
            <div 
              key={rule.id} 
              className={`p-4 border rounded-md ${rule.active ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{rule.name}</h4>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleToggleRule(rule.id, !rule.active)}
                  >
                    {rule.active ? <Check size={18} /> : <X size={18} />}
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mt-2 text-sm">
                <div className="flex items-center text-gray-600 mb-1">
                  <span>When</span>
                </div>
                
                <div className="pl-4">
                  {rule.logicGroups.map((group, idx) => (
                    <React.Fragment key={group.id}>
                      {idx > 0 && (
                        <div className="flex items-center my-1 text-orange-600">
                          <ToggleRight size={16} className="mr-1" />
                          <span>OR</span>
                        </div>
                      )}
                      <div className="pl-2">
                        {group.conditions.map((condition, condIdx) => (
                          <React.Fragment key={condition.id}>
                            {condIdx > 0 && (
                              <div className="flex items-center my-1 text-green-600">
                                <ToggleLeft size={16} className="mr-1" />
                                <span>AND</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <span className="font-medium">{condition.field}</span>
                              <span className="mx-1">{condition.operator}</span>
                              <span className="text-blue-600">{String(condition.value)}</span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                
                <div className="flex items-center text-gray-600 mt-2 mb-1">
                  <span>Then</span>
                </div>
                
                <div className="pl-4 flex items-center">
                  <span className="mr-1">{rule.effect.type}</span>
                  <ArrowRight size={14} className="mx-1" />
                  <span className="font-medium">{rule.effect.property || rule.effect.type}</span>
                  <span className="mx-1">=</span>
                  <span className="text-green-600">{String(rule.effect.value)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={handleAddRule}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add New Rule
      </button>
    </div>
  );
};

export default ConditionalLogicSystem;
