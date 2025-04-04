
import React, { useEffect, useState } from 'react';
import { useMemoryAnalytics } from '@/hooks/ai-memory/useMemoryAnalytics';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ChartBar, ChartPie, User, Users, TrendingUp, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import { EmbeddingSimilarityTrends } from './EmbeddingSimilarityTrends';
import { PromptHeatmap } from './PromptHeatmap';
import { BehavioralFingerprinting } from './BehavioralFingerprinting';

export function MemoryAnalytics() {
  const [activeTab, setActiveTab] = useState<string>('similarity');
  const [timeframe, setTimeframe] = useState<string>('month');
  const {
    similarityTrends,
    phraseHeatmap,
    behavioralFingerprints,
    isLoading,
    error,
    fetchSimilarityTrends,
    fetchPhraseHeatmap,
    fetchBehavioralFingerprints
  } = useMemoryAnalytics();

  useEffect(() => {
    // Initial data fetch based on active tab
    const fetchData = async () => {
      const timeframeDate = getTimeframeDate(timeframe);
      
      switch (activeTab) {
        case 'similarity':
          await fetchSimilarityTrends({
            timeframe: { from: timeframeDate }
          });
          break;
        case 'heatmap':
          await fetchPhraseHeatmap({
            timeRange: { from: timeframeDate }
          });
          break;
        case 'fingerprints':
          await fetchBehavioralFingerprints({
            includeGlobalPatterns: true
          });
          break;
      }
    };
    
    fetchData();
  }, [activeTab, timeframe, fetchSimilarityTrends, fetchPhraseHeatmap, fetchBehavioralFingerprints]);

  const handleRefresh = async () => {
    const timeframeDate = getTimeframeDate(timeframe);
    
    switch (activeTab) {
      case 'similarity':
        await fetchSimilarityTrends({
          timeframe: { from: timeframeDate }
        });
        break;
      case 'heatmap':
        await fetchPhraseHeatmap({
          timeRange: { from: timeframeDate }
        });
        break;
      case 'fingerprints':
        await fetchBehavioralFingerprints();
        break;
    }
  };

  const getTimeframeDate = (timeframe: string): Date => {
    const now = new Date();
    switch (timeframe) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setMonth(now.getMonth() - 1)); // Default to 1 month
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Memory System Analytics</CardTitle>
          <CardDescription>
            Advanced analysis of memory patterns, semantic clusters, and user behavior
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading.trends || isLoading.heatmap || isLoading.fingerprints}>
            {(isLoading.trends || isLoading.heatmap || isLoading.fingerprints) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Refresh'
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="similarity" className="flex items-center gap-1">
              <ChartPie className="h-4 w-4" />
              <span>Similarity Trends</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-1">
              <ChartBar className="h-4 w-4" />
              <span>Prompt Heatmaps</span>
            </TabsTrigger>
            <TabsTrigger value="fingerprints" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Behavioral Fingerprinting</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="similarity" className="mt-4">
            <EmbeddingSimilarityTrends 
              data={similarityTrends}
              isLoading={isLoading.trends}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="heatmap" className="mt-4">
            <PromptHeatmap 
              data={phraseHeatmap}
              isLoading={isLoading.heatmap}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="fingerprints" className="mt-4">
            <BehavioralFingerprinting 
              data={behavioralFingerprints}
              isLoading={isLoading.fingerprints}
              error={error}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
