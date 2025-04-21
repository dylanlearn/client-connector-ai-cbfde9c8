
import React from "react";

export interface StatusBadgeProps {
  status: "healthy" | "warning" | "critical" | "unknown";
  showText?: boolean;
  className?: string;
}

export function StatusBadge({ status, showText = false, className = "" }: StatusBadgeProps) {
  const getBadgeColor = () => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDotColor = () => {
    switch (status) {
      case "healthy":
        return "bg-green-600";
      case "warning":
        return "bg-yellow-600";
      case "critical":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "healthy":
        return "Healthy";
      case "warning":
        return "Warning";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeColor()} ${className}`}>
      <span className={`mr-1 h-1.5 w-1.5 rounded-full ${getDotColor()}`}></span>
      {showText && <span>{getStatusText()}</span>}
    </div>
  );
}
