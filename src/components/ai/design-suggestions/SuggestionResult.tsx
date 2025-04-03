
import { FC } from "react";

interface SuggestionResultProps {
  suggestions: string | null;
}

const SuggestionResult: FC<SuggestionResultProps> = ({ suggestions }) => {
  if (!suggestions) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">AI Suggestions:</h3>
      <div className="bg-muted p-4 rounded-md whitespace-pre-line">
        {suggestions}
      </div>
    </div>
  );
};

export default SuggestionResult;
