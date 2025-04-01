
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createClientAccessLink } from "@/utils/client-service";

const ShareAnalyticsLink = () => {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleGenerateLink = async () => {
    if (!user) {
      toast.error("You must be logged in to generate a share link");
      return;
    }

    setIsDialogOpen(true);
  };

  const handleCreateClientLink = async () => {
    if (!user || !clientName.trim() || !clientEmail.trim()) {
      toast.error("Please enter both client name and email");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createClientAccessLink(user.id, clientEmail, clientName);
      if (result && result.link) {
        setShareLink(result.link);
        setLinkId(result.linkId);
        setIsDialogOpen(false);
        toast.success("Client hub link generated! It will expire in 7 days.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-2">
      {!shareLink ? (
        <Button 
          onClick={handleGenerateLink}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create client portal link
        </Button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            value={shareLink} 
            readOnly 
            className="flex-1"
            placeholder="Share link..."
          />
          <Button 
            onClick={copyToClipboard}
            variant={copied ? "success" : "secondary"}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        This link gives your client access to the client hub for 7 days to complete tasks and view their design journey.
      </p>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Client Portal Link</DialogTitle>
            <DialogDescription>
              Enter your client's details to generate a personalized access link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-name" className="text-right">
                Name
              </Label>
              <Input
                id="client-name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="col-span-3"
                placeholder="Client Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-email" className="text-right">
                Email
              </Label>
              <Input
                id="client-email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="col-span-3"
                placeholder="client@example.com"
                type="email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateClientLink} 
              disabled={isCreating || !clientName.trim() || !clientEmail.trim()}
            >
              {isCreating ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShareAnalyticsLink;
