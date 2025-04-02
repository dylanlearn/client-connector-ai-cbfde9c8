
import { TableBody } from "@/components/ui/table";
import { User, UserRole } from "../types/user-types";
import { UserRow } from "./UserRow";
import { EmptyUsersList } from "./EmptyUsersList";

interface UsersListProps {
  users: User[];
  isUpdating: string | null;
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
  formatDate: (dateString: string) => string;
  getRoleBadgeVariant: (role: UserRole) => "destructive" | "default" | "secondary" | "outline";
}

export function UsersList({ 
  users, 
  isUpdating, 
  onUpdateRole, 
  formatDate, 
  getRoleBadgeVariant 
}: UsersListProps) {
  return (
    <TableBody>
      {users.length === 0 ? (
        <EmptyUsersList />
      ) : (
        users.map((user) => (
          <UserRow 
            key={user.id}
            user={user} 
            isUpdating={isUpdating} 
            onUpdateRole={onUpdateRole}
            formatDate={formatDate}
            getRoleBadgeVariant={getRoleBadgeVariant}
          />
        ))
      )}
    </TableBody>
  );
}
