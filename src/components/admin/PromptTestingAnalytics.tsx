
import { useState, useEffect } from "react";
import { 
  PromptABTestingService,
  PromptTest,
  PromptTestResult
} from "@/services/ai/content/prompt-testing/ab-testing-service";
import { PromptDBService } from "@/services/ai/content/prompt-testing/db-service";
import { mapDbTestToPromptTest } from "@/services/ai/content/prompt-testing/utils/type-mappers";
import {
  TestHeader,
  TestCardGrid,
  TestResults,
  EmptyTestsState,
  LoadingState
} from "./prompt-testing";

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
      const dbTests = await PromptDBService.getAllTests();
      const mappedTests = dbTests.map(mapDbTestToPromptTest);
      setTests(mappedTests);
      
      // Auto-select the first test if available
      if (mappedTests && mappedTests.length > 0) {
        setSelectedTest(mappedTests[0].id);
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (tests.length === 0) {
    return <EmptyTestsState />;
  }

  return (
    <div className="space-y-6">
      <TestHeader onRefresh={fetchTests} />
      
      <TestCardGrid 
        tests={tests}
        selectedTest={selectedTest}
        onSelectTest={setSelectedTest}
      />

      {selectedTest && (
        <TestResults 
          test={currentTest}
          results={testResults}
          isLoading={isLoadingResults}
        />
      )}
    </div>
  );
}
