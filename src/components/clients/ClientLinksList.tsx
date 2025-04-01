
import { ClientAccessLink } from "@/utils/client-service";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import ClientLinkRow from "./ClientLinkRow";
import ClientLinksEmptyState from "./ClientLinksEmptyState";
import ClientLinksLoadingState from "./ClientLinksLoadingState";

interface ClientLinksListProps {
  links: ClientAccessLink[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function ClientLinksList({ links, isLoading, onRefresh }: ClientLinksListProps) {
  if (isLoading) {
    return <ClientLinksLoadingState />;
  }
  
  if (links.length === 0) {
    return <ClientLinksEmptyState />;
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Last Access</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <ClientLinkRow 
              key={link.id} 
              link={link} 
              onRefresh={onRefresh}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
