
import { toast as toastOriginal } from "sonner";
import { useToast as useToastOriginal } from "@/components/ui/use-toast";

// Use the shadcn/ui toast implementation for components
export function useToast() {
  return useToastOriginal();
}

// Export sonner toast functions for direct usage in non-component contexts
export const toast = toastOriginal;
