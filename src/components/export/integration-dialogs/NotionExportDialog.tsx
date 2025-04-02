
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertMessage } from "@/components/ui/alert-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

interface NotionExportDialogProps {
  pdfBlob: Blob | null;
  title: string;
  trigger: React.ReactNode;
}

export function NotionExportDialog({ pdfBlob, title, trigger }: NotionExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExport = async () => {
    if (!pdfBlob) {
      setError("No PDF available to export. Please generate a PDF first.");
      return;
    }

    setIsExporting(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert the PDF blob to a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix
        const pdfBase64 = base64data.split(',')[1];
        
        // Call the Edge Function to export to Notion
        const response = await fetch('/api/export-to-notion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pdfBase64,
            title,
            description: description.trim() || `Design brief: ${title}`,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to export to Notion');
        }
        
        setSuccess("Successfully exported to Notion!");
        toast.success("Exported to Notion", {
          description: "Your document has been successfully added to your Notion database"
        });
        
        // Close dialog after a short delay
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read the PDF file');
      };
    } catch (err: any) {
      console.error("Error exporting to Notion:", err);
      setError(err.message || "Failed to export to Notion. Please try again.");
      toast.error("Export failed", {
        description: err.message || "Could not export to Notion. Please try again later."
      });
    } finally {
      setIsExporting(false);
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    setError(null);
    setSuccess(null);
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export to Notion</DialogTitle>
          <DialogDescription>
            Add this document to your Notion workspace with optional description.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {error && (
            <AlertMessage type="error" title="Export Failed">
              {error}
            </AlertMessage>
          )}
          
          {success && (
            <AlertMessage type="success" title="Export Successful">
              {success}
            </AlertMessage>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input id="title" value={title} readOnly />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Add a description for this document in Notion..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || !pdfBlob}>
            {isExporting ? (
              <>
                <LoadingSpinner className="mr-2" />
                Exporting...
              </>
            ) : "Export to Notion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
