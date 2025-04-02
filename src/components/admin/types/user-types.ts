
// Define the user role types for the admin panel
export type UserRole = "free" | "sync" | "sync-pro" | "template-buyer" | "admin" | "trial";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  subscription_status: string;
  created_at: string;
}
