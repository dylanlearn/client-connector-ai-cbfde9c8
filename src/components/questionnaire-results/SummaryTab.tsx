
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, FileText } from "lucide-react";

interface SummaryTabProps {
  summary: string;
  onCopy: () => void;
  onExport: (format: string) => void;
}

const SummaryTab = ({ summary, onCopy, onExport }: SummaryTabProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    onCopy();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          AI-Generated Project Brief
        </CardTitle>
        <CardDescription>
          Our AI has analyzed the client's responses and generated a comprehensive project brief.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 bg-white rounded-lg border whitespace-pre-line">
          {summary}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button onClick={() => onExport('pdf')}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryTab;
