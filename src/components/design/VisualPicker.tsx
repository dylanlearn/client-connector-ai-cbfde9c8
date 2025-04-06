
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface DesignOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category?: string;
}

interface VisualPickerProps {
  options: DesignOption[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onSelectOption?: (option: any, liked: boolean) => void;
  category?: string;
  fullWidth?: boolean;
  className?: string;
}

export const VisualPicker: React.FC<VisualPickerProps> = ({
  options,
  selectedId,
  onSelect,
  onSelectOption,
  category,
  fullWidth = false,
  className,
}) => {
  const handleOptionSelect = (option: DesignOption) => {
    if (onSelect) {
      onSelect(option.id);
    }
    if (onSelectOption) {
      onSelectOption(option, true);
    }
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        fullWidth ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        
        return (
          <div
            key={option.id}
            className={cn(
              "relative overflow-hidden border rounded-lg transition-all cursor-pointer",
              isSelected
                ? "border-primary shadow-sm ring-2 ring-primary ring-opacity-50"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}
            onClick={() => handleOptionSelect(option)}
          >
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-sm">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            {/* Image preview */}
            <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              {option.imageUrl ? (
                <img
                  src={option.imageUrl}
                  alt={option.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            
            {/* Option details */}
            <div className="p-4">
              <h3 className="font-medium">{option.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {option.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
