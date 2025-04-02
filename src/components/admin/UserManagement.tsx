
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define the type for role to include all available subscription types
type UserRole = "free" | "sync" | "sync-pro" | "template-buyer" | "admin" | "trial";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  subscription_status: string;
  created_at: string;
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-user-management", {
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
      const { data, error } = await supabase.functions.invoke("admin-user-management", {
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

      // Update the user in the local state
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            // Map subscription status based on role
            let subscription_status;
            switch (role) {
              case 'admin':
                subscription_status = 'sync-pro';
                break;
              case 'sync':
              case 'sync-pro':
              case 'trial':
                subscription_status = role;
                break;
              default:
                subscription_status = 'free';
            }
            
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User Management</h2>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name || "Unnamed User"}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.subscription_status}</Badge>
                  </TableCell>
                  <TableCell>
                    {isUpdating === user.id ? (
                      <Button disabled size="sm" variant="outline">
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Updating...
                      </Button>
                    ) : (
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="sync">Sync</SelectItem>
                          <SelectItem value="sync-pro">Sync Pro</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="template-buyer">Template Buyer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
