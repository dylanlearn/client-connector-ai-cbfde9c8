
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, UserRole } from "../types/user-types";
import { UsersList } from "./UsersList";

interface UsersTableProps {
  users: User[];
  isUpdating: string | null;
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
  formatDate: (dateString: string) => string;
  getRoleBadgeVariant: (role: UserRole) => "destructive" | "default" | "secondary" | "outline";
}

export function UsersTable({ 
  users, 
  isUpdating, 
  onUpdateRole, 
  formatDate, 
  getRoleBadgeVariant 
}: UsersTableProps) {
  return (
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
        <UsersList 
          users={users}
          isUpdating={isUpdating}
          onUpdateRole={onUpdateRole}
          formatDate={formatDate}
          getRoleBadgeVariant={getRoleBadgeVariant}
        />
      </Table>
    </div>
  );
}
