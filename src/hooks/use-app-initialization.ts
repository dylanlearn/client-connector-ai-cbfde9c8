
import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";

interface AppInitializationState {
  isInitializing: boolean;
  isInitialized: boolean;
  error: Error | null;
}

/**
 * Hook for handling application initialization logic
 * Centralizes loading states and initialization sequence
 */
export function useAppInitialization(): AppInitializationState {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [state, setState] = useState<AppInitializationState>({
    isInitializing: true,
    isInitialized: false,
    error: null
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for auth to be determined
        if (isAuthLoading) return;
        
        // Here you can add additional initialization steps as needed
        // For example, loading app configuration, checking permissions, etc.
        
        // App is now initialized
        setState({
          isInitializing: false,
          isInitialized: true,
          error: null
        });
      } catch (error) {
        console.error("Error initializing app:", error);
        setState({
          isInitializing: false,
          isInitialized: false,
          error: error instanceof Error ? error : new Error("Failed to initialize app")
        });
      }
    };

    initializeApp();
  }, [isAuthLoading]);

  return state;
}
