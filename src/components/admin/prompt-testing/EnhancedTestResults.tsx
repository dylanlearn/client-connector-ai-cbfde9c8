
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, InfoIcon, TrendingUp, TrendingDown, MoveHorizontal } from 'lucide-react';
import { PromptTest, PromptTestResult } from '@/services/ai/content/prompt-testing/ab-testing-service';

interface EnhancedTestResultsProps {
  test?: PromptTest | null;
  results: PromptTestResult[] | null;
  isLoading: boolean;
}

export function EnhancedTestResults({ test, results, isLoading }: EnhancedTestResultsProps) {
  const [statisticallySignificantResult, setStatisticallySignificantResult] = useState<PromptTestResult | null>(null);
  const [controlVariant, setControlVariant] = useState<PromptTestResult | null>(null);

  useEffect(() => {
    if (results) {
      // Find control variant
      const control = results.find(r => r.variant.isControl);
      if (control) setControlVariant(control);

      // Find statistically significant winner if any
      const significant = results.find(r => r.isStatisticallySignificant);
      if (significant) setStatisticallySignificantResult(significant);
    }
  }, [results]);

  const getLiftBadge = (lift: number) => {
    if (lift > 5) {
      return <Badge className="bg-emerald-500"><TrendingUp className="h-3 w-3 mr-1" /> +{lift.toFixed(1)}%</Badge>;
    } else if (lift < -5) {
      return <Badge className="bg-rose-500"><TrendingDown className="h-3 w-3 mr-1" /> {lift.toFixed(1)}%</Badge>;
    } else {
      return <Badge variant="outline"><MoveHorizontal className="h-3 w-3 mr-1" /> {lift.toFixed(1)}%</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Test Results</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Loading test results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No results available for this test yet. Results will appear here once the test receives impressions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Test Results</span>
          {statisticallySignificantResult && (
            <Badge className="bg-emerald-500">
              Winner found ({(statisticallySignificantResult.confidenceLevel || 0).toFixed(1)}% confidence)
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Variant Performance</h3>
              <div className="grid gap-4">
                {results.map((result) => (
                  <div key={result.variant.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium">{result.variant.name}</span>
                        {result.variant.isControl && (
                          <Badge variant="outline" className="ml-2">Control</Badge>
                        )}
                        {result.isStatisticallySignificant && (
                          <Badge className="ml-2 bg-emerald-500">Winner</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{result.conversionRate.toFixed(1)}%</span>
                        {!result.variant.isControl && result.lift !== undefined && getLiftBadge(result.lift)}
                      </div>
                    </div>
                    <Progress value={result.conversionRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Impressions: {result.impressionCount}</span>
                      <span>Successes: {result.successCount}</span>
                      <span>Failures: {result.failureCount}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {test && test.minSampleSize && (
                <div className="flex items-center mt-4 p-2 bg-muted rounded-md">
                  <InfoIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Target sample size: {test.minSampleSize} impressions per variant
                    {controlVariant && ` (current: ${controlVariant.impressionCount})`}
                  </span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="conversion">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Lift vs Control</TableHead>
                  <TableHead>Statistical Sig.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.variant.id}>
                    <TableCell className="font-medium">
                      {result.variant.name}
                      {result.variant.isControl && <Badge variant="outline" className="ml-2">Control</Badge>}
                    </TableCell>
                    <TableCell>{result.impressionCount}</TableCell>
                    <TableCell>{result.successCount}</TableCell>
                    <TableCell>{result.conversionRate.toFixed(1)}%</TableCell>
                    <TableCell>
                      {!result.variant.isControl && result.lift !== undefined ? getLiftBadge(result.lift) : '-'}
                    </TableCell>
                    <TableCell>
                      {result.isStatisticallySignificant ? (
                        <Badge className="bg-emerald-500">Yes ({(result.confidenceLevel || 0).toFixed(1)}%)</Badge>
                      ) : 'No'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="performance">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant</TableHead>
                  <TableHead>Avg. Latency</TableHead>
                  <TableHead>Avg. Tokens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.variant.id}>
                    <TableCell className="font-medium">{result.variant.name}</TableCell>
                    <TableCell>
                      {result.avgLatency ? `${result.avgLatency.toFixed(0)} ms` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {result.avgTokensPerRequest ? Math.round(result.avgTokensPerRequest) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="raw">
            <div className="text-xs font-mono p-4 bg-muted rounded-md overflow-auto max-h-[400px]">
              <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
