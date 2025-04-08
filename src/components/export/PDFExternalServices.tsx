
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Image as ImageIcon,
  FileText, 
  Share, 
  Copy, 
  ExternalLink
} from 'lucide-react';

interface PDFExternalServicesProps {
  handleDownload: () => void;
  pdfUrl: string | null;
  pdfBlob: Blob | null;
  filename: string;
  onCopyLink?: () => void;
}

export const PDFExternalServices = ({
  handleDownload,
  pdfUrl,
  pdfBlob,
  filename,
  onCopyLink
}: PDFExternalServicesProps) => {
  
  const handleShareToService = (service: string) => {
    if (!pdfBlob) {
      toast.error('PDF not ready yet');
      return;
    }
    
    toast.success(`PDF ready to share with ${service}`, {
      description: `Your PDF is ready to upload to ${service}`
    });
    
    // This would trigger the download and let user upload to their service
    handleDownload();
  };
  
  return (
    <div className="mt-6 space-y-4">
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-2">Share with external services</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start"
            onClick={() => handleShareToService('Notion')}
            disabled={!pdfBlob}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            <span>Notion</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start"
            onClick={() => handleShareToService('Slack')}
            disabled={!pdfBlob}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            <span>Slack</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start"
            onClick={() => handleShareToService('Figma')}
            disabled={!pdfBlob}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            <span>Figma</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start"
            onClick={() => handleShareToService('Drive')}
            disabled={!pdfBlob}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            <span>Google Drive</span>
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {pdfUrl && (
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={onCopyLink}
          >
            <Copy className="h-4 w-4 mr-2" />
            <span>Copy Link</span>
          </Button>
        )}
        
        {pdfBlob && (
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={handleDownload}
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Download</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PDFExternalServices;
