
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Copy, 
  Eye, 
  Layout, 
  MessageSquare, 
  Award, 
  Users 
} from 'lucide-react';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis';
import { toast } from 'sonner';

interface AnalysisResultProps {
  currentResult: WebsiteAnalysisResult | null;
  analysisResults: WebsiteAnalysisResult[];
  onSelectResult: (result: WebsiteAnalysisResult) => void;
  onClearResult: () => void;
}

const AnalysisResult = ({ 
  currentResult, 
  analysisResults, 
  onSelectResult, 
  onClearResult 
}: AnalysisResultProps) => {
  const handleCopyDetails = () => {
    if (!currentResult) return;
    
    const details = `
      Title: ${currentResult.title}
      Category: ${currentResult.category}
      Description: ${currentResult.description}
      Layout: ${currentResult.visualElements.layout}
      Color Scheme: ${currentResult.visualElements.colorScheme}
      Typography: ${currentResult.visualElements.typography}
      Value Proposition: ${currentResult.contentAnalysis.valueProposition}
      Call to Action: ${currentResult.contentAnalysis.callToAction}
      Source: ${currentResult.source}
    `;
    
    navigator.clipboard.writeText(details.trim());
    toast.success("Analysis details copied to clipboard");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Analysis Results</span>
          {analysisResults.length > 0 && (
            <Badge variant="outline">{analysisResults.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Recent analysis results stored in memory
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{currentResult.title}</h3>
              <Badge>{currentResult.category}</Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">{currentResult.description}</p>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-xs">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{currentResult.source}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center">
                  {currentResult.tags.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Key Elements</h4>
              <div className="text-xs space-y-1">
                {currentResult.visualElements.layout && (
                  <div className="flex items-start gap-2">
                    <Layout className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{currentResult.visualElements.layout}</span>
                  </div>
                )}
                {currentResult.contentAnalysis.valueProposition && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{currentResult.contentAnalysis.valueProposition}</span>
                  </div>
                )}
                {currentResult.contentAnalysis.callToAction && (
                  <div className="flex items-start gap-2">
                    <Award className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{currentResult.contentAnalysis.callToAction}</span>
                  </div>
                )}
              </div>
            </div>
            
            {currentResult.targetAudience.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium">Target Audience</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {currentResult.targetAudience.map((audience, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <Users className="mr-1 h-3 w-3" />
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : analysisResults.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {analysisResults.map((result, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelectResult(result)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm">{result.title}</h3>
                    <Badge variant="outline" className="text-xs">{result.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.description}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-[400px] flex items-center justify-center flex-col">
            <div className="bg-muted rounded-full p-4 mb-4">
              <Layout className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              No analysis results yet. Analyze a website section to see results here.
            </p>
          </div>
        )}
      </CardContent>
      {currentResult && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearResult}
          >
            Back to List
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleCopyDetails}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AnalysisResult;
