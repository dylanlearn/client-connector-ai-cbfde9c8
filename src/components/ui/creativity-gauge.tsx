
import React, { useEffect, useState } from "react";
import { Gauge } from "./gauge";
import { cn } from "@/lib/utils";

interface CreativityGaugeProps {
  value: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function CreativityGauge({
  value = 5, // Provide a default value to prevent NaN issues
  max = 10,
  size = 100,
  showValue = true,
  onChange,
  disabled = false,
  className,
}: CreativityGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(value);
  
  // Ensure value is always within bounds
  const safeValue = Math.min(Math.max(1, value), max);
  
  // Determine color based on value
  const getColor = (value: number, max: number) => {
    try {
      const percentage = (value / max) * 100;
      if (percentage < 30) return "#22c55e"; // Low creativity - green
      if (percentage < 70) return "#eab308"; // Medium creativity - yellow
      return "#ef4444"; // High creativity - red
    } catch (error) {
      console.error("Error calculating color:", error);
      return "#eab308"; // Default to yellow on error
    }
  };
  
  useEffect(() => {
    // Animate the gauge value for a smoother experience
    // Use a cleanup function to prevent memory leaks
    const timer = setTimeout(() => {
      setAnimatedValue(safeValue);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [safeValue]);

  // Handle errors in rendering
  try {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <Gauge
          value={animatedValue}
          max={max}
          size={size}
          color={getColor(safeValue, max)}
          showValue={showValue}
          className={disabled ? "opacity-50" : ""}
        />
        {onChange && !disabled && (
          <div className="mt-2 w-full">
            <input
              type="range"
              min="1"
              max={max}
              value={safeValue}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer"
            />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering CreativityGauge:", error);
    return <div>Error rendering gauge</div>;
  }
}
