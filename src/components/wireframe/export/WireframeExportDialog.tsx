
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { exportWireframeAsHTML, exportWireframeAsPDF, exportWireframeAsImage } from '@/utils/wireframe/export-utils';
import { Download, FileCode, FileImage, FileText, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export interface WireframeExportDialogProps {
  wireframe: WireframeData;
  // Support both naming conventions for compatibility
  isOpen?: boolean;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  wireframe,
  isOpen,
  onClose,
  open,
  onOpenChange,
  containerRef
}) => {
  const [activeTab, setActiveTab] = useState('html');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedCode, setExportedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // Create a fallback container ref if none is provided
  const localContainerRef = useRef<HTMLDivElement>(null);
  const effectiveContainerRef = containerRef || localContainerRef;
  
  // Determine the open state from either prop
  const dialogOpen = isOpen !== undefined ? isOpen : open;

  // Handle dialog close from either approach
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (onClose) onClose();
      if (onOpenChange) onOpenChange(false);
    }
  };
  
  // Export as HTML handler
  const handleExportHTML = async () => {
    setIsExporting(true);
    try {
      const html = await exportWireframeAsHTML(wireframe);
      setExportedCode(html);
      
      // Create downloadable file
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${wireframe.title || 'wireframe'}.html`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success("HTML exported successfully!");
    } catch (error) {
      console.error('Error exporting as HTML:', error);
      toast.error("Failed to export as HTML", { 
        description: error instanceof Error ? error.message : "Unknown error" 
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Copy HTML to clipboard
  const handleCopyHTML = async () => {
    if (!exportedCode) {
      try {
        const html = await exportWireframeAsHTML(wireframe);
        setExportedCode(html);
        await navigator.clipboard.writeText(html);
        setCopied(true);
        toast.success("HTML copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying HTML:', error);
        toast.error("Failed to copy HTML");
      }
    } else {
      try {
        await navigator.clipboard.writeText(exportedCode);
        setCopied(true);
        toast.success("HTML copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying HTML:', error);
        toast.error("Failed to copy HTML");
      }
    }
  };
  
  // Export as PDF handler
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      if (effectiveContainerRef.current) {
        // Pass the HTMLElement from the containerRef
        const pdfBlob = await exportWireframeAsPDF(effectiveContainerRef.current);
        
        // Create downloadable file from the returned blob
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${wireframe.title || 'wireframe'}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        
        toast.success("PDF exported successfully!");
      } else {
        throw new Error("No container element available for PDF export");
      }
    } catch (error) {
      console.error('Error exporting as PDF:', error);
      toast.error("Failed to export as PDF", { 
        description: error instanceof Error ? error.message : "No container element available" 
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Export as Image handler
  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      if (effectiveContainerRef.current) {
        // Pass the HTMLElement from the containerRef
        const imageBlob = await exportWireframeAsImage(effectiveContainerRef.current);
        
        // Create downloadable file from the returned blob
        const url = URL.createObjectURL(imageBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${wireframe.title || 'wireframe'}.png`;
        link.click();
        URL.revokeObjectURL(url);
        
        toast.success("Image exported successfully!");
      } else {
        throw new Error("No container element available for image export");
      }
    } catch (error) {
      console.error('Error exporting as image:', error);
      toast.error("Failed to export as image", { 
        description: error instanceof Error ? error.message : "No container element available" 
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export Wireframe</DialogTitle>
        </DialogHeader>
        
        {/* Create a hidden div for the fallback container ref if needed */}
        {!containerRef && (
          <div 
            ref={localContainerRef} 
            className="hidden" 
            dangerouslySetInnerHTML={{ __html: '<div>Fallback container for export</div>' }}
          />
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="html" className="flex gap-2 items-center">
              <FileCode className="h-4 w-4" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex gap-2 items-center">
              <FileText className="h-4 w-4" />
              PDF
            </TabsTrigger>
            <TabsTrigger value="image" className="flex gap-2 items-center">
              <FileImage className="h-4 w-4" />
              Image
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="html" className="space-y-4">
            <div className="text-sm">
              Export your wireframe as an HTML file that can be viewed in any browser.
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportHTML} 
                className="flex-1"
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export as HTML
                  </>
                )}
              </Button>
              <Button 
                onClick={handleCopyHTML} 
                variant="outline"
                disabled={isExporting}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="pdf" className="space-y-4">
            <div className="text-sm">
              Export your wireframe as a PDF document.
            </div>
            <Button 
              onClick={handleExportPDF} 
              className="w-full"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </>
              )}
            </Button>
            {!containerRef && (
              <p className="text-xs text-yellow-600">
                Note: To export as PDF, you need to provide a container reference to the dialog.
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <div className="text-sm">
              Export your wireframe as a PNG image.
            </div>
            <Button 
              onClick={handleExportImage} 
              className="w-full"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export as Image
                </>
              )}
            </Button>
            {!containerRef && (
              <p className="text-xs text-yellow-600">
                Note: To export as image, you need to provide a container reference to the dialog.
              </p>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
