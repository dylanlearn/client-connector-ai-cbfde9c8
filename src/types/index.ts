
// Re-export all type definitions for centralized access
export * from './client';
export * from './design';
export * from './projects';
export * from './intake-form';

// Export analytics types with namespace to avoid ambiguity
import * as AnalyticsTypes from './analytics';
export { AnalyticsTypes };

// Export interactions types but avoid conflict with analytics types
import { 
  DeviceInfo,
  TrackingOptions
} from './interactions';

export {
  DeviceInfo,
  TrackingOptions
};
