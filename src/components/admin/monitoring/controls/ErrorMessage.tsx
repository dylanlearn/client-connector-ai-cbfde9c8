
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

export function ErrorMessage({ message, title = 'Error' }: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
