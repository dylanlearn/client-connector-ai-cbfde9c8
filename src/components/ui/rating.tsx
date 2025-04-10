
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

export function Rating({
  value,
  onChange,
  count = 5,
  size = 'md',
  readOnly = false,
  className
}: RatingProps) {
  const handleClick = (newValue: number) => {
    if (readOnly) return;
    onChange(newValue);
  };

  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(count)].map((_, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => handleClick(idx + 1)}
          className={cn(
            "rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            readOnly ? "cursor-default" : "cursor-pointer"
          )}
          disabled={readOnly}
        >
          <Star
            className={cn(
              sizeClass[size],
              idx < value
                ? "fill-primary text-primary"
                : "text-muted-foreground",
              "transition-colors"
            )}
          />
        </button>
      ))}
    </div>
  );
}
