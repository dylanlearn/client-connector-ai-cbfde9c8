
import { ClientAccessLink } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Briefcase } from "lucide-react";
import ClientLinkActions from "./ClientLinkActions";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientLinkRowProps {
  link: ClientAccessLink;
  onRefresh: () => void;
}

export default function ClientLinkRow({ link, onRefresh }: ClientLinkRowProps) {
  const isMobile = useIsMobile();
  
  // Helper function to determine badge variant
  const getBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{link.clientName}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{link.clientEmail}</div>
          {link.clientPhone && (
            <div className="text-sm text-muted-foreground">{link.clientPhone}</div>
          )}
        </div>
      </TableCell>
      <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>
        {link.projectTitle ? (
          <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
            <Briefcase className="h-3 w-3" />
            {link.projectTitle}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">Not assigned</span>
        )}
      </TableCell>
      <TableCell>
        <Badge 
          variant={getBadgeVariant(link.status)}
          className="capitalize"
        >
          {link.status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDistanceToNow(new Date(link.createdAt || link.created_at), { addSuffix: true })}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDistanceToNow(new Date(link.expiresAt || link.expires_at), { addSuffix: true })}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {link.lastAccessedAt 
          ? formatDistanceToNow(new Date(link.lastAccessedAt), { addSuffix: true })
          : "Never"
        }
      </TableCell>
      <TableCell className="text-right">
        <ClientLinkActions
          linkId={link.id}
          token={link.token}
          designerId={link.designerId || ''}
          clientEmail={link.clientEmail || ''}
          clientPhone={link.clientPhone || ''}
          status={link.status as 'active' | 'expired' | 'completed'}
          onRefresh={onRefresh}
        />
      </TableCell>
    </TableRow>
  );
}
