
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { DeviceType } from '../types';

interface DeviceSelectorProps {
  deviceType: DeviceType;
  onChange: (device: DeviceType) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ deviceType, onChange }) => {
  return (
    <TabsList>
      <TabsTrigger 
        value="desktop" 
        className="flex items-center gap-1"
        onClick={() => onChange('desktop')}
      >
        <Monitor className="h-4 w-4" />
        <span className="hidden sm:inline">Desktop</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="tablet" 
        className="flex items-center gap-1"
        onClick={() => onChange('tablet')}
      >
        <Tablet className="h-4 w-4" />
        <span className="hidden sm:inline">Tablet</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="mobile" 
        className="flex items-center gap-1"
        onClick={() => onChange('mobile')}
      >
        <Smartphone className="h-4 w-4" />
        <span className="hidden sm:inline">Mobile</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default DeviceSelector;
