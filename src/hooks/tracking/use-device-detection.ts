
import { useState, useEffect } from 'react';

export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop' | string;
  screenWidth: number;
  screenHeight: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  userAgent: string;
}

/**
 * Hook for detecting device type and screen dimensions
 */
export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceType: 'desktop',
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    userAgent: navigator.userAgent
  });

  useEffect(() => {
    // Function to detect device type
    const detectDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      // Check for mobile devices
      const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || width < 768;
      
      // Check for tablets
      const isTablet = /iPad/i.test(userAgent) || (width >= 768 && width < 1024);
      
      // Default to desktop for other cases
      const isDesktop = !isMobile && !isTablet;
      
      // Determine device type
      let deviceType = 'desktop';
      if (isMobile) deviceType = 'mobile';
      if (isTablet) deviceType = 'tablet';
      
      setDeviceInfo({
        deviceType,
        screenWidth: width,
        screenHeight: window.innerHeight,
        isMobile,
        isTablet,
        isDesktop,
        userAgent
      });
    };
    
    // Initial detection
    detectDevice();
    
    // Update on resize
    const handleResize = () => detectDevice();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceInfo;
};
