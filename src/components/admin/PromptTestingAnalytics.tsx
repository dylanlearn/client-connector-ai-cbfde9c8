
import { useState, useEffect } from "react";
import { Loader2, BarChart3, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  PromptABTestingService,
  PromptTest,
  PromptTestResult,
  PromptVariant
} from "@/services/ai/content/prompt-testing/ab-testing-service";

export function PromptTestingAnalytics() {
  const [tests, setTests] = useState<PromptTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<PromptTestResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // Fetch all tests on component mount
  useEffect(() => {
    fetchTests();
  }, []);

  // Fetch test results when a test is selected
  useEffect(() => {
    if (selectedTest) {
      fetchTestResults(selectedTest);
    }
  }, [selectedTest]);

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      // This is a placeholder - we would need to add this method to the service
      const testsData = await PromptDBService.getAllTests();
      setTests(testsData || []);
      
      // Auto-select the first test if available
      if (testsData && testsData.length > 0) {
        setSelectedTest(testsData[0].id);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestResults = async (testId: string) => {
    setIsLoadingResults(true);
    try {
      const results = await PromptABTestingService.getTestResults(testId);
      setTestResults(results);
    } catch (error) {
      console.error("Error fetching test results:", error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Find the current test object
  const currentTest = tests.find(test => test.id === selectedTest);
  
  // Calculate success rates and confidence intervals
  const getSuccessRate = (result: PromptTestResult) => {
    const total = result.successes + result.failures;
    return total > 0 ? (result.successes / total * 100).toFixed(1) : "0.0";
  };

  const getVariantName = (variantId: string): string => {
    if (!currentTest) return "Unknown";
    const variant = currentTest.variants.find(v => v.id === variantId);
    return variant ? variant.name : "Unknown";
  };
  
  const isControlVariant = (variantId: string): boolean => {
    if (!currentTest) return false;
    const variant = currentTest.variants.find(v => v.id === variantId);
    return variant ? variant.isControl : false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading prompt tests...</span>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-medium text-lg mb-2">No Prompt Tests Found</h3>
        <p className="text-muted-foreground">
          No A/B tests have been created yet. Create a test to start optimizing your AI prompts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Prompt A/B Testing Analytics</h2>
        <Button onClick={fetchTests} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tests.map((test) => (
          <Card 
            key={test.id} 
            className={`cursor-pointer ${selectedTest === test.id ? 'border-primary' : ''}`}
            onClick={() => setSelectedTest(test.id)}
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
        ))}
      </div>

      {selectedTest && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {currentTest?.description || 'Performance metrics for each variant'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingResults ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading results...</span>
              </div>
            ) : testResults && testResults.length > 0 ? (
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
                  {testResults.map((result) => (
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
      )}
    </div>
  );
}

// Need to import the service
import { PromptDBService } from "@/services/ai/content/prompt-testing/db-service";
