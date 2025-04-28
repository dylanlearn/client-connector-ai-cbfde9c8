
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CulturalContext } from '@/components/device-adaptation/DeviceContextAdapter';
import { Badge } from '@/components/ui/badge';

interface CulturalDesignAdapterProps {
  className?: string;
  culturalContext: CulturalContext | null;
}

export function CulturalDesignAdapter({ className, culturalContext }: CulturalDesignAdapterProps) {
  // These would come from a real API/database in a production app
  const adaptationExamples = {
    'North American': [
      { element: 'Buttons', adaptation: 'Standard size, prominent CTA' },
      { element: 'Color', adaptation: 'Blue for trust, red for errors' },
      { element: 'Layout', adaptation: 'Clear hierarchy, moderate white space' }
    ],
    'East Asian': [
      { element: 'Buttons', adaptation: 'Slightly smaller, detailed icons' },
      { element: 'Color', adaptation: 'Red for prosperity, gold for success' },
      { element: 'Layout', adaptation: 'Higher information density, grid layouts' }
    ],
    'Middle Eastern': [
      { element: 'Buttons', adaptation: 'Right-aligned, mirrored layout' },
      { element: 'Color', adaptation: 'Green for importance, gold accents' },
      { element: 'Layout', adaptation: 'Right-to-left flow, decorative elements' }
    ],
    'European': [
      { element: 'Buttons', adaptation: 'Minimalist, subtle hover effects' },
      { element: 'Color', adaptation: 'Navy for professionalism, neutral tones' },
      { element: 'Layout', adaptation: 'Generous white space, clean lines' }
    ],
    'South Asian': [
      { element: 'Buttons', adaptation: 'Vibrant colors, clear borders' },
      { element: 'Color', adaptation: 'Orange for energy, green accents' },
      { element: 'Layout', adaptation: 'Rich visuals, complex patterns' }
    ]
  };

  const getAdaptationsForCulture = (cultureName: string) => {
    return adaptationExamples[cultureName as keyof typeof adaptationExamples] || [];
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Cultural Design Adaptation</CardTitle>
      </CardHeader>
      <CardContent>
        {!culturalContext ? (
          <div className="text-center py-6 text-muted-foreground">
            Select a cultural context to see design adaptations
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{culturalContext.name}</h3>
              <Badge variant="outline">{culturalContext.reading_direction === 'rtl' ? 'RTL' : 
                culturalContext.reading_direction === 'ttb' ? 'TTB' : 'LTR'}</Badge>
            </div>
            
            <div className="space-y-3">
              {getAdaptationsForCulture(culturalContext.name).map((item, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="font-medium">{item.element}</div>
                  <div className="text-sm text-muted-foreground">{item.adaptation}</div>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground pt-2">
              <p>Region: {culturalContext.region}</p>
              {culturalContext.language && <p>Primary Language: {culturalContext.language}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
