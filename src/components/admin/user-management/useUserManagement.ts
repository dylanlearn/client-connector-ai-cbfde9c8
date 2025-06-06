
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User, UserRole } from "../types/user-types";

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    
    // Set up realtime subscriptions for profile changes
    const channel = supabase.channel('public:profiles')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('Profile update detected:', payload);
          
          // Refresh the user list to get the latest data
          fetchUsers();
          
          // Show toast notification for updates
          if (payload.eventType === 'UPDATE') {
            const userName = (payload.new as any).name || 'User';
            toast({
              title: "User Updated",
              description: `${userName}'s profile has been updated.`,
            });
          }
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-api", {
        body: { action: "list_users" },
      });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    setIsUpdating(userId);
    try {
      console.log(`Updating user ${userId} to role ${role}`);
      const { data, error } = await supabase.functions.invoke("admin-api", {
        body: { 
          action: "update_user_role",
          userId,
          role
        },
      });

      if (error) {
        console.error("Role update error:", error);
        throw error;
      }

      // Update the user in the local state with the exact same mapping logic as the backend
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            // Map subscription status based on role - keeping in sync with backend logic
            let subscription_status = role;
            if (role === 'admin') {
              subscription_status = 'sync-pro';
            } else if (role === 'template-buyer') {
              subscription_status = 'free';
            }
            // 'trial' maps directly to 'trial'
            // 'sync' maps directly to 'sync'
            // 'sync-pro' maps directly to 'sync-pro'
            
            return { 
              ...user, 
              role,
              subscription_status
            };
          }
          return user;
        })
      );

      toast({
        title: "Success",
        description: `User role updated to ${role}`,
      });
    } catch (error: any) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "sync-pro":
        return "default";
      case "sync":
        return "secondary";
      case "trial":
        return "outline";
      default:
        return "secondary";
    }
  };

  return {
    users,
    isLoading,
    isUpdating,
    fetchUsers,
    updateUserRole,
    formatDate,
    getRoleBadgeVariant
  };
}
