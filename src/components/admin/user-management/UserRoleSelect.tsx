
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserRole } from "../types/user-types";

interface UserRoleSelectProps {
  userId: string;
  currentRole: UserRole;
  isUpdating: boolean;
  onUpdateRole: (userId: string, newRole: UserRole) => Promise<void>;
}

export function UserRoleSelect({ userId, currentRole, isUpdating, onUpdateRole }: UserRoleSelectProps) {
  const handleRoleChange = (value: string) => {
    onUpdateRole(userId, value as UserRole);
  };

  return (
    <>
      {isUpdating ? (
        <Button disabled size="sm" variant="outline">
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          Updating...
        </Button>
      ) : (
        <Select
          defaultValue={currentRole}
          onValueChange={handleRoleChange}
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
    </>
  );
}
