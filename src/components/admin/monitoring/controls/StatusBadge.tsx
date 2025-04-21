
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

type StatusType = 'healthy' | 'warning' | 'critical' | 'unknown';

interface StatusBadgeProps {
  status: StatusType | string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, showText = true, size = 'md' }: StatusBadgeProps) {
  // Normalize status to one of the allowed types
  const normalizedStatus: StatusType = normalizeStatus(status);
  
  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case 'healthy':
        return {
          color: 'bg-green-100 text-green-800 hover:bg-green-200',
          icon: <CheckCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          text: 'Healthy'
        };
        
      case 'warning':
        return {
          color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
          icon: <AlertCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          text: 'Warning'
        };
        
      case 'critical':
        return {
          color: 'bg-red-100 text-red-800 hover:bg-red-200',
          icon: <XCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          text: 'Critical'
        };
        
      default:
        return {
          color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          icon: <HelpCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
          text: 'Unknown'
        };
    }
  };
  
  const { color, icon, text } = getStatusConfig();
  
  return (
    <Badge variant="outline" className={`${color} flex items-center gap-1 font-normal`}>
      {icon}
      {showText && <span>{text}</span>}
    </Badge>
  );
}

// Helper function to normalize status strings to the allowed StatusType values
function normalizeStatus(status: string | StatusType): StatusType {
  switch (status.toLowerCase()) {
    case 'healthy':
    case 'ok':
    case 'green':
    case 'active':
    case 'good':
      return 'healthy';
      
    case 'warning':
    case 'warn':
    case 'yellow':
    case 'degraded':
      return 'warning';
      
    case 'critical':
    case 'error':
    case 'red':
    case 'unhealthy':
    case 'fail':
    case 'failed':
      return 'critical';
      
    default:
      return 'unknown';
  }
}
