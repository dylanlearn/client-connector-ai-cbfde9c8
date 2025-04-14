
import React from 'react';
import { Button } from '@/components/ui/button';
import { DeviceType } from '../types';

interface DeviceControlsProps {
  deviceType: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
}

const DeviceControls: React.FC<DeviceControlsProps> = ({ 
  deviceType, 
  onDeviceChange 
}) => {
  return (
    <div className="device-controls flex space-x-2">
      <Button
        size="sm"
        variant={deviceType === 'desktop' ? 'default' : 'outline'}
        onClick={() => onDeviceChange('desktop')}
      >
        Desktop
      </Button>
      <Button
        size="sm"
        variant={deviceType === 'tablet' ? 'default' : 'outline'}
        onClick={() => onDeviceChange('tablet')}
      >
        Tablet
      </Button>
      <Button
        size="sm"
        variant={deviceType === 'mobile' ? 'default' : 'outline'}
        onClick={() => onDeviceChange('mobile')}
      >
        Mobile
      </Button>
    </div>
  );
};

export default DeviceControls;
