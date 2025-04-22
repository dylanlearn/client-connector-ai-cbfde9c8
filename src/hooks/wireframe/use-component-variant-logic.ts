
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Condition,
  ConditionOperator,
  Effect,
  ConditionalRule,
  LogicGroup,
  EffectType
} from '@/components/wireframe/condition/ConditionalLogicSystem';

export interface ComponentState {
  [key: string]: any;
}

export interface ConditionalLogicHookResult {
  rules: ConditionalRule[];
  addRule: (name: string) => void;
  updateRule: (ruleId: string, updates: Partial<ConditionalRule>) => void;
  deleteRule: (ruleId: string) => void;
  evaluateRules: (state: ComponentState) => Effect[];
  applyEffects: (effects: Effect[], state: ComponentState) => ComponentState;
}

export function useComponentVariantLogic(initialRules: ConditionalRule[] = []): ConditionalLogicHookResult {
  const [rules, setRules] = useState<ConditionalRule[]>(initialRules);

  const addRule = useCallback((name: string) => {
    const newRule: ConditionalRule = {
      id: uuidv4(),
      name: name,
      active: true,
      logicGroups: [
        {
          id: uuidv4(),
          type: 'and',
          conditions: [
            {
              id: uuidv4(),
              field: 'visible',
              operator: 'equals',
              value: true
            }
          ]
        }
      ],
      effect: {
        type: 'style',
        target: 'component',
        value: 'bg-blue-500',
        property: 'backgroundColor'
      }
    };
    
    setRules(prevRules => [...prevRules, newRule]);
  }, []);

  const updateRule = useCallback((ruleId: string, updates: Partial<ConditionalRule>) => {
    setRules(prevRules => 
      prevRules.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  }, []);

  const deleteRule = useCallback((ruleId: string) => {
    setRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
  }, []);

  // Evaluate a single condition
  const evaluateCondition = useCallback((condition: Condition, state: ComponentState): boolean => {
    const { field, operator, value } = condition;
    const fieldValue = state[field];
    
    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'contains':
        return typeof fieldValue === 'string' && 
               typeof value === 'string' && 
               fieldValue.includes(value);
      case 'greaterThan':
        return typeof fieldValue === 'number' && 
               typeof value === 'number' && 
               fieldValue > value;
      case 'lessThan':
        return typeof fieldValue === 'number' && 
               typeof value === 'number' && 
               fieldValue < value;
      case 'isEmpty':
        return fieldValue === '' || fieldValue === null || fieldValue === undefined;
      case 'isNotEmpty':
        return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
      case 'isTrue':
        return Boolean(fieldValue) === true;
      case 'isFalse':
        return Boolean(fieldValue) === false;
      default:
        return false;
    }
  }, []);

  // Evaluate a logic group (AND/OR of conditions)
  const evaluateLogicGroup = useCallback((group: LogicGroup, state: ComponentState): boolean => {
    if (group.conditions.length === 0) return false;
    
    if (group.type === 'and') {
      return group.conditions.every(condition => evaluateCondition(condition, state));
    } else { // 'or'
      return group.conditions.some(condition => evaluateCondition(condition, state));
    }
  }, [evaluateCondition]);

  // Evaluate all rules and get effects that should be applied
  const evaluateRules = useCallback((state: ComponentState): Effect[] => {
    const applicableEffects: Effect[] = [];
    
    rules.forEach(rule => {
      if (!rule.active) return;
      
      // Rule is triggered if ANY logic group evaluates to true (ORed together)
      const isRuleTriggered = rule.logicGroups.some(group => 
        evaluateLogicGroup(group, state)
      );
      
      if (isRuleTriggered) {
        applicableEffects.push(rule.effect);
      }
    });
    
    return applicableEffects;
  }, [rules, evaluateLogicGroup]);

  // Apply effects to a component state
  const applyEffects = useCallback((effects: Effect[], state: ComponentState): ComponentState => {
    const newState = { ...state };
    
    effects.forEach(effect => {
      switch (effect.type) {
        case 'show':
          newState['visible'] = true;
          break;
        case 'hide':
          newState['visible'] = false;
          break;
        case 'style':
          if (!newState.style) newState.style = {};
          if (effect.property) {
            newState.style[effect.property] = effect.value;
          }
          break;
        case 'class':
          // For class effects, we're adding CSS classes
          if (!newState.className) newState.className = '';
          newState.className = `${newState.className} ${effect.value}`.trim();
          break;
        case 'property':
          // Set arbitrary property
          if (effect.property) {
            newState[effect.property] = effect.value;
          }
          break;
      }
    });
    
    return newState;
  }, []);

  return {
    rules,
    addRule,
    updateRule,
    deleteRule,
    evaluateRules,
    applyEffects
  };
}

export default useComponentVariantLogic;
