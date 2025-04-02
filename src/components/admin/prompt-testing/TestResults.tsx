
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PromptTest, PromptTestResult } from "@/services/ai/content/prompt-testing/ab-testing-service";

interface TestResultsProps {
  test: PromptTest | undefined;
  results: PromptTestResult[] | null;
  isLoading: boolean;
}

export function TestResults({ test, results, isLoading }: TestResultsProps) {
  if (!test) return null;

  const getVariantName = (variantId: string): string => {
    if (!test) return "Unknown";
    const variant = test.variants.find(v => v.id === variantId);
    return variant ? variant.name : "Unknown";
  };
  
  const isControlVariant = (variantId: string): boolean => {
    if (!test) return false;
    const variant = test.variants.find(v => v.id === variantId);
    return variant ? variant.isControl : false;
  };

  const getSuccessRate = (result: PromptTestResult) => {
    const total = result.successes + result.failures;
    return total > 0 ? (result.successes / total * 100).toFixed(1) : "0.0";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
        <CardDescription>
          {test?.description || 'Performance metrics for each variant'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="md" />
            <span className="ml-2">Loading results...</span>
          </div>
        ) : results && results.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variant</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Successes</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Avg. Latency</TableHead>
                <TableHead>Avg. Tokens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium flex items-center">
                    {getVariantName(result.variantId)}
                    {isControlVariant(result.variantId) && (
                      <Badge className="ml-2" variant="outline">Control</Badge>
                    )}
                  </TableCell>
                  <TableCell>{result.impressions}</TableCell>
                  <TableCell>{result.successes}</TableCell>
                  <TableCell>{getSuccessRate(result)}%</TableCell>
                  <TableCell>{result.averageLatencyMs} ms</TableCell>
                  <TableCell>{result.averageTokenUsage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No results available yet for this test.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
