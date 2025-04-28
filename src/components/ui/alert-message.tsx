
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertMessageProps {
  type: AlertType;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function AlertMessage({ type, title, children, className }: AlertMessageProps) {
  const getVariant = () => {
    switch (type) {
      case 'error': return 'destructive';
      case 'success': return 'default';
      case 'warning': return undefined; // uses default styling with warning icon
      case 'info': return undefined; // uses default styling with info icon
      default: return undefined;
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      default: return null;
    }
  };
  
  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'error': return 'Error';
      case 'success': return 'Success';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
      default: return '';
    }
  };
  
  return (
    <Alert variant={getVariant()} className={className}>
      {getIcon()}
      <AlertTitle>{getTitle()}</AlertTitle>
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  );
}
