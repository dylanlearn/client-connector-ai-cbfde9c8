
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvitationRow } from "./InvitationRow";

interface InvitationsListProps {
  invitations: any[];
  isLoading: boolean;
  onRevokeSuccess: () => void;
}

export function InvitationsList({ 
  invitations, 
  isLoading, 
  onRevokeSuccess 
}: InvitationsListProps) {
  const { toast } = useToast();

  const handleRevokeInvitation = async (code: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-api", {
        body: {
          action: "revoke_invitation",
          code,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Invitation code revoked successfully",
      });

      // Notify parent to refresh the list
      onRevokeSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke invitation code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation Codes</CardTitle>
        <CardDescription>
          Manage all your generated invitation codes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No invitation codes generated yet
          </div>
        ) : (
          <Table>
            <TableCaption>List of all invitation codes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <InvitationRow 
                  key={invitation.id}
                  invitation={invitation} 
                  onRevokeInvitation={handleRevokeInvitation} 
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
