
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileDown, FileIcon, Image, Code } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { exportWireframeAsHTML, exportWireframeAsPDF, exportWireframeAsImage } from '@/utils/wireframe/export-utils';
import { useToast } from '@/hooks/use-toast';

interface WireframeExportDialogProps {
  wireframe: WireframeData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  wireframe,
  open,
  onOpenChange,
}) => {
  const [exportType, setExportType] = useState<'html' | 'pdf' | 'image'>('html');
  const [exportFormat, setExportFormat] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [exportTheme, setExportTheme] = useState<'light' | 'dark'>('light');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Handle export
  const handleExport = async () => {
    if (!wireframe) return;

    setIsExporting(true);
    try {
      let success = false;
      const isDarkMode = exportTheme === 'dark';
      
      switch (exportType) {
        case 'html':
          success = await exportWireframeAsHTML(wireframe, {
            deviceType: exportFormat,
            darkMode: isDarkMode,
          });
          break;
        case 'pdf':
          success = await exportWireframeAsPDF(wireframe, {
            deviceType: exportFormat,
            darkMode: isDarkMode,
          });
          break;
        case 'image':
          success = await exportWireframeAsImage(wireframe, {
            deviceType: exportFormat,
            darkMode: isDarkMode,
          });
          break;
      }

      if (success) {
        toast({
          title: "Export Successful",
          description: `Wireframe exported as ${exportType.toUpperCase()}`,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Export Failed",
          description: "Unable to export wireframe. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
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
            Choose your export options for "{wireframe?.title || 'Untitled Wireframe'}"
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="format" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="device">Device</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="format" className="pt-4 pb-2">
            <RadioGroup 
              value={exportType} 
              onValueChange={(value) => setExportType(value as 'html' | 'pdf' | 'image')}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="html" id="html" />
                <Label htmlFor="html" className="flex items-center gap-2 cursor-pointer">
                  <Code className="h-4 w-4" />
                  <div>
                    <div className="font-medium">HTML</div>
                    <p className="text-sm text-muted-foreground">Export as HTML and CSS code</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                  <FileIcon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">PDF Document</div>
                    <p className="text-sm text-muted-foreground">Export as a PDF document</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer">
                  <Image className="h-4 w-4" />
                  <div>
                    <div className="font-medium">PNG Image</div>
                    <p className="text-sm text-muted-foreground">Export as a PNG image</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="device" className="pt-4 pb-2">
            <RadioGroup 
              value={exportFormat} 
              onValueChange={(value) => setExportFormat(value as 'desktop' | 'tablet' | 'mobile')}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="desktop" id="desktop" />
                <Label htmlFor="desktop" className="cursor-pointer">
                  <div className="font-medium">Desktop</div>
                  <p className="text-sm text-muted-foreground">Desktop layout (1280px)</p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="tablet" id="tablet" />
                <Label htmlFor="tablet" className="cursor-pointer">
                  <div className="font-medium">Tablet</div>
                  <p className="text-sm text-muted-foreground">Tablet layout (768px)</p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile" className="cursor-pointer">
                  <div className="font-medium">Mobile</div>
                  <p className="text-sm text-muted-foreground">Mobile layout (375px)</p>
                </Label>
              </div>
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="theme" className="pt-4 pb-2">
            <RadioGroup 
              value={exportTheme} 
              onValueChange={(value) => setExportTheme(value as 'light' | 'dark')}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="cursor-pointer">
                  <div className="font-medium">Light Theme</div>
                  <p className="text-sm text-muted-foreground">Light background with dark text</p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="cursor-pointer">
                  <div className="font-medium">Dark Theme</div>
                  <p className="text-sm text-muted-foreground">Dark background with light text</p>
                </Label>
              </div>
            </RadioGroup>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="flex items-center gap-1"
          >
            {isExporting ? "Exporting..." : (
              <>
                <FileDown className="h-4 w-4" />
                <span>Export</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
