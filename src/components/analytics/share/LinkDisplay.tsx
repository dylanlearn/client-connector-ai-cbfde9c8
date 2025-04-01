
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface LinkDisplayProps {
  shareLink: string;
}

const LinkDisplay = ({ shareLink }: LinkDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
  );
};

export default LinkDisplay;
