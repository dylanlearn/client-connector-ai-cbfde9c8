
import { ClientAccessLink } from "@/utils/client-service";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Briefcase } from "lucide-react";
import ClientLinkActions from "./ClientLinkActions";

interface ClientLinkRowProps {
  link: ClientAccessLink;
  onRefresh: () => void;
}

export default function ClientLinkRow({ link, onRefresh }: ClientLinkRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{link.clientName}</div>
          <div className="text-sm text-muted-foreground">{link.clientEmail}</div>
          {link.clientPhone && (
            <div className="text-sm text-muted-foreground">{link.clientPhone}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {link.projectTitle ? (
          <Badge variant="outline" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {link.projectTitle}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">Not assigned</span>
        )}
      </TableCell>
      <TableCell>
        <Badge 
          variant={link.status === 'active' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {link.status}
        </Badge>
      </TableCell>
      <TableCell>
        {formatDistanceToNow(link.createdAt, { addSuffix: true })}
      </TableCell>
      <TableCell>
        {formatDistanceToNow(link.expiresAt, { addSuffix: true })}
      </TableCell>
      <TableCell>
        {link.lastAccessedAt 
          ? formatDistanceToNow(link.lastAccessedAt, { addSuffix: true })
          : "Never"
        }
      </TableCell>
      <TableCell className="text-right">
        <ClientLinkActions
          linkId={link.id}
          token={link.token}
          designerId={link.designerId}
          clientEmail={link.clientEmail}
          clientPhone={link.clientPhone}
          onRefresh={onRefresh}
        />
      </TableCell>
    </TableRow>
  );
}
