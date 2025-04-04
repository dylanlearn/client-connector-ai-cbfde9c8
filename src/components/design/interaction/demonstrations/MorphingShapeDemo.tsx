
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MorphingShapeConfig } from "../interactionConfigs";
import { Shapes } from "lucide-react";
import { useAnimationAnalytics } from "@/hooks/use-animation-analytics";
import { useAnimationPreferences } from "@/hooks/use-animation-preferences";

interface MorphingShapeDemoProps {
  interactionConfig: MorphingShapeConfig;
  isActive: boolean;
}

const MorphingShapeDemo = ({ interactionConfig, isActive }: MorphingShapeDemoProps) => {
  const { trackAnimation, startAnimationTracking, completeAnimationTracking } = useAnimationAnalytics();
  const { getPreference } = useAnimationPreferences();
  const trackingRef = useRef<{ startTime: number; fps: number[] } | null>(null);
  
  // Get animation preferences
  const pref = getPreference('morphing_shape');
  // Check if enabled directly from the preference object
  const enabled = pref?.enabled !== false;
  const intensity = pref?.intensityPreference || 5;
  const speed = pref?.speedPreference || 'normal';
  
  // Calculate duration based on speed preference
  const getDuration = () => {
    const baseDuration = 4; // base duration in seconds
    switch (speed) {
      case 'slow': return baseDuration * 1.5;
      case 'fast': return baseDuration * 0.7;
      default: return baseDuration;
    }
  };
  
  // Calculate morphing intensity
  const getMorphingIntensity = () => {
    // Map intensity 1-10 to animation range (more extreme at higher values)
    const normalizedIntensity = intensity / 10;
    return {
      borderRadius: {
        min: 10 - (normalizedIntensity * 10), // More angular at higher intensities
        max: 30 + (normalizedIntensity * 40)  // More rounded at higher intensities
      },
      scale: {
        hover: 1 + (normalizedIntensity * 0.1)
      }
    };
  };
  
  const morphingIntensity = getMorphingIntensity();
  const duration = getDuration();

  // Track animation analytics
  useEffect(() => {
    if (isActive && enabled) {
      // Start tracking
      trackingRef.current = startAnimationTracking();
      
      // Record initial view
      trackAnimation('morphing_shape');
    }
    
    return () => {
      if (trackingRef.current) {
        // Complete tracking if component unmounts while animation is active
        completeAnimationTracking('morphing_shape', trackingRef.current);
        trackingRef.current = null;
      }
    };
  }, [isActive, enabled, trackAnimation, startAnimationTracking, completeAnimationTracking]);
  
  // Complete tracking when animation stops
  useEffect(() => {
    if (!isActive && trackingRef.current) {
      completeAnimationTracking('morphing_shape', trackingRef.current);
      trackingRef.current = null;
    }
  }, [isActive, completeAnimationTracking]);

  // Apply animation configuration with preferences
  const getAnimationConfig = () => {
    if (!enabled) {
      return interactionConfig.initial;
    }
    
    if (isActive) {
      // Apply custom animations based on user preferences
      return {
        borderRadius: [
          "30%", 
          `${morphingIntensity.borderRadius.max}%`, 
          `${morphingIntensity.borderRadius.min}%`, 
          "70%", 
          "30%"
        ],
        transition: { 
          duration: duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse" as const
        }
      };
    }
    
    return interactionConfig.initial;
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 opacity-5">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border border-gray-400 rounded"></div>
        ))}
      </div>
      
      <div className="z-10 flex flex-col items-center gap-8">
        {/* Primary morphing shape */}
        <motion.div 
          className="w-28 h-28 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg flex items-center justify-center"
          initial={interactionConfig.initial}
          animate={getAnimationConfig()}
          style={{ borderRadius: "30%" }}
          whileHover={{ scale: morphingIntensity.scale.hover }}
        >
          <Shapes className="text-white h-12 w-12" />
        </motion.div>
        
        {/* Secondary morphing elements */}
        {isActive && enabled && (
          <div className="flex gap-8">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500"
              initial={{ borderRadius: "10%" }}
              animate={{
                borderRadius: ["10%", "50%", "30%", "10%"],
                transition: { duration: duration, repeat: Infinity, repeatType: "reverse" }
              }}
            />
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500"
              initial={{ borderRadius: "50%" }}
              animate={{
                borderRadius: ["50%", "10%", "70% 30% 30% 70% / 60% 40% 60% 40%", "50%"],
                transition: { duration: duration, repeat: Infinity, repeatType: "reverse", delay: 0.5 }
              }}
            />
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500"
              initial={{ borderRadius: "30%" }}
              animate={{
                borderRadius: ["30%", "70% 30% 30% 70% / 60% 40% 60% 40%", "50%", "30%"],
                transition: { duration: duration, repeat: Infinity, repeatType: "reverse", delay: 1 }
              }}
            />
          </div>
        )}
      </div>
      
      {/* Help text for initial state */}
      {!isActive && (
        <motion.div
          className="absolute bottom-4 text-xs text-gray-500 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click "Demonstrate" to see shape morphing transitions
        </motion.div>
      )}
      
      {/* Reduced motion notice */}
      {!enabled && isActive && (
        <motion.div
          className="absolute bottom-4 text-xs text-gray-500 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Animations disabled due to reduced motion preferences
        </motion.div>
      )}
    </div>
  );
};

export default MorphingShapeDemo;
