
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">DezignSync</h1>
        <p className="text-center text-muted-foreground">Your AI-powered design assistant</p>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};
