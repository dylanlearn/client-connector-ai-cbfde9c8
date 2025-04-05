
import * as React from "react";
import { cn } from "@/lib/utils";

interface GaugeProps {
  value: number;
  max: number;
  size?: number;
  color?: string;
  showValue?: boolean;
  animate?: boolean;
  className?: string;
}

export function Gauge({
  value,
  max,
  size = 120,
  color = "#22c55e", // Default green color
  showValue = false,
  animate = true,
  className,
}: GaugeProps) {
  const percentage = (value / max) * 100;
  const strokeWidth = size / 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Calculate arc path parameters
  const center = size / 2;
  
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-800"
        />
        {/* Foreground arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={animate ? "transition-all duration-1000 ease-out" : ""}
        />
      </svg>
      
      {/* Center text for value */}
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
