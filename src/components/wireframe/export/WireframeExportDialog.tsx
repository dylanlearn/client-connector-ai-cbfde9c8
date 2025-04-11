
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { exportWireframeAsHTML, exportWireframeAsImage, exportWireframeAsPDF } from '@/utils/wireframe/export-utils';
import { Download, FileText, FileImage, FilePdf, Loader2 } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useToast } from '@/hooks/use-toast';

interface WireframeExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wireframe: WireframeData;
  canvasElement?: HTMLCanvasElement | null;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  open,
  onOpenChange,
  wireframe,
  canvasElement
}) => {
  const [exportType, setExportType] = useState<'image' | 'pdf' | 'html'>('image');
  const [filename, setFilename] = useState(wireframe.title?.toLowerCase().replace(/\s+/g, '-') || 'wireframe');
  const [isExporting, setIsExporting] = useState(false);
  const [htmlOptions, setHtmlOptions] = useState({
    includeCSS: true,
    includeJS: false,
    responsive: true
  });
  const [imageOptions, setImageOptions] = useState({
    scale: 2,
    backgroundColor: '#ffffff'
  });
  const [pdfOptions, setPdfOptions] = useState({
    pageSize: 'a4',
    scale: 2
  });
  
  const { toast } = useToast();

  const handleExport = async () => {
    if (!wireframe) return;
    
    setIsExporting(true);
    
    try {
      // Get the element to export if canvasElement is not provided
      const element = canvasElement || document.getElementById('wireframe-preview-container');
      
      switch (exportType) {
        case 'image':
          await exportWireframeAsImage(element, wireframe, {
            scale: imageOptions.scale,
            backgroundColor: imageOptions.backgroundColor,
            filename
          });
          break;
          
        case 'pdf':
          await exportWireframeAsPDF(element, wireframe, {
            scale: pdfOptions.scale,
            filename,
            pageSize: pdfOptions.pageSize === 'a4' 
              ? [595.28, 841.89] 
              : pdfOptions.pageSize === 'letter' 
                ? [612, 792]
                : [1024, 768]
          });
          break;
          
        case 'html':
          exportWireframeAsHTML(wireframe, {
            includeCSS: htmlOptions.includeCSS,
            includeJS: htmlOptions.includeJS,
            filename,
            responsive: htmlOptions.responsive
          });
          break;
      }
      
      toast({
        title: 'Export Successful',
        description: `Your wireframe has been exported as ${exportType.toUpperCase()}.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Export error:', error);
      
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your wireframe.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Wireframe</DialogTitle>
          <DialogDescription>
            Choose a format to export your wireframe
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={exportType} onValueChange={(value) => setExportType(value as any)} className="pt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              Image
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FilePdf className="h-4 w-4" />
              PDF
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              HTML
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-4 mb-4">
            <div>
              <Label htmlFor="filename">Filename</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="wireframe-export"
              />
            </div>
          </div>
          
          <TabsContent value="image" className="space-y-4">
            <div>
              <Label htmlFor="scale">Image Quality</Label>
              <Select 
                value={String(imageOptions.scale)} 
                onValueChange={(value) => setImageOptions({...imageOptions, scale: Number(value)})}
              >
                <SelectTrigger id="scale">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Normal (1x)</SelectItem>
                  <SelectItem value="2">High (2x)</SelectItem>
                  <SelectItem value="3">Ultra (3x)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="background">Background Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border cursor-pointer" 
                  style={{ backgroundColor: imageOptions.backgroundColor }}
                />
                <Input
                  id="background"
                  value={imageOptions.backgroundColor}
                  onChange={(e) => setImageOptions({...imageOptions, backgroundColor: e.target.value})}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="pdf" className="space-y-4">
            <div>
              <Label htmlFor="pageSize">Page Size</Label>
              <Select 
                value={pdfOptions.pageSize} 
                onValueChange={(value) => setPdfOptions({...pdfOptions, pageSize: value})}
              >
                <SelectTrigger id="pageSize">
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="custom">Custom (1024x768)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="pdfScale">Image Quality</Label>
              <Select 
                value={String(pdfOptions.scale)} 
                onValueChange={(value) => setPdfOptions({...pdfOptions, scale: Number(value)})}
              >
                <SelectTrigger id="pdfScale">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Normal (1x)</SelectItem>
                  <SelectItem value="2">High (2x)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="html" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeCSS" 
                checked={htmlOptions.includeCSS}
                onCheckedChange={(checked) => 
                  setHtmlOptions({...htmlOptions, includeCSS: checked === true})}
              />
              <Label htmlFor="includeCSS">Include CSS</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeJS" 
                checked={htmlOptions.includeJS}
                onCheckedChange={(checked) => 
                  setHtmlOptions({...htmlOptions, includeJS: checked === true})}
              />
              <Label htmlFor="includeJS">Include JavaScript</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="responsive" 
                checked={htmlOptions.responsive}
                onCheckedChange={(checked) => 
                  setHtmlOptions({...htmlOptions, responsive: checked === true})}
              />
              <Label htmlFor="responsive">Responsive Design</Label>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {exportType.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
