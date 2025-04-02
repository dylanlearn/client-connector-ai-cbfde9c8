
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "../LoadingOverlay";
import { sendPDFToSlack } from "@/utils/pdf-export";
import { MessageSquare } from "lucide-react";

interface SlackExportDialogProps {
  pdfBlob: Blob | null;
  title: string;
  trigger?: React.ReactNode;
}

export function SlackExportDialog({ pdfBlob, title, trigger }: SlackExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState("");
  const [message, setMessage] = useState("");

  const handleExport = async () => {
    if (!pdfBlob) return;
    
    setIsLoading(true);
    try {
      const response = await sendPDFToSlack(pdfBlob, title, channel || undefined, message);
      if (response.success) {
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Share via Slack
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share via Slack</DialogTitle>
          <DialogDescription>
            Send your PDF document to a Slack channel or conversation.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <LoadingOverlay message="Sending to Slack..." />
        ) : (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel">
                Channel <span className="text-sm text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="#design-team"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to use the default channel configured in your workspace.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Here's the latest design brief..."
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isLoading || !pdfBlob}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
