
import { PromptTest } from "@/services/ai/content/prompt-testing/ab-testing-service";
import { TestCard } from "./TestCard";

interface TestCardGridProps {
  tests: PromptTest[];
  selectedTest: string | null;
  onSelectTest: (testId: string) => void;
}

export function TestCardGrid({ tests, selectedTest, onSelectTest }: TestCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tests.map((test) => (
        <TestCard 
          key={test.id}
          test={test}
          isSelected={selectedTest === test.id}
          onClick={() => onSelectTest(test.id)}
        />
      ))}
    </div>
  );
}
