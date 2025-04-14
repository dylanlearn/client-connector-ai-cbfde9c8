
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type StatusType = 'operational' | 'degraded' | 'outage' | string;
type BadgeSize = 'sm' | 'md' | 'lg';

interface StatusBadgeProps {
  status: StatusType;
  size?: BadgeSize;
  className?: string;
}

export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  let badgeClass = '';
  let statusText = '';
  let icon = null;
  
  const sizeClasses = {
    sm: 'text-xs py-0 px-1.5',
    md: 'text-sm py-0.5 px-2',
    lg: 'text-base py-1 px-3'
  };
  
  switch (status) {
    case 'operational':
      badgeClass = 'bg-green-100 text-green-800 hover:bg-green-200';
      statusText = 'Operational';
      icon = <CheckCircle className={size === 'sm' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1'} />;
      break;
    case 'degraded':
      badgeClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      statusText = 'Degraded';
      icon = <AlertTriangle className={size === 'sm' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1'} />;
      break;
    case 'outage':
      badgeClass = 'bg-red-100 text-red-800 hover:bg-red-200';
      statusText = 'Outage';
      icon = <XCircle className={size === 'sm' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1'} />;
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      statusText = status.charAt(0).toUpperCase() + status.slice(1);
      break;
  }
  
  return (
    <Badge 
      variant="outline" 
      className={`flex items-center ${badgeClass} ${sizeClasses[size]} ${className}`}
    >
      {icon}
      {statusText}
    </Badge>
  );
}
