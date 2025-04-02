
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Application-wide providers wrapper component
 * Centralizes all context providers for better organization and testability
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      {children}
      <Toaster />
      <SonnerToaster position="top-right" />
    </AuthProvider>
  );
};
