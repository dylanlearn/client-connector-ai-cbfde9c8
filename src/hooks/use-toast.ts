
import { type ToastProps, type ToastActionElement } from "@/components/ui/toast";
import { useToast as useToastOriginal } from "@radix-ui/react-toast";
import { toast as sonnerToast } from "sonner";

// Define the Toast type
type ToastType = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
} & Omit<ToastProps, "children">;

// Define the return type for useToast
interface UseToastReturnType {
  toast: (props: {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
    variant?: "default" | "destructive";
    duration?: number;
  }) => void;
  toasts: ToastType[];
  dismiss: (toastId?: string) => void;
}

export function useToast(): UseToastReturnType {
  // Store toasts in memory for rendering in the Toaster component
  const toastsRef = React.useRef<ToastType[]>([]);
  const [toasts, setToasts] = React.useState<ToastType[]>([]);

  const dismiss = React.useCallback((toastId?: string) => {
    setToasts((prevToasts) => {
      if (toastId) {
        toastsRef.current = prevToasts.filter((toast) => toast.id !== toastId);
        return [...toastsRef.current];
      }
      toastsRef.current = [];
      return [];
    });
  }, []);

  const toast = React.useCallback(
    (props: {
      title?: React.ReactNode;
      description?: React.ReactNode;
      action?: ToastActionElement;
      variant?: "default" | "destructive";
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = {
        id,
        title: props.title,
        description: props.description,
        action: props.action,
        variant: props.variant,
      };

      // Add toast to the state
      setToasts((prev) => {
        toastsRef.current = [...prev, newToast];
        return [...toastsRef.current];
      });

      // Auto-dismiss toast after the specified duration (default 5s)
      if (props.duration !== Infinity) {
        setTimeout(() => {
          dismiss(id);
        }, props.duration || 5000);
      }

      return id;
    },
    [dismiss]
  );

  return {
    toast,
    toasts,
    dismiss,
  };
}

// Export the sonner toast function for direct usage
export const toast = sonnerToast;

// Add imports
import React from "react";

