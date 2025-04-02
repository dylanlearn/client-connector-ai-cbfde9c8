
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { PDFGenerationOptions } from "@/utils/pdf-export";

interface AdvancedPDFOptionsProps {
  pdfOptions: PDFGenerationOptions;
  updatePdfOption: (key: keyof PDFGenerationOptions, value: any) => void;
  pdfBlob: Blob | null;
  handleRegenerate: () => void;
}

export function AdvancedPDFOptions({
  pdfOptions,
  updatePdfOption,
  pdfBlob,
  handleRegenerate
}: AdvancedPDFOptionsProps) {
  return (
    <div className="space-y-3 border rounded-md p-3 mb-4">
      <div className="space-y-2">
        <Label htmlFor="pdf-quality">PDF Quality</Label>
        <Select 
          value={pdfOptions.quality?.toString()} 
          onValueChange={(value) => updatePdfOption('quality', parseInt(value))}
        >
          <SelectTrigger id="pdf-quality">
            <SelectValue placeholder="Select quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Draft - Faster (Lower Quality)</SelectItem>
            <SelectItem value="2">Standard (Default)</SelectItem>
            <SelectItem value="3">High Quality</SelectItem>
            <SelectItem value="4">Maximum Quality (Slower)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Higher quality takes longer to generate but produces better results.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pdf-margin">Margin (mm)</Label>
        <Input
          id="pdf-margin"
          type="number"
          min="0"
          max="25"
          value={pdfOptions.margin}
          onChange={(e) => updatePdfOption('margin', Number(e.target.value))}
        />
      </div>
      
      {pdfBlob && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRegenerate} 
          className="w-full"
        >
          <Loader2 className="mr-2 h-4 w-4" />
          Regenerate with New Settings
        </Button>
      )}
    </div>
  );
}
