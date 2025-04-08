
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
  value,
  max = 10,
  size = 100,
  showValue = true,
  onChange,
  disabled = false,
  className,
}: CreativityGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Determine color based on value
  const getColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage < 30) return "#22c55e"; // Low creativity - green
    if (percentage < 70) return "#eab308"; // Medium creativity - yellow
    return "#ef4444"; // High creativity - red
  };
  
  useEffect(() => {
    // Animate the gauge value for a smoother experience
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Gauge
        value={animatedValue}
        max={max}
        size={size}
        color={getColor(value, max)}
        showValue={showValue}
        className={disabled ? "opacity-50" : ""}
      />
      {onChange && !disabled && (
        <div className="mt-2 w-full">
          <input
            type="range"
            min="1"
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
