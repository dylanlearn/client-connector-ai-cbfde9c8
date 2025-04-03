
import { Card } from "@/components/ui/card";
import { formatSuggestionContent } from "./utils/formatters";

interface SuggestionRawTextProps {
  text: string;
}

const SuggestionRawText = ({ text }: SuggestionRawTextProps) => {
  return (
    <Card className="p-4 whitespace-pre-wrap">
      <div dangerouslySetInnerHTML={{ __html: formatSuggestionContent(text) }} />
    </Card>
  );
};

export default SuggestionRawText;
