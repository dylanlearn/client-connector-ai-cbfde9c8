
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { User, UserRole } from "../types/user-types";
import { UserRoleSelect } from "./UserRoleSelect";

interface UserRowProps {
  user: User;
  isUpdating: boolean;
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
  formatDate: (dateString: string) => string;
  getRoleBadgeVariant: (role: UserRole) => "destructive" | "default" | "secondary" | "outline";
}

export function UserRow({ 
  user, 
  isUpdating, 
  onUpdateRole, 
  formatDate, 
  getRoleBadgeVariant 
}: UserRowProps) {
  return (
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
        <UserRoleSelect 
          userId={user.id} 
          currentRole={user.role} 
          isUpdating={isUpdating === user.id} 
          onUpdateRole={onUpdateRole} 
        />
      </TableCell>
    </TableRow>
  );
}
