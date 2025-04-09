
import React, { useEffect, useState } from 'react';
import { getAllComponentDefinitions } from './component-registry';
import { ComponentDefinition } from './component-types';
import { Badge } from '@/components/ui/badge';
import { 
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { getSectionIcon } from '../utils/sectionUtils';

interface WireframeComponentRegistryProps {
  onComponentSelect?: (componentType: string, variant?: string) => void;
  filter?: string;
  darkMode?: boolean;
  selectedCategory?: string;
}

const WireframeComponentRegistry: React.FC<WireframeComponentRegistryProps> = ({
  onComponentSelect,
  filter,
  darkMode = false,
  selectedCategory
}) => {
  const [components, setComponents] = useState<ComponentDefinition[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Get all component definitions
    const definitions = getAllComponentDefinitions();
    
    // Filter components if a filter or category is provided
    let filteredComponents = definitions;
    
    if (filter) {
      filteredComponents = filteredComponents.filter(def => 
        def.type.includes(filter) || 
        def.name.toLowerCase().includes(filter.toLowerCase()) || 
        def.category.includes(filter)
      );
    }
    
    if (selectedCategory) {
      filteredComponents = filteredComponents.filter(def => 
        def.category === selectedCategory
      );
    }
    
    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(filteredComponents.map(comp => comp.category))
    ).filter(category => typeof category === 'string') as string[];
    
    setComponents(filteredComponents);
    setCategories(uniqueCategories);
  }, [filter, selectedCategory]);

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
                <Card
                  key={component.type}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onComponentSelect?.(component.type, component.variants[0]?.id)}
                >
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {getSectionIcon(component.type)}
                        </span>
                        <h4 className="font-medium">{component.name}</h4>
                      </div>
                      {component.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {component.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  {component.variants.length > 0 && (
                    <CardFooter className="p-3 pt-2 flex flex-wrap gap-1">
                      {component.variants.map((variant, i) => (
                        <Badge key={variant.id} variant="outline" className="text-xs">
                          {variant.name}
                        </Badge>
                      )).slice(0, 3)}
                      {component.variants.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{component.variants.length - 3} more
                        </Badge>
                      )}
                    </CardFooter>
                  )}
                </Card>
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
