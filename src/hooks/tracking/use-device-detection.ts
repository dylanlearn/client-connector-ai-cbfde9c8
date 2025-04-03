
import { useEffect, useState } from "react";

export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browserName: string;
  osName: string;
  prefersReducedMotion: boolean;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceType: 'unknown',
    browserName: 'unknown',
    osName: 'unknown',
    prefersReducedMotion: false
  });

  useEffect(() => {
    const detectDevice = () => {
      // Detect device type
      const userAgent = navigator.userAgent;
      let deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown' = 'unknown';
      
      // Simple detection logic
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        deviceType = 'tablet';
      } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        deviceType = 'mobile';
      } else {
        deviceType = 'desktop';
      }

      // Detect browser
      let browserName = 'unknown';
      if (userAgent.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
      } else if (userAgent.indexOf('SamsungBrowser') > -1) {
        browserName = 'Samsung Browser';
      } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
        browserName = 'Opera';
      } else if (userAgent.indexOf('Edge') > -1) {
        browserName = 'Edge';
      } else if (userAgent.indexOf('Chrome') > -1) {
        browserName = 'Chrome';
      } else if (userAgent.indexOf('Safari') > -1) {
        browserName = 'Safari';
      }

      // Detect OS
      let osName = 'unknown';
      if (/Windows/.test(userAgent)) {
        osName = 'Windows';
      } else if (/Mac/.test(userAgent)) {
        osName = 'MacOS';
      } else if (/Linux/.test(userAgent)) {
        osName = 'Linux';
      } else if (/Android/.test(userAgent)) {
        osName = 'Android';
      } else if (/iOS|iPhone|iPad|iPod/.test(userAgent)) {
        osName = 'iOS';
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setDeviceInfo({
        deviceType,
        browserName,
        osName,
        prefersReducedMotion
      });
    };

    detectDevice();
  }, []);

  return deviceInfo;
}
