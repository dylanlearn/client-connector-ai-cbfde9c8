
import React from 'react';
import { cn } from '@/lib/utils';

interface HelpTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted' | 'highlight';
}

export const HelpText: React.FC<HelpTextProps> = ({ 
  children, 
  className,
  variant = 'default' 
}) => {
  return (
    <p className={cn(
      "text-sm",
      variant === 'default' && "text-muted-foreground",
      variant === 'muted' && "text-muted-foreground/70",
      variant === 'highlight' && "text-primary font-medium",
      className
    )}>
      {children}
    </p>
  );
};
