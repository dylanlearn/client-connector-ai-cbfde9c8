
import { useState, useCallback, useEffect } from 'react';
import { ComponentVariant } from '@/components/wireframe/registry/component-types';
import { ConditionalRule, Condition, ConditionOperator } from '@/components/wireframe/condition/ConditionalLogicSystem';
import { toast } from '@/hooks/use-toast';
import { WireframeComponent } from '@/types/wireframe-component';

export interface ComponentVariantLogicOptions {
  componentType: string;
  initialVariants?: ComponentVariant[];
  initialRules?: ConditionalRule[];
  baseProperties?: Record<string, any>;
  onChange?: (updates: {
    variants?: ComponentVariant[];
    rules?: ConditionalRule[];
  }) => void;
}

export function useComponentVariantLogic({
  componentType,
  initialVariants = [],
  initialRules = [],
  baseProperties = {},
  onChange
}: ComponentVariantLogicOptions) {
  const [variants, setVariants] = useState<ComponentVariant[]>(initialVariants);
  const [rules, setRules] = useState<ConditionalRule[]>(initialRules);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    initialVariants.length > 0 ? initialVariants[0].id : null
  );
  
  // Notify parent component of changes
  useEffect(() => {
    onChange?.({ variants, rules });
  }, [variants, rules, onChange]);
  
  // Variant Management
  const createVariant = useCallback((variant: Partial<ComponentVariant>) => {
    if (!variant.name) {
      toast({
        title: "Error",
        description: "Variant name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newVariant: ComponentVariant = {
      id: variant.id || `${componentType}-variant-${Date.now()}`,
      name: variant.name,
      description: variant.description || '',
      defaultData: variant.defaultData || {},
      styles: variant.styles || undefined
    };
    
    setVariants(prev => [...prev, newVariant]);
    setSelectedVariantId(newVariant.id);
    
    toast({
      title: "Variant Created",
      description: `New variant "${newVariant.name}" has been created.`
    });
  }, [componentType, toast]);
  
  const updateVariant = useCallback((id: string, updates: Partial<ComponentVariant>) => {
    setVariants(prev => prev.map(variant => 
      variant.id === id ? { ...variant, ...updates } : variant
    ));
    
    toast({
      title: "Variant Updated",
      description: `Variant has been updated.`
    });
  }, [toast]);
  
  const deleteVariant = useCallback((id: string) => {
    setVariants(prev => prev.filter(variant => variant.id !== id));
    
    if (selectedVariantId === id) {
      setSelectedVariantId(prev => {
        const remaining = variants.filter(v => v.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    }
    
    toast({
      title: "Variant Deleted",
      description: `Variant has been removed.`
    });
  }, [selectedVariantId, variants, toast]);
  
  // Rule Management
  const createRule = useCallback((rule: ConditionalRule) => {
    if (!rule.name || rule.conditions.length === 0) {
      toast({
        title: "Error",
        description: "Rule name and at least one condition are required",
        variant: "destructive"
      });
      return;
    }
    
    setRules(prev => [...prev, rule]);
    
    toast({
      title: "Rule Created",
      description: `New rule "${rule.name}" has been created.`
    });
  }, [toast]);
  
  const updateRule = useCallback((id: string, updates: Partial<ConditionalRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
    
    toast({
      title: "Rule Updated",
      description: `Rule has been updated.`
    });
  }, [toast]);
  
  const deleteRule = useCallback((id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
    
    toast({
      title: "Rule Deleted",
      description: `Rule has been removed.`
    });
  }, [toast]);
  
  const toggleRule = useCallback((id: string, enabled: boolean) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled } : rule
    ));
    
    toast({
      title: enabled ? "Rule Enabled" : "Rule Disabled",
      description: `Rule has been ${enabled ? 'enabled' : 'disabled'}.`
    });
  }, [toast]);
  
  // Evaluation of conditional logic
  const evaluateCondition = useCallback((
    condition: Condition, 
    componentData: Record<string, any>
  ): boolean => {
    const { property, operator, value } = condition;
    const componentValue = componentData[property];
    
    switch (operator) {
      case 'equals':
        return componentValue === value;
      case 'notEquals':
        return componentValue !== value;
      case 'contains':
        return String(componentValue).includes(String(value));
      case 'greaterThan':
        return Number(componentValue) > Number(value);
      case 'lessThan':
        return Number(componentValue) < Number(value);
      case 'isTrue':
        return Boolean(componentValue) === true;
      case 'isFalse':
        return Boolean(componentValue) === false;
      case 'isEmpty':
        return !componentValue || componentValue === '';
      case 'isNotEmpty':
        return !!componentValue && componentValue !== '';
      default:
        return false;
    }
  }, []);
  
  const evaluateRule = useCallback((
    rule: ConditionalRule, 
    componentData: Record<string, any>
  ): boolean => {
    if (!rule.enabled) return false;
    
    if (rule.conditions.length === 0) return true;
    
    if (rule.logic === 'and') {
      // All conditions must be true
      return rule.conditions.every(condition => 
        evaluateCondition(condition, componentData)
      );
    } else {
      // Any condition can be true
      return rule.conditions.some(condition => 
        evaluateCondition(condition, componentData)
      );
    }
  }, [evaluateCondition]);
  
  // Apply conditional rules to a component
  const applyConditionalRules = useCallback((
    component: WireframeComponent
  ): WireframeComponent => {
    if (!component || rules.length === 0) return component;
    
    // Create a copy of the component to apply modifications
    let modifiedComponent = { ...component };
    
    // Evaluate and apply each rule
    for (const rule of rules) {
      const ruleMatches = evaluateRule(rule, {
        ...modifiedComponent,
        ...modifiedComponent.props,
        ...modifiedComponent.data
      });
      
      if (ruleMatches) {
        switch (rule.effect.type) {
          case 'visibility':
            modifiedComponent.visible = rule.effect.action === 'show';
            break;
          case 'style':
            if (!modifiedComponent.style) modifiedComponent.style = {};
            
            if (rule.effect.action === 'addClass') {
              modifiedComponent.className = modifiedComponent.className 
                ? `${modifiedComponent.className} ${rule.effect.value}`
                : rule.effect.value;
            } else if (rule.effect.action === 'removeClass') {
              if (modifiedComponent.className) {
                modifiedComponent.className = modifiedComponent.className
                  .split(' ')
                  .filter(cls => cls !== rule.effect.value)
                  .join(' ');
              }
            } else if (rule.effect.action === 'setStyle' && rule.effect.value) {
              // Parse and apply CSS style (format: "property: value")
              const [prop, val] = rule.effect.value.split(':').map(s => s.trim());
              if (prop && val) {
                modifiedComponent.style[prop] = val;
              }
            }
            break;
          case 'behavior':
            if (rule.effect.action === 'disable') {
              modifiedComponent.props = {
                ...modifiedComponent.props,
                disabled: true
              };
            } else if (rule.effect.action === 'enable') {
              modifiedComponent.props = {
                ...modifiedComponent.props,
                disabled: false
              };
            }
            break;
        }
      }
    }
    
    return modifiedComponent;
  }, [rules, evaluateRule]);
  
  // Apply a selected variant to a component
  const applyVariantToComponent = useCallback((
    component: WireframeComponent,
    variantId: string | null
  ): WireframeComponent => {
    if (!component || !variantId) return component;
    
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return component;
    
    // Start with the component
    let variantedComponent = { ...component };
    
    // Apply variant's default data
    if (variant.defaultData) {
      variantedComponent = {
        ...variantedComponent,
        ...variant.defaultData,
        componentVariant: variant.id
      };
    }
    
    // Apply variant's styles if available
    if (variant.styles) {
      variantedComponent = {
        ...variantedComponent,
        style: {
          ...(variantedComponent.style || {}),
          ...(variant.styles.baseStyles || {})
        }
      };
    }
    
    return variantedComponent;
  }, [variants]);
  
  return {
    variants,
    rules,
    selectedVariantId,
    createVariant,
    updateVariant,
    deleteVariant,
    setSelectedVariantId,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    evaluateRule,
    applyConditionalRules,
    applyVariantToComponent
  };
}
