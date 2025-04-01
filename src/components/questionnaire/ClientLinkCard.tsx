
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ClientLinkCardProps {
  shareLink: string;
}

const ClientLinkCard = ({ shareLink }: ClientLinkCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      description: "Questionnaire link copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Link</CardTitle>
        <CardDescription>
          Share this link with your client to have them complete the questionnaire.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input value={shareLink} readOnly />
          <Button size="icon" variant="outline" onClick={copyShareLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="w-full" onClick={() => navigate("/questionnaire-preview")}>
          <Settings className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientLinkCard;
