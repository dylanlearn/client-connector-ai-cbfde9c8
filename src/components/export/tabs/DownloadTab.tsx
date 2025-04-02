
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Download, Loader2 } from "lucide-react";
import { PDFGenerationOptions } from "@/utils/pdf-export";
import { AdvancedPDFOptions } from "../AdvancedPDFOptions";

interface DownloadTabProps {
  pdfOptions: PDFGenerationOptions;
  updatePdfOption: (key: keyof PDFGenerationOptions, value: any) => void;
  handleDownload: () => void;
  handleRegenerate: () => void;
  pdfBlob: Blob | null;
}

export function DownloadTab({
  pdfOptions,
  updatePdfOption,
  handleDownload,
  handleRegenerate,
  pdfBlob
}: DownloadTabProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Download the design brief as a PDF file to your device.
      </p>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-between mb-4" 
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <span className="flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          Document Settings
        </span>
        <span>{showAdvanced ? "▲" : "▼"}</span>
      </Button>
      
      {showAdvanced && (
        <AdvancedPDFOptions 
          pdfOptions={pdfOptions} 
          updatePdfOption={updatePdfOption} 
          pdfBlob={pdfBlob} 
          handleRegenerate={handleRegenerate} 
        />
      )}
      
      <div className="flex justify-center">
        <Button onClick={handleDownload} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
