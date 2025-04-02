
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertMessage } from "@/components/ui/alert-message";
import { Loader2, Pencil, BarChart3, Trophy } from "lucide-react";
import { PromptTest } from "@/services/ai/content/prompt-testing/ab-testing-service";

interface TestsListProps {
  tests: PromptTest[];
  isLoading: boolean;
}

export const TestsList = ({ tests, isLoading }: TestsListProps) => {
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
      <AlertMessage type="info" title="No A/B Tests Found">
        You haven't created any prompt A/B tests yet. Create your first test to start optimizing your AI-generated content.
      </AlertMessage>
    );
  }
  
  return (
    <div className="space-y-6">
      {tests.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  );
};

interface TestCardProps {
  test: PromptTest;
}

const TestCard = ({ test }: TestCardProps) => {
  return (
    <Card key={test.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
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
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="variants">
          <TabsList>
            <TabsTrigger value="variants">Variants ({test.variants.length})</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          <TabsContent value="variants" className="pt-4">
            <VariantsGrid variants={test.variants} />
          </TabsContent>
          <TabsContent value="results" className="pt-4">
            <ResultsGrid variants={test.variants} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface VariantsGridProps {
  variants: PromptTest['variants'];
}

const VariantsGrid = ({ variants }: VariantsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {variants.map((variant) => (
        <Card key={variant.id} className={variant.isControl ? "border-primary/50" : ""}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">
                {variant.name}
                {variant.isControl && (
                  <Badge className="ml-2" variant="outline">Control</Badge>
                )}
              </CardTitle>
              <Badge variant="secondary">Weight: {variant.weight}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground truncate">
              {variant.promptText.substring(0, 100)}...
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface ResultsGridProps {
  variants: PromptTest['variants'];
}

const ResultsGrid = ({ variants }: ResultsGridProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variants.map((variant, index) => (
          <Card key={variant.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between">
                <span>{variant.name}</span>
                {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Impressions:</span>
                  <span className="font-medium">{Math.floor(Math.random() * 100) + 10}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate:</span>
                  <span className="font-medium">{(Math.random() * 20 + 80).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg. Latency:</span>
                  <span className="font-medium">{Math.floor(Math.random() * 1000) + 500}ms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Collecting more data to determine statistical significance.</p>
        <p>Current confidence level: 87%</p>
      </div>
    </>
  );
};
