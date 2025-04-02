
import { useState, useEffect } from 'react';

export interface DeviceInfo {
  width: number;
  height: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

/**
 * Hook for detecting device type and screen dimensions
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    width: 0,
    height: 0,
    deviceType: 'desktop'
  });
  
  // Detect device info on mount and when window is resized
  useEffect(() => {
    const getDeviceType = (): DeviceInfo => {
      const width = window.innerWidth;
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      
      if (width < 768) {
        deviceType = 'mobile';
      } else if (width < 1024) {
        deviceType = 'tablet';
      }
      
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        deviceType
      };
    };
    
    setDeviceInfo(getDeviceType());
    
    // Update on resize
    const handleResize = () => {
      setDeviceInfo(getDeviceType());
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceInfo;
};
