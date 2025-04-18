
import { LucideIcon, LucideProps } from 'lucide-react';
import React from 'react';

export const DiffIcon: LucideIcon = React.forwardRef<SVGSVGElement, LucideProps>(
  function DiffIcon({ color = 'currentColor', size = 24, strokeWidth = 2, ...props }, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M12 3v14" />
        <path d="M5 10h14" />
        <path d="M5 21h14" />
      </svg>
    );
  }
);

DiffIcon.displayName = 'DiffIcon';
