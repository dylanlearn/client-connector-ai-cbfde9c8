
import { useState, useEffect } from "react";
import { EnhancedTestResults } from "./EnhancedTestResults";
import { PromptTest, PromptTestResult } from "@/services/ai/content/prompt-testing/ab-testing-service";

interface TestResultsProps {
  test?: PromptTest | null;
  results: PromptTestResult[] | null;
  isLoading: boolean;
}

export function TestResults({ test, results, isLoading }: TestResultsProps) {
  // This component now delegates to the enhanced implementation
  return (
    <EnhancedTestResults 
      test={test}
      results={results}
      isLoading={isLoading}
    />
  );
}
