
import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonAction?: () => void;
  icon?: LucideIcon;
  secondaryButton?: React.ReactNode;
}

const EmptyState = ({
  title,
  description,
  buttonText,
  buttonAction,
  icon: Icon,
  secondaryButton
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
      {Icon && (
        <div className="p-3 rounded-full bg-gray-100 mb-4">
          <Icon className="h-8 w-8 text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {buttonText && buttonAction && (
          <Button onClick={buttonAction}>{buttonText}</Button>
        )}
        {secondaryButton}
      </div>
    </div>
  );
};

export default EmptyState;
