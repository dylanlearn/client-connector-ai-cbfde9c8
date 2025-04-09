
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { WireframeComponent } from '@/hooks/useCanvasEngine';

interface WireframeContextValue {
  activeSelection: string[] | null;
  hoveredElement: string | null;
  zoomLevel: number;
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  components: WireframeComponent[];
  // Actions
  setActiveSelection: (ids: string[] | null) => void;
  setHoveredElement: (id: string | null) => void;
  setZoomLevel: (zoom: number) => void;
  setGridSize: (size: number) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setDeviceType: (type: 'desktop' | 'tablet' | 'mobile') => void;
  addComponent: (component: WireframeComponent) => void;
  updateComponent: (id: string, updates: Partial<WireframeComponent>) => void;
  removeComponent: (id: string) => void;
  groupComponents: (ids: string[], groupName: string) => void;
  ungroupComponents: (groupId: string) => void;
}

const WireframeContext = createContext<WireframeContextValue | undefined>(undefined);

export function WireframeProvider({ children, initialComponents = [] }: { 
  children: ReactNode;
  initialComponents?: WireframeComponent[];
}) {
  const [activeSelection, setActiveSelection] = useState<string[] | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [gridSize, setGridSize] = useState<number>(8);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [components, setComponents] = useState<WireframeComponent[]>(initialComponents);

  const toggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const toggleSnapToGrid = useCallback(() => {
    setSnapToGrid(prev => !prev);
  }, []);

  const addComponent = useCallback((component: WireframeComponent) => {
    setComponents(prev => [...prev, component]);
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<WireframeComponent>) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    );
  }, []);

  const removeComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
  }, []);

  const groupComponents = useCallback((ids: string[], groupName: string) => {
    if (ids.length < 2) return;
    
    setComponents(prev => {
      // Find all components to group
      const componentsToGroup = prev.filter(comp => ids.includes(comp.id));
      
      // Create group bounds
      let minX = Math.min(...componentsToGroup.map(c => c.position.x));
      let minY = Math.min(...componentsToGroup.map(c => c.position.y));
      let maxX = Math.max(...componentsToGroup.map(c => c.position.x + c.size.width));
      let maxY = Math.max(...componentsToGroup.map(c => c.position.y + c.size.height));
      
      // Create new group component
      const groupComponent: WireframeComponent = {
        id: `group-${Date.now()}`,
        type: 'group',
        position: { x: minX, y: minY },
        size: { width: maxX - minX, height: maxY - minY },
        zIndex: Math.max(...componentsToGroup.map(c => c.zIndex)) + 1,
        children: componentsToGroup.map(c => ({
          ...c,
          position: { 
            x: c.position.x - minX, 
            y: c.position.y - minY 
          }
        })),
        props: { name: groupName }
      };
      
      // Filter out grouped components and add the new group
      return [
        ...prev.filter(comp => !ids.includes(comp.id)),
        groupComponent
      ];
    });
  }, []);

  const ungroupComponents = useCallback((groupId: string) => {
    setComponents(prev => {
      // Find the group to ungroup
      const group = prev.find(comp => comp.id === groupId && comp.type === 'group');
      if (!group || !group.children) return prev;
      
      // Offset all children to their world position
      const ungroupedChildren = group.children.map(child => ({
        ...child,
        position: {
          x: group.position.x + child.position.x,
          y: group.position.y + child.position.y
        }
      }));
      
      // Return new array without group but with all children
      return [
        ...prev.filter(comp => comp.id !== groupId),
        ...ungroupedChildren
      ];
    });
  }, []);

  const value: WireframeContextValue = {
    activeSelection,
    hoveredElement,
    zoomLevel,
    gridSize,
    showGrid,
    snapToGrid,
    deviceType,
    components,
    setActiveSelection,
    setHoveredElement,
    setZoomLevel,
    setGridSize,
    toggleGrid,
    toggleSnapToGrid,
    setDeviceType,
    addComponent,
    updateComponent,
    removeComponent,
    groupComponents,
    ungroupComponents
  };

  return (
    <WireframeContext.Provider value={value}>
      {children}
    </WireframeContext.Provider>
  );
}

export function useWireframe() {
  const context = useContext(WireframeContext);
  if (context === undefined) {
    throw new Error('useWireframe must be used within a WireframeProvider');
  }
  return context;
}
