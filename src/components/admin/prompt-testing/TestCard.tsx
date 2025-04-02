
import { PromptTest } from "@/services/ai/content/prompt-testing/ab-testing-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TestCardProps {
  test: PromptTest;
  isSelected: boolean;
  onClick: () => void;
}

export function TestCard({ test, isSelected, onClick }: TestCardProps) {
  return (
    <Card 
      key={test.id} 
      className={`cursor-pointer ${isSelected ? 'border-primary' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base">
          {test.name}
          <Badge 
            className="ml-2" 
            variant={test.status === 'active' ? 'default' : 'outline'}
          >
            {test.status}
          </Badge>
        </CardTitle>
        <CardDescription>
          {test.description || `Testing ${test.contentType} prompt variations`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {test.variants.length} variants | Created: {new Date(test.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
