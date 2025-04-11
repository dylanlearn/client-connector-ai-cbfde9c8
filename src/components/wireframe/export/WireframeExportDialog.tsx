
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { exportWireframeAsHTML, exportWireframeAsPDF, exportWireframeAsImage } from '@/utils/wireframe/export-utils';
import { Download, FileCode, FileImage, FilePdf, Loader2 } from 'lucide-react';

export interface WireframeExportDialogProps {
  wireframe: WireframeData;
  // Support both naming conventions for compatibility
  isOpen?: boolean;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  wireframe,
  isOpen,
  onClose,
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState('html');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedCode, setExportedCode] = useState<string>('');
  
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
    } catch (error) {
      console.error('Error exporting as HTML:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Export as PDF handler - requires a DOM element to render
  const handleExportPDF = async () => {
    // Implementation would need a DOM element reference
    // This is a placeholder that would be connected to a real element
    alert('PDF export needs to be connected to a DOM element rendering the wireframe');
  };
  
  // Export as Image handler - requires a DOM element to render
  const handleExportImage = async () => {
    // Implementation would need a DOM element reference
    // This is a placeholder that would be connected to a real element
    alert('Image export needs to be connected to a DOM element rendering the wireframe');
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export Wireframe</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="html" className="flex gap-2 items-center">
              <FileCode className="h-4 w-4" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex gap-2 items-center">
              <FilePdf className="h-4 w-4" />
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
            <Button 
              onClick={handleExportHTML} 
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
                  Export as HTML
                </>
              )}
            </Button>
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
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
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
              <Download className="h-4 w-4 mr-2" />
              Export as Image
            </Button>
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
