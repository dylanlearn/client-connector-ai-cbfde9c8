
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useDesignSelection } from "@/hooks/use-design-selection";

const ShareAnalyticsLink = () => {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { generateClientShareLink } = useDesignSelection({});

  const handleGenerateLink = async () => {
    const link = await generateClientShareLink();
    if (link) {
      setShareLink(link);
      toast.success("Share link generated! It will expire in 24 hours.");
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-2">
      {!shareLink ? (
        <Button 
          onClick={handleGenerateLink}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share with client
        </Button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            value={shareLink} 
            readOnly 
            className="flex-1"
            placeholder="Share link..."
          />
          <Button 
            onClick={copyToClipboard}
            variant={copied ? "success" : "secondary"}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        This link gives temporary view-only access to your analytics for 24 hours.
      </p>
    </div>
  );
};

export default ShareAnalyticsLink;
