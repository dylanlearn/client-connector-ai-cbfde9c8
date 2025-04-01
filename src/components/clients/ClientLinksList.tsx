
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
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientLinksListProps {
  links: ClientAccessLink[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function ClientLinksList({ links, isLoading, onRefresh }: ClientLinksListProps) {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return <ClientLinksLoadingState />;
  }
  
  if (links.length === 0) {
    return <ClientLinksEmptyState />;
  }
  
  return (
    <div className="border rounded-lg overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead className="hidden sm:table-cell">Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Expires</TableHead>
            <TableHead className="hidden lg:table-cell">Last Access</TableHead>
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
