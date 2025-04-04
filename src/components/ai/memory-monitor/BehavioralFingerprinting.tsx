
import React from 'react';
import { BehavioralFingerprint } from '@/hooks/ai-memory/useMemoryAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Loader2, AlertCircle, TrendingUp, Layers, Grid3x3, Grid2x2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface BehavioralFingerprintingProps {
  data: BehavioralFingerprint[];
  isLoading: boolean;
  error: Error | null;
}

export function BehavioralFingerprinting({ data, isLoading, error }: BehavioralFingerprintingProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Analyzing behavioral patterns...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load behavioral fingerprints: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          No behavioral fingerprinting data is available. Try changing your filters or adding more interactions.
        </AlertDescription>
      </Alert>
    );
  }

  // Prepare radar chart data
  const radarData = data.map(fingerprint => ({
    subject: fingerprint.name,
    value: fingerprint.strength * 100,
    type: fingerprint.type
  }));

  // Generate colors for fingerprints
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'interaction': return '#3b82f6'; // blue
      case 'navigation': return '#10b981'; // green
      case 'content': return '#8b5cf6'; // purple
      case 'global': return '#f97316'; // orange
      default: return '#64748b'; // slate
    }
  };

  // Get the icon for the fingerprint type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interaction': return <Grid2x2 className="h-4 w-4" />;
      case 'navigation': return <TrendingUp className="h-4 w-4" />;
      case 'content': return <Layers className="h-4 w-4" />;
      case 'global': return <Grid3x3 className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Fingerprints
              </CardTitle>
            </div>
            <CardDescription>
              Behavioral patterns that define user interaction styles
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Strength']} 
                  />
                  <Radar
                    name="Behavioral Pattern"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Grid3x3 className="h-5 w-5 mr-2" />
                Behavioral Patterns
              </CardTitle>
            </div>
            <CardDescription>
              Detailed behavioral patterns identified in memory
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[300px]">
              {data.map((fingerprint, i) => (
                <div key={i} className="mb-6 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium flex items-center">
                      {getTypeIcon(fingerprint.type)}
                      <span className="ml-2">{fingerprint.name}</span>
                    </h4>
                    <Badge 
                      style={{ backgroundColor: getTypeColor(fingerprint.type) }}
                    >
                      {fingerprint.type}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Strength</span>
                      <span>{(fingerprint.strength * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={fingerprint.strength * 100} />
                  </div>
                  
                  <div className="space-y-2 mt-3">
                    {fingerprint.patterns.map((pattern, j) => (
                      <div key={j} className="border rounded-md p-2">
                        {pattern.element && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Element:</span>
                            <span>{pattern.element}</span>
                          </div>
                        )}
                        {pattern.page && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Page:</span>
                            <span>{pattern.page}</span>
                          </div>
                        )}
                        {pattern.category && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Category:</span>
                            <span>{pattern.category}</span>
                          </div>
                        )}
                        {pattern.count !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Count:</span>
                            <span>{pattern.count}</span>
                          </div>
                        )}
                        {pattern.frequency !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Frequency:</span>
                            <span>{(pattern.frequency * 100).toFixed(1)}%</span>
                          </div>
                        )}
                        {pattern.global_pattern && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Global Pattern:</span>
                            <span className="text-right">{pattern.global_pattern.substring(0, 30)}...</span>
                          </div>
                        )}
                        {pattern.user_alignment !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Alignment:</span>
                            <span>{(pattern.user_alignment * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
