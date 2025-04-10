
// Fix the title property error in this file

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { exportWireframeAsPDF, exportWireframeAsImage, exportWireframeAsHTML } from '@/utils/wireframe/export-utils';
import { Download, FileCode, FileImage, FilePdf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface WireframeExportDialogProps {
  wireframe: WireframeData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasElement?: HTMLCanvasElement;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  wireframe,
  open,
  onOpenChange,
  canvasElement
}) => {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<'pdf' | 'png' | 'svg' | 'html'>('pdf');
  const [includeStyles, setIncludeStyles] = useState<boolean>(true);
  const [includeInteractivity, setIncludeInteractivity] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>(wireframe?.title || 'wireframe-export');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      switch (exportFormat) {
        case 'pdf':
          await exportWireframeAsPDF(wireframe, { filename });
          break;
        case 'png':
        case 'svg':
          await exportWireframeAsImage(wireframe, { format: exportFormat, filename, canvasElement });
          break;
        case 'html':
          await exportWireframeAsHTML(wireframe, { filename, includeStyles, includeInteractivity });
          break;
      }
      
      toast({
        description: `Successfully exported wireframe as ${exportFormat.toUpperCase()}.`
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: `Failed to export as ${exportFormat.toUpperCase()}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Wireframe</DialogTitle>
          <DialogDescription>
            Export your wireframe in different formats for sharing or implementation.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="pdf" className="mt-4" onValueChange={(value) => setExportFormat(value as any)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="pdf" className="flex flex-col items-center gap-1 py-2">
              <FilePdf className="h-4 w-4" />
              <span className="text-xs">PDF</span>
            </TabsTrigger>
            <TabsTrigger value="png" className="flex flex-col items-center gap-1 py-2">
              <FileImage className="h-4 w-4" />
              <span className="text-xs">PNG</span>
            </TabsTrigger>
            <TabsTrigger value="svg" className="flex flex-col items-center gap-1 py-2">
              <FileImage className="h-4 w-4" />
              <span className="text-xs">SVG</span>
            </TabsTrigger>
            <TabsTrigger value="html" className="flex flex-col items-center gap-1 py-2">
              <FileCode className="h-4 w-4" />
              <span className="text-xs">HTML</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="html">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>HTML Export Options</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-styles"
                      checked={includeStyles}
                      onCheckedChange={(checked: boolean) => setIncludeStyles(checked)}
                    />
                    <label
                      htmlFor="include-styles"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include styles
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-interactivity" 
                      checked={includeInteractivity}
                      onCheckedChange={(checked: boolean) => setIncludeInteractivity(checked)}
                    />
                    <label
                      htmlFor="include-interactivity"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include interactive elements
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              "Exporting..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
