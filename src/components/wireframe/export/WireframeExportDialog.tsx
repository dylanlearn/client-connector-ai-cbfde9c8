
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Check, Download, FileCode, FileImage, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface WireframeExportDialogProps {
  wireframe: WireframeData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string; // Add projectId as optional prop
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  wireframe,
  open,
  onOpenChange,
  projectId
}) => {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<string>('image');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportComplete, setExportComplete] = useState<boolean>(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    try {
      // In a real implementation, this would actually export the wireframe
      // using projectId if needed
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setExportComplete(true);
      toast({
        title: "Export successful",
        description: `Wireframe exported as ${exportFormat.toUpperCase()}`,
      });
      
      // Reset after a delay
      setTimeout(() => {
        setExportComplete(false);
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting your wireframe",
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
            Choose a format to export your wireframe design
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="image" onValueChange={setExportFormat}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="html">HTML/CSS</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="image" className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <FileImage className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>Export as a PNG image</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Creates a high-resolution image of your wireframe that can be easily shared.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="html" className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <FileCode className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>Export as HTML/CSS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Generates HTML and CSS code that can be used in web development projects.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <FileJson className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>Export as JSON</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Exports the wireframe data as a JSON file that can be imported into other tools.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          <Button 
            onClick={handleExport}
            disabled={isExporting || exportComplete}
            className="min-w-[100px]"
          >
            {isExporting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">◌</span>
                Exporting
              </span>
            ) : exportComplete ? (
              <span className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Done
              </span>
            ) : (
              <span className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Export
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
