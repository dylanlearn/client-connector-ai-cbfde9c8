import { type ToastProps, type ToastActionElement } from "@/components/ui/toast";
import React from "react";
import { toast as sonnerToast } from "sonner";

// Add this export or ensure it exists
export type Toast = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  action?: React.ReactNode;
  duration?: number;
};

// Define the return type for useToast
export interface UseToastReturnType {
  toast: (props: {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
    variant?: "default" | "destructive";
    duration?: number;
  }) => string;
  toasts: Toast[];
  dismiss: (toastId?: string) => void;
}

export function useToast(): UseToastReturnType {
  // Store toasts in memory for rendering in the Toaster component
  const toastsRef = React.useRef<Toast[]>([]);
  const [toasts, setToasts] = React.useState<Toast[]>([]);

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
      const newToast: Toast = {
        id,
        title: props.title,
        description: props.description,
        action: props.action,
        variant: props.variant,
        duration: props.duration
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
