
import { useState, useEffect } from "react";
import { ClientTaskProgress } from "@/types/client";
import { getClientTasksProgress } from "@/utils/client-service";
import { toast } from "sonner";

/**
 * Hook for managing and fetching client task progress
 * @param linkId Optional link ID to filter progress by specific client
 * @returns Client task progress data and loading state
 */
export function useClientTaskProgress(linkId?: string) {
  const [progress, setProgress] = useState<ClientTaskProgress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgress = async () => {
    if (!linkId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const progressData = await getClientTasksProgress(linkId);
      setProgress(progressData);
    } catch (err) {
      console.error("Error fetching client task progress:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch client progress"));
      toast.error("Failed to load client progress");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (linkId) {
      fetchProgress();
    }
  }, [linkId]);

  return {
    progress,
    isLoading,
    error,
    refreshProgress: fetchProgress
  };
}
