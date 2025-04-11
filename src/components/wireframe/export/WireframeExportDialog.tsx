
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { exportWireframeAsHTML, exportWireframeAsPDF, exportWireframeAsImage } from '@/utils/wireframe/export-utils';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Download, FileText, Image, FilePdf } from 'lucide-react';

export interface WireframeExportDialogProps {
  wireframe: WireframeData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  wireframe,
  open,
  onOpenChange
}) => {
  const [exportFormat, setExportFormat] = useState<'html' | 'pdf' | 'image'>('html');
  const [filename, setFilename] = useState(wireframe.title || 'wireframe');
  const [quality, setQuality] = useState<string>('90');
  const [scale, setScale] = useState<string>('2');
  
  const handleExport = () => {
    const options = {
      filename,
      quality: parseInt(quality) / 100,
      scale: parseInt(scale)
    };

    // Get the wireframe element
    const wireframeElement = document.getElementById('wireframe-preview-container');
    
    switch (exportFormat) {
      case 'html':
        exportWireframeAsHTML(wireframe, options);
        break;
      case 'pdf':
        exportWireframeAsPDF(wireframeElement, wireframe, options);
        break;
      case 'image':
        exportWireframeAsImage(wireframeElement, wireframe, options);
        break;
    }
    
    // Close the dialog after export
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Wireframe</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs value={exportFormat} onValueChange={(value) => setExportFormat(value as any)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="html" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                HTML
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <FilePdf className="h-4 w-4" />
                PDF
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="html">
              <p className="text-sm text-muted-foreground mb-4">
                Export as HTML that can be viewed in any browser.
              </p>
            </TabsContent>
            
            <TabsContent value="pdf">
              <p className="text-sm text-muted-foreground mb-4">
                Export as PDF document for easy sharing.
              </p>
            </TabsContent>
            
            <TabsContent value="image">
              <p className="text-sm text-muted-foreground mb-4">
                Export as PNG image that can be used in presentations.
              </p>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filename">Filename</Label>
                <Input 
                  id="filename"
                  value={filename} 
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="wireframe"
                />
              </div>
              
              {exportFormat !== 'html' && (
                <div className="space-y-2">
                  <Label htmlFor="scale">Scale</Label>
                  <Select value={scale} onValueChange={setScale}>
                    <SelectTrigger id="scale">
                      <SelectValue placeholder="Select scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x (Low)</SelectItem>
                      <SelectItem value="2">2x (Medium)</SelectItem>
                      <SelectItem value="3">3x (High)</SelectItem>
                      <SelectItem value="4">4x (Very High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {exportFormat === 'image' && (
              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger id="quality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="70">70% (Low)</SelectItem>
                    <SelectItem value="80">80% (Medium)</SelectItem>
                    <SelectItem value="90">90% (High)</SelectItem>
                    <SelectItem value="100">100% (Best)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
