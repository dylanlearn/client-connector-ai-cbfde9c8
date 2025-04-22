
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { toast } from 'sonner';

interface DesignDecision {
  id: string;
  title: string;
  rationale: string;
  impact: 'Low' | 'Medium' | 'High';
  tradeoffs: string[];
}

export function useDesignDecisions(
  wireframe: WireframeData,
  onUpdateWireframe?: (updated: WireframeData) => void
) {
  const [decisions, setDecisions] = useState<DesignDecision[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      // Here we'd integrate with an AI service to analyze the design decisions
      // For now, using mock data
      const mockDecisions: DesignDecision[] = [
        {
          id: '1',
          title: 'Hero Section Layout',
          rationale: 'The current centered layout with large imagery maximizes visual impact and directs focus to the main value proposition.',
          impact: 'High',
          tradeoffs: [
            'Improved visual hierarchy',
            'Reduced above-the-fold content density'
          ]
        },
        {
          id: '2',
          title: 'Navigation Structure',
          rationale: 'The simplified navigation menu improves usability while maintaining access to key sections.',
          impact: 'Medium',
          tradeoffs: [
            'Better mobile responsiveness',
            'Limited secondary navigation options'
          ]
        }
      ];

      setDecisions(mockDecisions);
      toast.success('Design analysis complete');
    } catch (error) {
      toast.error('Error analyzing design decisions');
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const provideFeedback = useCallback((decisionId: string, feedback: 'positive' | 'negative') => {
    // Here we'd typically send the feedback to a learning system
    toast.success('Thank you for your feedback');
  }, []);

  return {
    decisions,
    analyzing,
    analyze,
    provideFeedback
  };
}
