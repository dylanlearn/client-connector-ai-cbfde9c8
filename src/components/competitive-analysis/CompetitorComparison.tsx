
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertMessage } from '@/components/ui/alert-message';
import { ArrowUp, ArrowRight, ArrowDown, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCompetitorComparisons } from '@/hooks/use-competitor-comparisons';

interface CompetitorComparisonProps {
  wireframeId?: string;
}

export function CompetitorComparison({ wireframeId }: CompetitorComparisonProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const { 
    comparisons, 
    isLoading, 
    error,
    positioningSummary 
  } = useCompetitorComparisons(wireframeId);
  
  if (error) {
    return <AlertMessage type="error" title="Error loading comparisons">{error.message}</AlertMessage>;
  }

  if (!wireframeId) {
    return (
      <AlertMessage type="warning" title="No wireframe selected">
        Please select a wireframe to view competitive comparisons.
      </AlertMessage>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Competitor Comparisons</h2>
        <Button disabled={!wireframeId}>Add Comparison</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Competitive Positioning</CardTitle>
              <CardDescription>
                Summary of how your wireframe compares to competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <ArrowUp className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-2xl font-bold">{positioningSummary?.superior || 0}</span>
                  <span className="text-sm text-muted-foreground">Superior Elements</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <ArrowRight className="h-8 w-8 text-amber-500 mb-2" />
                  <span className="text-2xl font-bold">{positioningSummary?.equal || 0}</span>
                  <span className="text-sm text-muted-foreground">Equal Elements</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <ArrowDown className="h-8 w-8 text-red-500 mb-2" />
                  <span className="text-2xl font-bold">{positioningSummary?.inferior || 0}</span>
                  <span className="text-sm text-muted-foreground">Inferior Elements</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="superior">Superior</TabsTrigger>
              <TabsTrigger value="equal">Equal</TabsTrigger>
              <TabsTrigger value="inferior">Inferior</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <ComparisonTable comparisons={comparisons} />
            </TabsContent>
            
            <TabsContent value="superior" className="mt-4">
              <ComparisonTable 
                comparisons={comparisons?.filter(c => c.rating === 'superior')} 
              />
            </TabsContent>
            
            <TabsContent value="equal" className="mt-4">
              <ComparisonTable 
                comparisons={comparisons?.filter(c => c.rating === 'equal')} 
              />
            </TabsContent>
            
            <TabsContent value="inferior" className="mt-4">
              <ComparisonTable 
                comparisons={comparisons?.filter(c => c.rating === 'inferior')} 
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

interface ComparisonTableProps {
  comparisons?: Array<any>;
}

function ComparisonTable({ comparisons }: ComparisonTableProps) {
  const getRatingBadge = (rating: string) => {
    switch(rating) {
      case 'superior':
        return <Badge className="bg-green-500">Superior</Badge>;
      case 'equal':
        return <Badge className="bg-amber-500">Equal</Badge>;
      case 'inferior':
        return <Badge className="bg-red-500">Inferior</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (!comparisons?.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No comparisons found in this category.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Element ID</th>
              <th className="text-left p-4">Competitor Element</th>
              <th className="text-left p-4">Comparison</th>
              <th className="text-left p-4">Rating</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-4">{item.element_id}</td>
                <td className="p-4">{item.competitor_element_name}</td>
                <td className="p-4 max-w-xs truncate">{item.comparison_notes}</td>
                <td className="p-4">{getRatingBadge(item.rating)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
