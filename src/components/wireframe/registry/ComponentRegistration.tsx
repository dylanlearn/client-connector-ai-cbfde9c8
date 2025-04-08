
import React, { useEffect, useState, createContext, useContext } from 'react';
import { registerComponent, getAllComponentDefinitions } from './component-registry';
import { defaultComponents } from './default-components';

interface ComponentRegistryContextType {
  isRegistered: boolean;
  components: any[];
}

const ComponentRegistryContext = createContext<ComponentRegistryContextType>({
  isRegistered: false,
  components: []
});

export const useComponentRegistry = () => useContext(ComponentRegistryContext);

export const ComponentRegistration: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    // Register all default components
    defaultComponents.forEach(component => {
      registerComponent(component);
    });
    
    // Get all registered components
    const registeredComponents = getAllComponentDefinitions();
    setComponents(registeredComponents);
    setIsRegistered(true);
    
    console.info(`Registered ${registeredComponents.length} component types`);
  }, []);

  return (
    <ComponentRegistryContext.Provider value={{ isRegistered, components }}>
      {/* This component doesn't render anything visible */}
    </ComponentRegistryContext.Provider>
  );
};

export default ComponentRegistration;
