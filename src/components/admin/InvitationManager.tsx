
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2, Copy, Check, AlertTriangle } from "lucide-react";

export function InvitationManager() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [plan, setPlan] = useState<"basic" | "pro">("pro");
  const [discountPercentage, setDiscountPercentage] = useState<number>(100);
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [maxUses, setMaxUses] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-invitations", {
        body: { action: "list_invitations" },
      });

      if (error) {
        throw error;
      }

      setInvitations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvitation = async () => {
    setIsCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-invitations", {
        body: {
          action: "create_invitation",
          plan,
          discountPercentage,
          expiresInDays,
          maxUses,
          notes,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Invitation code created successfully",
      });

      // Reset form
      setPlan("pro");
      setDiscountPercentage(100);
      setExpiresInDays(30);
      setMaxUses(1);
      setNotes("");

      // Refresh the list
      fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create invitation code",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeInvitation = async (code: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-invitations", {
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

      // Refresh the list
      fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke invitation code",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Invitation Code</CardTitle>
          <CardDescription>
            Generate invitation codes for users to get free or discounted subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Plan</label>
              <Select value={plan} onValueChange={(value: any) => setPlan(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Discount %</label>
              <Select 
                value={discountPercentage.toString()} 
                onValueChange={(value) => setDiscountPercentage(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100% (Free)</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Expires In (Days)</label>
              <Input
                type="number"
                min="1"
                max="365"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(parseInt(e.target.value) || 30)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Max Uses</label>
              <Input
                type="number"
                min="1"
                max="1000"
                value={maxUses}
                onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Notes</label>
              <Textarea
                placeholder="Add optional notes about this invitation code"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateInvitation} disabled={isCreating} className="ml-auto">
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Generate Invitation Code
          </Button>
        </CardFooter>
      </Card>
      
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
                {invitations.map((invite) => {
                  const isExpired = new Date(invite.expires_at) < new Date();
                  const isFullyUsed = invite.uses >= invite.max_uses;
                  const isActive = !invite.is_revoked && !isExpired && !isFullyUsed;
                  
                  return (
                    <TableRow key={invite.id}>
                      <TableCell className="font-mono">
                        <div className="flex items-center gap-1">
                          {invite.code}
                          <button
                            onClick={() => copyToClipboard(invite.code)}
                            className="p-1 hover:bg-muted rounded"
                            title="Copy code"
                          >
                            {copiedCode === invite.code ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{invite.plan}</TableCell>
                      <TableCell>{invite.discount_percentage}%</TableCell>
                      <TableCell>
                        {invite.uses} / {invite.max_uses}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invite.expires_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {invite.is_revoked ? (
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
                            onClick={() => handleRevokeInvitation(invite.code)}
                          >
                            Revoke
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
