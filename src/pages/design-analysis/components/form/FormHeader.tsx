
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormHeaderProps {
  websiteName: string;
  websiteUrl: string;
  isAnalyzing: boolean;
  onWebsiteNameChange: (value: string) => void;
  onWebsiteUrlChange: (value: string) => void;
}

const FormHeader = ({
  websiteName,
  websiteUrl,
  isAnalyzing,
  onWebsiteNameChange,
  onWebsiteUrlChange
}: FormHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="website-name">Website Name</Label>
        <Input
          id="website-name"
          placeholder="e.g., Company Website"
          value={websiteName}
          onChange={(e) => onWebsiteNameChange(e.target.value)}
          required
          disabled={isAnalyzing}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="website-url">Website URL</Label>
        <Input
          id="website-url"
          placeholder="e.g., https://example.com"
          value={websiteUrl}
          onChange={(e) => onWebsiteUrlChange(e.target.value)}
          required
          disabled={isAnalyzing}
        />
      </div>
    </div>
  );
};

export default FormHeader;
