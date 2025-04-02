
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "../LoadingOverlay";
import { sendPDFToNotion } from "@/utils/pdf-export";
import { ArrowUpRight } from "lucide-react";

interface NotionExportDialogProps {
  pdfBlob: Blob | null;
  title: string;
  trigger?: React.ReactNode;
}

export function NotionExportDialog({ pdfBlob, title, trigger }: NotionExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState(title);
  const [description, setDescription] = useState("");
  const [pageUrl, setPageUrl] = useState<string | null>(null);

  const handleExport = async () => {
    if (!pdfBlob) return;
    
    setIsLoading(true);
    try {
      const response = await sendPDFToNotion(pdfBlob, pageTitle, description);
      if (response.success && response.url) {
        setPageUrl(response.url);
      } else {
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenInNotion = () => {
    if (pageUrl) {
      window.open(pageUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Export to Notion
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export to Notion</DialogTitle>
          <DialogDescription>
            Create a new Notion page with your PDF document attached.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="relative py-4">
            <LoadingOverlay message="Exporting to Notion..." />
          </div>
        ) : pageUrl ? (
          <div className="py-4 space-y-4">
            <div className="text-center">
              <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                Document successfully exported to Notion!
              </div>
              <Button onClick={handleOpenInNotion} className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Open in Notion
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="page-title">Page Title</Label>
              <Input
                id="page-title"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="Design Brief for Client"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this document..."
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {pageUrl ? (
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleExport} 
                disabled={isLoading || !pageTitle.trim() || !pdfBlob}
              >
                Export
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
