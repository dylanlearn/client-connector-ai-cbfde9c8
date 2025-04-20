
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface FontCardProps {
  fontFamily: string;
  description?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  category?: 'serif' | 'sans-serif' | 'display' | 'monospace';
  onClick?: () => void;
  className?: string;
}

/**
 * FontCard - Displays and allows selection of a font
 */
export const FontCard: React.FC<FontCardProps> = ({
  fontFamily,
  description,
  isSelected = false,
  onSelect,
  category = 'sans-serif',
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all border overflow-hidden",
        isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50",
        className
      )} 
      onClick={handleClick}
    >
      <CardContent className="p-4 relative">
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary rounded-full p-0.5">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <h3 className="text-sm font-medium">{fontFamily}</h3>
            <span className="text-xs text-muted-foreground">{category}</span>
          </div>
          
          <div
            className="h-16 flex items-center"
            style={{
              fontFamily: `${fontFamily}, ${category}`,
            }}
          >
            <div className="space-y-1">
              <p className="text-xl">Aa Bb Cc 123</p>
              <p className="text-sm truncate">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>

          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
