
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SystemStatusType = 'operational' | 'degraded' | 'outage' | 'maintenance' | 'unknown';
type StatusBadgeSize = 'sm' | 'md' | 'lg';

interface StatusBadgeProps {
  status: SystemStatusType;
  size?: StatusBadgeSize;
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'operational':
        return {
          label: 'Operational',
          icon: CheckCircle,
          variant: 'outline',
          className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800'
        };
      case 'degraded':
        return {
          label: 'Degraded',
          icon: AlertCircle,
          variant: 'outline',
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800'
        };
      case 'outage':
        return {
          label: 'Outage',
          icon: XCircle,
          variant: 'outline',
          className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800'
        };
      case 'maintenance':
        return {
          label: 'Maintenance',
          icon: AlertTriangle,
          variant: 'outline',
          className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800'
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertCircle,
          variant: 'outline',
          className: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-800'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs py-0 px-2 h-5',
    md: 'text-sm py-1 px-2.5',
    lg: 'text-base py-1.5 px-3'
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        config.className,
        sizeClasses[size],
        'flex items-center space-x-1 cursor-default',
        className
      )}
    >
      <IconComponent className={iconSizes[size]} />
      <span>{config.label}</span>
    </Badge>
  );
}
