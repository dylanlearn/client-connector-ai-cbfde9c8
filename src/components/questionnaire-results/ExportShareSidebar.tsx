
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download, Share2, FileText, MessageSquare } from "lucide-react";
import { NotionExportDialog } from "@/components/export/integration-dialogs/NotionExportDialog";
import { SlackExportDialog } from "@/components/export/integration-dialogs/SlackExportDialog";
import { generatePDF } from "@/utils/pdf-export";
import { toast } from "sonner";

interface ExportShareSidebarProps {
  onExport: (format: string) => void;
}

const ExportShareSidebar = ({ onExport }: ExportShareSidebarProps) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate PDF for integrations
  const prepareForIntegration = async (callback: () => void) => {
    if (pdfBlob) {
      callback();
      return;
    }
    
    setIsGenerating(true);
    toast.info("Preparing document...");
    
    try {
      const blob = await generatePDF('exportContent', "design-brief");
      setPdfBlob(blob);
      callback();
    } catch (error) {
      console.error("Error generating PDF:", error);
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
        
        <NotionExportDialog 
          pdfBlob={pdfBlob} 
          title="Design Brief"
          trigger={
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={(e) => {
                e.preventDefault();
                prepareForIntegration(() => {});
              }}
              disabled={isGenerating}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Export to Notion
            </Button>
          }
        />
        
        <SlackExportDialog 
          pdfBlob={pdfBlob} 
          title="Design Brief"
          trigger={
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={(e) => {
                e.preventDefault();
                prepareForIntegration(() => {});
              }}
              disabled={isGenerating}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Share via Slack
            </Button>
          }
        />
        
        <Button variant="outline" className="w-full justify-start" onClick={() => onExport("figma")}>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Send to Figma
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => onExport("webflow")}>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Send to Webflow
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
