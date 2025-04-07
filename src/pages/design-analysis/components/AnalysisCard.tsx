
import { WebsiteAnalysisResult } from '@/hooks/ai-design/website-analysis/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VisualElements from './analysis/VisualElements';
import UserExperience from './analysis/UserExperience';
import ContentAnalysis from './analysis/ContentAnalysis';
import ImplementationNotes from './analysis/ImplementationNotes';
import TagsList from './analysis/TagsList';

interface AnalysisCardProps {
  result: WebsiteAnalysisResult;
}

export default function AnalysisCard({ result }: AnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{result.title}</CardTitle>
        <CardDescription>
          {result.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VisualElements elements={result.visualElements} />
          <UserExperience experience={result.userExperience} />
        </div>
        
        <ContentAnalysis content={result.contentAnalysis} />
        <ImplementationNotes notes={result.implementationNotes} />
        <TagsList tags={result.tags} />
      </CardContent>
    </Card>
  );
}
