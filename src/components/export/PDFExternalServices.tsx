
import { Button } from "@/components/ui/button";
import { ExternalLink, Clipboard } from "lucide-react";

interface PDFExternalServicesProps {
  handleDownload: () => void;
  pdfUrl: string | null;
  onCopyLink: () => void;
}

export function PDFExternalServices({ 
  handleDownload, 
  pdfUrl,
  onCopyLink
}: PDFExternalServicesProps) {
  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      <h4 className="text-sm font-medium">Use with other services</h4>
      <p className="text-xs text-muted-foreground">
        After downloading, you can manually upload this PDF to your favorite services:
      </p>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 flex-1"
          onClick={handleDownload}
        >
          <ExternalLink className="h-4 w-4" />
          Download for Notion
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 flex-1"
          onClick={handleDownload}
        >
          <ExternalLink className="h-4 w-4" />
          Download for Slack
        </Button>
      </div>
      {pdfUrl && (
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Or use this temporary link:</p>
          <div className="flex gap-2">
            <input 
              className="flex-1 text-xs p-2 border rounded-md bg-muted" 
              value={pdfUrl} 
              readOnly 
            />
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onCopyLink}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
