
import { TableCell, TableRow } from "@/components/ui/table";

export function EmptyUsersList() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-8">
        No users found
      </TableCell>
    </TableRow>
  );
}
