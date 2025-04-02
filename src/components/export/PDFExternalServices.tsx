
import { Button } from "@/components/ui/button";
import { ExternalLink, Clipboard, Notion } from "lucide-react";
import { NotionExportDialog } from "./integration-dialogs/NotionExportDialog";

interface PDFExternalServicesProps {
  handleDownload: () => void;
  pdfUrl: string | null;
  pdfBlob: Blob | null;
  filename: string;
  onCopyLink: () => void;
}

export function PDFExternalServices({ 
  handleDownload, 
  pdfUrl,
  pdfBlob,
  filename,
  onCopyLink
}: PDFExternalServicesProps) {
  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      <h4 className="text-sm font-medium">Use with other services</h4>
      <p className="text-xs text-muted-foreground">
        Export directly to external services or download for manual upload:
      </p>
      <div className="flex flex-wrap gap-2">
        <NotionExportDialog 
          pdfBlob={pdfBlob} 
          title={filename}
          trigger={
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 flex-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M4.91,19.09c-.5,0-.63-.17-.86-.7l-1.64-6.1c-.12-.43-.05-.84.43-.84h2.92c.47,0,.74.28.86.7l1.64,6.1c.12.43,0,.84-.48.84Z" />
                <path d="M13.88,18.63c-.71,0-.87-.45-1.24-1.47l-4.2-11.7c-.17-.47,0-.93.43-.93h3.07c.7,0,.87.22,1.16.93l4.2,11.7c.16.47,0,.93-.43,1.47Z" />
                <path d="M19.05,18.63c-.55,0-.71-.39-.93-1l-2.42-6.71c-.16-.54,0-1,.55-1h2.92c.55,0,.78.39.93,1l2.42,6.71c.16.54-.08,1-.63,1Z" />
              </svg>
              Export to Notion
            </Button>
          }
        />
        
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
