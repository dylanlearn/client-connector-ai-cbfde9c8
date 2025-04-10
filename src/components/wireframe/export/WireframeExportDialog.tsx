
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ExportFormat, exportWireframe } from '@/utils/wireframe/export-utils';
import { Loader2 } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

export interface WireframeExportDialogProps {
  wireframe: WireframeData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  wireframe,
  open,
  onOpenChange
}) => {
  const [format, setFormat] = useState<ExportFormat>('html');
  const [fileName, setFileName] = useState('');
  const [includeDesignSystem, setIncludeDesignSystem] = useState(true);
  const [includeComponents, setIncludeComponents] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!wireframe) return;
    
    try {
      setIsExporting(true);
      
      await exportWireframe(wireframe, format, {
        fileName: fileName || undefined,
        includeDesignSystem,
        includeComponents
      });
      
      // Close dialog after successful export
      onOpenChange(false);
    } catch (error) {
      // Error is already handled in exportWireframe function
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatLabels: Record<ExportFormat, string> = {
    html: 'HTML',
    json: 'JSON',
    pdf: 'PDF',
    png: 'PNG',
    svg: 'SVG'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Wireframe</DialogTitle>
          <DialogDescription>
            Choose your preferred export format and options.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* File Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fileName" className="text-right">
              File Name (optional)
            </Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={wireframe?.title || "Wireframe"}
              className="col-span-3"
            />
          </div>
          
          {/* Format Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as ExportFormat)}
              className="col-span-3"
            >
              {Object.entries(formatLabels).map(([value, label]) => (
                <div className="flex items-center space-x-2" key={value}>
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {/* Options */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Options</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="designSystem"
                  checked={includeDesignSystem}
                  onCheckedChange={(checked) => 
                    setIncludeDesignSystem(checked === true)
                  }
                />
                <Label htmlFor="designSystem">Include Design System</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="components"
                  checked={includeComponents}
                  onCheckedChange={(checked) => 
                    setIncludeComponents(checked === true)
                  }
                />
                <Label htmlFor="components">Include Components</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || !wireframe}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              `Export as ${formatLabels[format]}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
