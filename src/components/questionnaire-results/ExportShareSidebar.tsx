
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download, Share2, FileText, ExternalLink } from "lucide-react";
import { generatePDF, downloadPDF } from "@/utils/pdf-export";
import { toast } from "sonner";

interface ExportShareSidebarProps {
  onExport: (format: string) => void;
}

const ExportShareSidebar = ({ onExport }: ExportShareSidebarProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownloadFor = async (service: string) => {
    setIsGenerating(true);
    toast.info(`Preparing document for ${service}...`);
    
    try {
      const blob = await generatePDF('exportContent', `design-brief-for-${service.toLowerCase()}`);
      if (blob) {
        downloadPDF(blob, `design-brief-for-${service.toLowerCase()}`);
        toast.success(`PDF ready to upload to ${service}`);
      }
    } catch (error) {
      console.error(`Error generating PDF for ${service}:`, error);
      toast.error("Failed to prepare document");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Export & Share</CardTitle>
        <CardDescription>
          Export the design brief or share it with your team.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => onExport("pdf")}
          disabled={isGenerating}
        >
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleDownloadFor("Notion")}
          disabled={isGenerating}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Download for Notion
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleDownloadFor("Slack")}
          disabled={isGenerating}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Download for Slack
        </Button>
        
        <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadFor("Figma")}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Download for Figma
        </Button>
        
        <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadFor("Webflow")}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Download for Webflow
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <Share2 className="mr-2 h-4 w-4" />
          Share with Team
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportShareSidebar;
