
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { exportWireframeAsHTML, exportWireframeAsPDF, exportWireframeAsImage } from '@/utils/wireframe/export-utils';
import { saveAs } from 'file-saver';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Loader2 } from 'lucide-react';

interface WireframeExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  wireframe: WireframeData;
  containerRef?: React.RefObject<HTMLElement>;
  // Add compatibility props for other components using this dialog
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  isOpen,
  onClose,
  wireframe,
  containerRef,
  open,
  onOpenChange
}) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const dialogContainerRef = useRef<HTMLDivElement>(null);
  
  // For compatibility with components that use open/onOpenChange instead of isOpen/onClose
  const isDialogOpen = open !== undefined ? open : isOpen;
  const handleDialogChange = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else if (!value && onClose) {
      onClose();
    }
  };

  const handleExportHTML = async () => {
    try {
      setIsExporting('html');
      const html = await exportWireframeAsHTML(wireframe);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      saveAs(blob, `${wireframe.title || 'wireframe'}.html`);
    } catch (error) {
      console.error('Error exporting HTML:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPDF = async () => {
    try {
      // Use either provided containerRef or dialogContainerRef as fallback
      const elementRef = containerRef?.current || dialogContainerRef.current;
      if (!elementRef) {
        console.error('Container reference not available');
        return;
      }
      setIsExporting('pdf');
      const blob = await exportWireframeAsPDF(elementRef, wireframe);
      saveAs(blob, `${wireframe.title || 'wireframe'}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportImage = async () => {
    try {
      // Use either provided containerRef or dialogContainerRef as fallback
      const elementRef = containerRef?.current || dialogContainerRef.current;
      if (!elementRef) {
        console.error('Container reference not available');
        return;
      }
      setIsExporting('image');
      const blob = await exportWireframeAsImage(elementRef, wireframe);
      saveAs(blob, `${wireframe.title || 'wireframe'}.png`);
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md" ref={dialogContainerRef}>
        <DialogHeader>
          <DialogTitle>Export Wireframe</DialogTitle>
          <DialogDescription>
            Choose a format to export your wireframe design
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button 
            onClick={handleExportHTML} 
            disabled={!!isExporting}
          >
            {isExporting === 'html' ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting HTML</>
            ) : 'Export as HTML'}
          </Button>
          
          <Button 
            onClick={handleExportPDF} 
            disabled={!!isExporting}
          >
            {isExporting === 'pdf' ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting PDF</>
            ) : 'Export as PDF'}
          </Button>
          
          <Button 
            onClick={handleExportImage} 
            disabled={!!isExporting}
          >
            {isExporting === 'image' ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting Image</>
            ) : 'Export as Image'}
          </Button>
        </div>
        
        <Button variant="outline" onClick={() => handleDialogChange(false)}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
