
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Copy, Check } from "lucide-react";

interface InvitationRowProps {
  invitation: any;
  onRevokeInvitation: (code: string) => void;
}

export function InvitationRow({ invitation, onRevokeInvitation }: InvitationRowProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const isExpired = new Date(invitation.expires_at) < new Date();
  const isFullyUsed = invitation.uses >= invitation.max_uses;
  const isActive = !invitation.is_revoked && !isExpired && !isFullyUsed;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <TableRow key={invitation.id}>
      <TableCell className="font-mono">
        <div className="flex items-center gap-1">
          {invitation.code}
          <button
            onClick={() => copyToClipboard(invitation.code)}
            className="p-1 hover:bg-muted rounded"
            title="Copy code"
          >
            {copiedCode === invitation.code ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </TableCell>
      <TableCell className="capitalize">{invitation.plan}</TableCell>
      <TableCell>{invitation.discount_percentage}%</TableCell>
      <TableCell>
        {invitation.uses} / {invitation.max_uses}
      </TableCell>
      <TableCell>
        {format(new Date(invitation.expires_at), 'MMM d, yyyy')}
      </TableCell>
      <TableCell>
        {invitation.is_revoked ? (
          <Badge variant="destructive">Revoked</Badge>
        ) : isExpired ? (
          <Badge variant="outline">Expired</Badge>
        ) : isFullyUsed ? (
          <Badge variant="secondary">Used</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )}
      </TableCell>
      <TableCell>
        {isActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRevokeInvitation(invitation.code)}
          >
            Revoke
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
