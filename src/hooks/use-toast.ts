
import { useState, useEffect, useRef } from "react";

export type ToastVariant = "default" | "destructive" | "success";

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description: React.ReactNode;
  action?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
};

type ToasterToast = Toast & {
  removed?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const TOAST_LIMIT = 3;
const TOAST_DURATION = 5000;

export const toastStore = {
  toasts: [] as ToasterToast[],
  listeners: [] as ((toasts: ToasterToast[]) => void)[],
  subscribe: function (listener: (toasts: ToasterToast[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  notify: function () {
    this.listeners.forEach(listener => listener(this.toasts));
  },
  add: function (toast: Toast) {
    const id = crypto.randomUUID();
    const newToast = { ...toast, id };
    this.toasts = [newToast, ...this.toasts].slice(0, TOAST_LIMIT);
    this.notify();
    return id;
  },
  remove: function (id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  },
  update: function (id: string, toast: Toast) {
    this.toasts = this.toasts.map(t => t.id === id ? { ...t, ...toast } : t);
    this.notify();
  },
};

export function toast(props: Omit<Toast, "id">) {
  const id = toastStore.add({
    ...props,
    id: "",
    duration: props.duration ?? TOAST_DURATION
  });
  return {
    id,
    dismiss: () => toastStore.remove(id),
    update: (props: Toast) => toastStore.update(id, props)
  };
}

toast.dismiss = (id?: string) => {
  if (id) {
    toastStore.remove(id);
  } else {
    toastStore.toasts.forEach(toast => {
      toastStore.remove(toast.id);
    });
  }
};

export function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>([...toastStore.toasts]);
  
  useEffect(() => {
    return toastStore.subscribe(setToasts);
  }, []);

  return {
    toasts,
    toast,
    dismiss: toast.dismiss
  };
}
