
import React, { useEffect, useState } from 'react';
import { getAllComponentDefinitions } from './component-registry';
import { ComponentDefinition } from './component-registry';

interface WireframeComponentRegistryProps {
  onComponentSelect?: (componentType: string, variant?: string) => void;
  filter?: string;
  darkMode?: boolean;
}

const WireframeComponentRegistry: React.FC<WireframeComponentRegistryProps> = ({
  onComponentSelect,
  filter,
  darkMode = false
}) => {
  const [components, setComponents] = useState<ComponentDefinition[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Get all component definitions
    const definitions = getAllComponentDefinitions();
    
    // Filter components if a filter is provided
    const filteredComponents = filter 
      ? definitions.filter(def => 
          def.type.includes(filter) || 
          def.name.toLowerCase().includes(filter.toLowerCase()) || 
          def.category.includes(filter)
        )
      : definitions;
    
    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(filteredComponents.map(comp => comp.category))
    );
    
    setComponents(filteredComponents);
    setCategories(uniqueCategories);
  }, [filter]);

  return (
    <div className={`wireframe-component-registry ${darkMode ? 'dark' : ''}`}>
      {categories.map(category => (
        <div key={category} className="mb-6">
          <h3 className="font-medium text-lg mb-2 capitalize">
            {category.replace('-', ' ')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {components
              .filter(comp => comp.category === category)
              .map(component => (
                <div
                  key={component.type}
                  className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                  onClick={() => onComponentSelect?.(component.type, component.variants[0]?.id)}
                >
                  <div className="flex items-center">
                    {component.icon && (
                      <div className="mr-2 text-muted-foreground">
                        {/* Render icon if available */}
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{component.name}</h4>
                      {component.variants.length > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {component.variants.length} variants available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      
      {components.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No components found{filter ? ` matching "${filter}"` : ''}
        </div>
      )}
    </div>
  );
};

export default WireframeComponentRegistry;
