import { useToast as useToastOriginal } from "@/components/ui/use-toast";

type Toast = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export function useToast() {
  return useToastOriginal();
}

// For direct toast usage (like in non-component contexts)
export const toast = {
  // Function to show a toast notification
  success: (title: string, options?: Partial<Toast>) => {
    console.log(`Toast success: ${title}`);
    // This will be replaced by actual implementation in components
  },
  error: (title: string, options?: Partial<Toast>) => {
    console.log(`Toast error: ${title}`);
    // This will be replaced by actual implementation in components
  },
  info: (title: string, options?: Partial<Toast>) => {
    console.log(`Toast info: ${title}`);
    // This will be replaced by actual implementation in components
  },
  warning: (title: string, options?: Partial<Toast>) => {
    console.log(`Toast warning: ${title}`);
    // This will be replaced by actual implementation in components
  }
};
