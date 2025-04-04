
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useFeedbackAnalysis } from '@/hooks/use-feedback-analysis';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AlertTriangle, Check, Clock, Loader2 } from 'lucide-react';

export default function FeedbackAnalysisPage() {
  const [feedbackText, setFeedbackText] = useState('');
  const { 
    analyzeFeedback, 
    isAnalyzing, 
    analysisResult, 
    getOverallSentiment, 
    resetAnalysis 
  } = useFeedbackAnalysis();

  const handleAnalyze = async () => {
    if (!feedbackText.trim()) return;
    await analyzeFeedback(feedbackText);
  };

  const handleReset = () => {
    setFeedbackText('');
    resetAnalysis();
  };

  const getSentimentColor = () => {
    const sentiment = getOverallSentiment();
    if (sentiment === 'positive') return 'bg-green-100 text-green-800';
    if (sentiment === 'negative') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-8">
        <h1 className="text-3xl font-bold mb-6">Feedback Analysis</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyze Client Feedback</CardTitle>
            <CardDescription>
              Paste client feedback to extract actionable insights, sentiment analysis, and prioritized tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Paste client feedback here..."
              className="min-h-[150px]"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              disabled={isAnalyzing}
            />
            <div className="flex gap-2">
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !feedbackText.trim()}>
                {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Feedback'}
              </Button>
              <Button variant="outline" onClick={handleReset} disabled={isAnalyzing}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysisResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Analysis Summary</span>
                  <Badge className={getSentimentColor()}>
                    {getOverallSentiment()?.toUpperCase()}
                  </Badge>
                </CardTitle>
                <CardDescription>{analysisResult.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-4">
                  {analysisResult.toneAnalysis.urgent && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Urgent
                    </Badge>
                  )}
                  {analysisResult.toneAnalysis.critical && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Critical
                    </Badge>
                  )}
                  {analysisResult.toneAnalysis.vague && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Vague
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-600 mb-1">Positive</span>
                    <span className="text-2xl font-semibold text-green-600">
                      {Math.round(analysisResult.toneAnalysis.positive * 100)}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-600 mb-1">Neutral</span>
                    <span className="text-2xl font-semibold text-blue-600">
                      {Math.round(analysisResult.toneAnalysis.neutral * 100)}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-red-600 mb-1">Negative</span>
                    <span className="text-2xl font-semibold text-red-600">
                      {Math.round(analysisResult.toneAnalysis.negative * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="high">High Priority</TabsTrigger>
                <TabsTrigger value="medium">Medium Priority</TabsTrigger>
                <TabsTrigger value="low">Low Priority</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <ActionItemsList items={analysisResult.actionItems} />
              </TabsContent>
              
              <TabsContent value="high" className="mt-4">
                <ActionItemsList 
                  items={analysisResult.actionItems.filter(item => item.priority === 'high')} 
                  emptyMessage="No high priority items found"
                />
              </TabsContent>
              
              <TabsContent value="medium" className="mt-4">
                <ActionItemsList 
                  items={analysisResult.actionItems.filter(item => item.priority === 'medium')}
                  emptyMessage="No medium priority items found"
                />
              </TabsContent>
              
              <TabsContent value="low" className="mt-4">
                <ActionItemsList 
                  items={analysisResult.actionItems.filter(item => item.priority === 'low')}
                  emptyMessage="No low priority items found"
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

interface ActionItemsListProps {
  items: Array<{
    task: string;
    priority: 'high' | 'medium' | 'low';
    urgency: number;
  }>;
  emptyMessage?: string;
}

function ActionItemsList({ items, emptyMessage = "No action items found" }: ActionItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'low': return <Check className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-lg border flex items-start ${getPriorityClass(item.priority)}`}
        >
          <div className="mr-3 mt-1">
            {getPriorityIcon(item.priority)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{item.task}</div>
            <div className="flex items-center mt-2 text-sm">
              <Badge variant="outline" className="mr-2">
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Badge>
              <div className="text-sm text-gray-500">
                Urgency: {item.urgency}/100
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
