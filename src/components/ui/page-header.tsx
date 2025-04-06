
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  heading: string;
  description?: string;
  className?: string;
  descriptionClassName?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  heading, 
  description,
  className,
  descriptionClassName
}) => {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {description && (
        <p className={cn("text-muted-foreground mt-1", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
};
