
import { Button } from "@/components/ui/button";
import { useUserManagement } from "./user-management/useUserManagement";
import { UsersTable } from "./user-management/UsersTable";
import { LoadingState } from "./user-management/LoadingState";

export function UserManagement() {
  const {
    users,
    isLoading,
    isUpdating,
    fetchUsers,
    updateUserRole,
    formatDate,
    getRoleBadgeVariant
  } = useUserManagement();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User Management</h2>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <UsersTable 
        users={users}
        isUpdating={isUpdating}
        onUpdateRole={updateUserRole}
        formatDate={formatDate}
        getRoleBadgeVariant={getRoleBadgeVariant}
      />
    </div>
  );
}
