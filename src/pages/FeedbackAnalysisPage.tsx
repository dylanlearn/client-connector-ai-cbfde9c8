// Simplified version of FeedbackAnalysisPage.tsx
import React, { useEffect, useState } from 'react';
import { FeedbackAnalysisAPI } from '@/services/ai/content/feedback-analysis-api';

export default function FeedbackAnalysisPage() {
  const [analyses, setAnalyses] = useState([]);
  
  useEffect(() => {
    async function loadAnalyses() {
      try {
        // Fix the function call by removing parameters
        const data = await FeedbackAnalysisAPI.getPastAnalyses();
        setAnalyses(data);
      } catch (error) {
        console.error('Error loading analyses:', error);
      }
    }
    
    loadAnalyses();
  }, []);

  return (
    <div>
      <h1>Feedback Analyses</h1>
      {analyses.length > 0 ? (
        <ul>
          {analyses.map((analysis) => (
            <li key={analysis.id}>
              {analysis.original_feedback}: {analysis.summary}
            </li>
          ))}
        </ul>
      ) : (
        <p>No analyses available.</p>
      )}
    </div>
  );
}
