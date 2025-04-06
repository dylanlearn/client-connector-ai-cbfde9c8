
import { UnifiedObservability, ServiceName, Severity } from "./unified-observability";

/**
 * Performance monitoring decorator for class methods
 * @param serviceName The name of the service to track
 * @param options Additional tracking options
 */
export function trackPerformance(
  serviceName: ServiceName,
  options: {
    showToast?: boolean;
    logLevel?: Severity;
    reportErrors?: boolean;
  } = {}
) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const trackingId = UnifiedObservability.startPerformanceTracking(
        serviceName,
        propertyKey,
        { args: args.map(arg => typeof arg === 'object' ? '(object)' : arg) }
      );
      
      try {
        const result = await originalMethod.apply(this, args);
        await UnifiedObservability.endPerformanceTracking(trackingId, true, {
          success: true,
          hasResult: result !== undefined
        });
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        await UnifiedObservability.endPerformanceTracking(trackingId, false, {
          success: false,
          error: errorMessage
        });
        
        if (options.reportErrors !== false) {
          await UnifiedObservability.logEvent(
            serviceName,
            propertyKey,
            options.logLevel || Severity.ERROR,
            `Error in ${propertyKey}: ${errorMessage}`,
            { error: errorMessage },
            undefined,
            undefined
          );
        }
        
        throw error;
      }
    };
    
    return descriptor;
  };
}

/**
 * Create a high-precision performance measurement utility
 */
export function createPerformanceMeasurer(category: string) {
  return {
    /**
     * Start measuring performance
     * @param name Measurement name
     */
    start: (name: string): void => {
      const fullName = `${category}:${name}`;
      performance.mark(`${fullName}:start`);
    },
    
    /**
     * End measuring performance and log the result
     * @param name Measurement name
     */
    end: (name: string): number => {
      const fullName = `${category}:${name}`;
      performance.mark(`${fullName}:end`);
      
      try {
        const measure = performance.measure(
          fullName,
          `${fullName}:start`,
          `${fullName}:end`
        );
        
        console.log(`📊 Performance [${category}] ${name}: ${measure.duration.toFixed(2)}ms`);
        return measure.duration;
      } catch (error) {
        console.warn(`Failed to measure ${fullName}:`, error);
        return 0;
      }
    }
  };
}
