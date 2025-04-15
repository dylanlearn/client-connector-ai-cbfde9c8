
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { DeviceType, ViewMode } from '@/components/wireframe/types/studio-types';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

interface WireframeStudioContextProps {
  deviceType: DeviceType;
  viewMode: ViewMode;
  showAISuggestions: boolean;
  selectedSection: string | null;
  wireframeData: WireframeData;
  setDeviceType: (type: DeviceType) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleAISuggestions: () => void;
  setSelectedSection: (id: string | null) => void;
  updateWireframe: (wireframe: WireframeData) => void;
}

const WireframeStudioContext = createContext<WireframeStudioContextProps | undefined>(undefined);

export function WireframeStudioProvider({ 
  children,
  initialData
}: { 
  children: ReactNode;
  initialData: WireframeData;
}) {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [wireframeData, setWireframeData] = useState<WireframeData>(initialData);

  const toggleAISuggestions = () => setShowAISuggestions(prev => !prev);
  const updateWireframe = (wireframe: WireframeData) => setWireframeData(wireframe);

  return (
    <WireframeStudioContext.Provider value={{
      deviceType,
      viewMode,
      showAISuggestions,
      selectedSection,
      wireframeData,
      setDeviceType,
      setViewMode,
      toggleAISuggestions,
      setSelectedSection,
      updateWireframe
    }}>
      {children}
    </WireframeStudioContext.Provider>
  );
}

export const useWireframeStudio = () => {
  const context = useContext(WireframeStudioContext);
  if (!context) {
    throw new Error('useWireframeStudio must be used within a WireframeStudioProvider');
  }
  return context;
};
