
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClientError } from "@/utils/monitoring/types";

interface ResolutionDialogProps {
  error: ClientError | null;
  onClose: () => void;
  onResolve: (notes: string) => void;
}

export function ResolutionDialog({ error, onClose, onResolve }: ResolutionDialogProps) {
  const [resolutionNotes, setResolutionNotes] = useState("");
  
  return (
    <Dialog open={!!error} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Error</DialogTitle>
          <DialogDescription>
            Add resolution notes and mark this error as resolved.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="space-y-4 my-4">
            <div>
              <h4 className="font-medium">Error Message:</h4>
              <p className="text-sm text-destructive">{error.error_message}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Component:</h4>
              <p className="text-sm">{error.component_name || 'Unknown'}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Resolution Notes:</h4>
              <Textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter your resolution notes here..."
                className="w-full mt-1"
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onResolve(resolutionNotes)}>
            Mark as Resolved
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
