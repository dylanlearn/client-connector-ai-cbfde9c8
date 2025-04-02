
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PDFGenerationOptions } from "@/utils/pdf-export";
import { FileImage, Palette } from "lucide-react";

interface PDFStylingOptionsProps {
  pdfOptions: PDFGenerationOptions;
  updatePdfOption: (key: keyof PDFGenerationOptions, value: any) => void;
}

export function PDFStylingOptions({ pdfOptions, updatePdfOption }: PDFStylingOptionsProps) {
  const [showStylingOptions, setShowStylingOptions] = useState(false);
  
  const handleStylingUpdate = (key: keyof PDFGenerationOptions['styling'], value: any) => {
    const currentStyling = pdfOptions.styling || {};
    updatePdfOption('styling', { ...currentStyling, [key]: value });
  };
  
  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-between" 
        onClick={() => setShowStylingOptions(!showStylingOptions)}
      >
        <span className="flex items-center">
          <Palette className="mr-2 h-4 w-4" />
          Document Styling
        </span>
        <span>{showStylingOptions ? "▲" : "▼"}</span>
      </Button>
      
      {showStylingOptions && (
        <div className="space-y-3 border rounded-md p-3">
          <div className="space-y-2">
            <Label htmlFor="font-family">Document Font</Label>
            <Select 
              value={pdfOptions.styling?.fontFamily || 'helvetica'} 
              onValueChange={(value: any) => handleStylingUpdate('fontFamily', value)}
            >
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="helvetica">Helvetica (Sans-serif)</SelectItem>
                <SelectItem value="times">Times (Serif)</SelectItem>
                <SelectItem value="courier">Courier (Monospace)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={pdfOptions.styling?.primaryColor || '#000000'}
                  onChange={(e) => handleStylingUpdate('primaryColor', e.target.value)}
                  className="w-10 h-10 p-1"
                />
                <Input
                  type="text"
                  value={pdfOptions.styling?.primaryColor || '#000000'}
                  onChange={(e) => handleStylingUpdate('primaryColor', e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={pdfOptions.styling?.secondaryColor || '#666666'}
                  onChange={(e) => handleStylingUpdate('secondaryColor', e.target.value)}
                  className="w-10 h-10 p-1"
                />
                <Input
                  type="text"
                  value={pdfOptions.styling?.secondaryColor || '#666666'}
                  onChange={(e) => handleStylingUpdate('secondaryColor', e.target.value)}
                  className="flex-1"
                  placeholder="#666666"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="header-image">Header Image URL (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="header-image"
                type="text"
                value={pdfOptions.styling?.headerImageUrl || ''}
                onChange={(e) => handleStylingUpdate('headerImageUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1"
              />
              <Button variant="outline" size="icon" className="h-10 w-10" type="button">
                <FileImage className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add a logo or image to appear at the top of every page
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="footer-text">Footer Text (optional)</Label>
            <Input
              id="footer-text"
              value={pdfOptions.styling?.footerText || ''}
              onChange={(e) => handleStylingUpdate('footerText', e.target.value)}
              placeholder="© 2023 Your Company"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="show-page-numbers" className="cursor-pointer">Show Page Numbers</Label>
            <Switch
              id="show-page-numbers"
              checked={pdfOptions.styling?.showPageNumbers !== false}
              onCheckedChange={(checked) => handleStylingUpdate('showPageNumbers', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="show-date" className="cursor-pointer">Include Date</Label>
            <Switch
              id="show-date"
              checked={pdfOptions.styling?.showDate === true}
              onCheckedChange={(checked) => handleStylingUpdate('showDate', checked)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
