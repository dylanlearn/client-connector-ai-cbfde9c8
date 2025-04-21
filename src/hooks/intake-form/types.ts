
// Define the toast adapter interface to make toast integration more flexible
export interface ToastAdapter {
  toast: {
    (props: { title?: string; description: string; variant?: "default" | "destructive" | "success" }): void;
  };
}
