
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download, Share2 } from "lucide-react";

interface ExportShareSidebarProps {
  onExport: (format: string) => void;
}

const ExportShareSidebar = ({ onExport }: ExportShareSidebarProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Export & Share</CardTitle>
        <CardDescription>
          Export the design brief or share it with your team.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start" onClick={() => onExport("pdf")}>
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => onExport("notion")}>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Export to Notion
        </Button>
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
