
import React, { useState } from 'react';
import { 
  FileJson, 
  FileText, 
  Download, 
  Share2,
  Image as ImageIcon,
  FileCode,
  Copy
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PDFExportDialog } from '@/components/export/PDFExportDialog';
import { WireframeData } from '@/types/wireframe';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { generateHtmlFromWireframe } from './html-export';

interface WireframeExportMenuProps {
  wireframeData: WireframeData;
  buttonVariant?: "default" | "outline" | "secondary";
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

export const WireframeExportMenu: React.FC<WireframeExportMenuProps> = ({
  wireframeData,
  buttonVariant = "outline",
  buttonSize = "default"
}) => {
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  
  const handleJsonExport = () => {
    // Create a JSON blob and download it
    const jsonString = JSON.stringify(wireframeData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wireframeData.title || 'wireframe'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('JSON exported successfully');
  };
  
  const handleCopyJson = () => {
    const jsonString = JSON.stringify(wireframeData, null, 2);
    navigator.clipboard.writeText(jsonString);
    toast.success('JSON copied to clipboard');
  };
  
  const handleHtmlExport = () => {
    try {
      const htmlContent = generateHtmlFromWireframe(wireframeData);
      
      // Create a blob with the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${wireframeData.title || 'wireframe'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('HTML exported successfully');
    } catch (error) {
      console.error('Error exporting HTML:', error);
      toast.error('Failed to export HTML');
    }
  };
  
  const handleImageExport = async () => {
    try {
      toast.info('Preparing image export...');
      
      // Give a chance for the toast to show and necessary modules to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const element = document.getElementById('wireframe-canvas');
      if (!element) {
        throw new Error('Wireframe canvas element not found');
      }
      
      // Dynamically import html2canvas to reduce initial bundle size
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: wireframeData.colorScheme?.background || '#ffffff'
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `${wireframeData.title || 'wireframe'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Image exported successfully');
    } catch (error) {
      console.error('Error exporting image:', error);
      toast.error('Failed to export image');
    }
  };
  
  const handleShareExport = () => {
    // Create a shareable link (simplified implementation)
    const shareableData = { 
      title: wireframeData.title,
      sections: wireframeData.sections?.map(section => ({
        id: section.id,
        sectionType: section.sectionType,
        name: section.name
      }))
    };
    
    const shareStr = btoa(JSON.stringify(shareableData));
    const shareUrl = `${window.location.origin}/share?wireframe=${shareStr}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast.success('Shareable link copied to clipboard');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={buttonVariant} size={buttonSize}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleJsonExport}>
              <FileJson className="mr-2 h-4 w-4" />
              <span>Export as JSON</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleCopyJson}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy JSON</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setPdfDialogOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Export as PDF</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleHtmlExport}>
              <FileCode className="mr-2 h-4 w-4" />
              <span>Export as HTML</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleImageExport}>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Export as Image</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleShareExport}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Create Shareable Link</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <PDFExportDialog 
        contentId="wireframe-canvas"
        filename={wireframeData.title || "wireframe-design"}
        trigger={<div style={{ display: 'none' }}></div>}
      />
    </>
  );
};
