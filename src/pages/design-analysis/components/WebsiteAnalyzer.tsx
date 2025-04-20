
import { useState } from 'react';
import WebsiteAnalyzerHeader from "./components/WebsiteAnalyzerHeader";
import WebsiteAnalyzerForm from "./components/WebsiteAnalyzerForm";
import AnalysisResults from "./components/AnalysisResults";
import { useAuth } from "@/hooks/useAuth";
import { useWebsiteAnalysis } from '@/hooks/ai-design/useWebsiteAnalysis';

/**
 * Website Analyzer page that uses the application shell defined in App.tsx
 */
export default function WebsiteAnalyzer() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  const { 
    isAnalyzing, 
    analyzeWebsite, 
    analyzeWebsiteSection, 
    analysisResults, 
    error 
  } = useWebsiteAnalysis();

  const [activeTab, setActiveTab] = useState<'full' | 'section'>('full');

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <WebsiteAnalyzerHeader isLoggedIn={isLoggedIn} />
      
      <WebsiteAnalyzerForm 
        isAnalyzing={isAnalyzing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAnalyzeWebsite={analyzeWebsite}
        onAnalyzeWebsiteSection={analyzeWebsiteSection}
      />
      
      <AnalysisResults 
        isAnalyzing={isAnalyzing}
        analysisResults={analysisResults}
        error={error}
      />
    </div>
  );
}
