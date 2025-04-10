
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { exportWireframe } from '@/utils/wireframe/export-utils';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { toast } from 'sonner';
import { FileIcon, ImageIcon, FileTextIcon, FileJsonIcon, FileCodeIcon, Loader2 } from 'lucide-react';

interface WireframeExportDialogProps {
  wireframe: WireframeData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasElement?: HTMLCanvasElement;
  svgElement?: SVGElement;
}

const WireframeExportDialog: React.FC<WireframeExportDialogProps> = ({
  wireframe,
  open,
  onOpenChange,
  canvasElement,
  svgElement
}) => {
  const [exportFormat, setExportFormat] = useState<'html' | 'json' | 'pdf' | 'png' | 'svg'>('html');
  const [fileName, setFileName] = useState('');
  const [includeDesignSystem, setIncludeDesignSystem] = useState(true);
  const [includeComponents, setIncludeComponents] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!wireframe) {
      toast('No wireframe data available for export');
      return;
    }

    setIsExporting(true);

    try {
      // Generate a default file name if not provided
      const finalFileName = fileName || `${wireframe.title || 'wireframe'}-export`;
      
      // Clone wireframe to avoid modifying the original
      const exportData = JSON.parse(JSON.stringify(wireframe)) as WireframeData;
      
      // Optionally remove components if not needed
      if (!includeComponents && exportData.sections) {
        exportData.sections = exportData.sections.map(section => ({
          ...section,
          components: [] // Remove components
        }));
      }
      
      // Optionally remove design system if not needed
      if (!includeDesignSystem) {
        delete exportData.colorScheme;
        delete exportData.typography;
        delete exportData.designTokens;
        delete exportData.styleToken;
      }
      
      await exportWireframe(exportData, exportFormat, {
        canvasElement,
        svgElement,
        fileName: finalFileName
      });
      
      // Close dialog after successful export
      onOpenChange(false);
    } catch (error) {
      console.error('Export error:', error);
      toast(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const formatIcon = {
    html: <FileCodeIcon className="h-4 w-4" />,
    json: <FileJsonIcon className="h-4 w-4" />,
    pdf: <FileTextIcon className="h-4 w-4" />,
    png: <ImageIcon className="h-4 w-4" />,
    svg: <FileIcon className="h-4 w-4" />
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Wireframe</DialogTitle>
          <DialogDescription>
            Choose your preferred export format and options.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="fileName" className="mb-2 block">
              File Name (optional)
            </Label>
            <Input
              id="fileName"
              placeholder="Enter file name (without extension)"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-2 block">Export Format</Label>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as any)}
              className="grid grid-cols-5 gap-2"
            >
              {(['html', 'json', 'pdf', 'png', 'svg'] as const).map(format => (
                <Label
                  key={format}
                  className={`flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer ${
                    exportFormat === format ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                  htmlFor={`format-${format}`}
                >
                  {formatIcon[format]}
                  <RadioGroupItem
                    value={format}
                    id={`format-${format}`}
                    className="sr-only"
                  />
                  <span className="mt-1 text-xs uppercase">{format}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDesignSystem"
                checked={includeDesignSystem}
                onCheckedChange={(checked) => setIncludeDesignSystem(checked as boolean)}
              />
              <Label htmlFor="includeDesignSystem">Include Design System</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeComponents"
                checked={includeComponents}
                onCheckedChange={(checked) => setIncludeComponents(checked as boolean)}
              />
              <Label htmlFor="includeComponents">Include Components</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
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
              `Export as ${exportFormat.toUpperCase()}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WireframeExportDialog;
