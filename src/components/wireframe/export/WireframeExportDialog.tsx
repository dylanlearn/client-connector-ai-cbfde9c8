
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  FileText, 
  Image as ImageIcon,
  FileCode,
  Download
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  exportWireframeAsHTML,
  exportWireframeAsPDF,
  exportWireframeAsImage
} from '@/utils/wireframe/export-utils';

interface WireframeExportDialogProps {
  wireframe: WireframeData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({ 
  wireframe, 
  open, 
  onOpenChange 
}) => {
  const [activeTab, setActiveTab] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format: 'pdf' | 'png' | 'html') => {
    setIsExporting(true);
    
    try {
      const element = document.getElementById('wireframe-canvas');
      
      switch(format) {
        case 'pdf':
          await exportWireframeAsPDF(element, wireframe, {
            filename: wireframe.title || 'wireframe'
          });
          break;
        case 'png':
          await exportWireframeAsImage(element, wireframe, {
            filename: wireframe.title || 'wireframe'
          });
          break;
        case 'html':
          exportWireframeAsHTML(wireframe, {
            filename: wireframe.title || 'wireframe'
          });
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Wireframe</DialogTitle>
          <DialogDescription>
            Export your wireframe in various formats
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="png">PNG</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pdf" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export your wireframe as a PDF document that can be shared or printed.
              </p>
              <Button 
                onClick={() => handleExport('pdf')} 
                disabled={isExporting}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export as PDF'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="png" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export your wireframe as a PNG image.
              </p>
              <Button 
                onClick={() => handleExport('png')}
                disabled={isExporting}
                className="w-full"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export as PNG'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="html" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export your wireframe as an HTML file.
              </p>
              <Button 
                onClick={() => handleExport('html')}
                disabled={isExporting}
                className="w-full"
              >
                <FileCode className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export as HTML'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
