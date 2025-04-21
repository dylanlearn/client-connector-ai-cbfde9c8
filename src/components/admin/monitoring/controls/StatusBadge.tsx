
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

  return (
    <div className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeColor()} ${className}`}>
      <span className={`mr-1 h-1.5 w-1.5 rounded-full ${status === "healthy" ? "bg-green-600" : status === "warning" ? "bg-yellow-600" : status === "critical" ? "bg-red-600" : "bg-gray-600"}`}></span>
      {showText && (
        <span>
          {status === "healthy"
            ? "Healthy"
            : status === "warning"
            ? "Warning"
            : status === "critical"
            ? "Critical"
            : "Unknown"}
        </span>
      )}
    </div>
  );
}
