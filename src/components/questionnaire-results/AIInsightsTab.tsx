
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, MessageSquare, Lightbulb, Zap, BarChart } from "lucide-react";
import AIChat from "@/components/ai/AIChat";
import AIAnalysisSummary from "@/components/ai/AIAnalysisSummary";
import AIInsightCard from "@/components/ai/AIInsightCard";
import { AIAnalysis } from "@/types/ai";
import WireframeAnalysisInsights from "@/components/ai/WireframeAnalysisInsights";

interface AIInsightsTabProps {
  isProcessing: boolean;
  analysis: AIAnalysis | null;
  wireframeId?: string;
}

const AIInsightsTab = ({ isProcessing, analysis, wireframeId }: AIInsightsTabProps) => {
  const [activeTab, setActiveTab] = useState('summary');

  if (isProcessing) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full animate-spin" style={{ borderTopColor: 'transparent' }}></div>
          </div>
          <h3 className="text-xl font-medium mb-2">AI Processing Responses</h3>
          <p className="text-gray-500 text-center max-w-md">
            Our AI is analyzing client responses to generate insights and recommendations.
            This should only take a moment.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="summary">
            <Lightbulb className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="design">
            <Layout className="h-4 w-4 mr-2" />
            Design Recs
          </TabsTrigger>
          <TabsTrigger value="conversion">
            <Zap className="h-4 w-4 mr-2" />
            Conversion
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis && (
              <AIAnalysisSummary analysis={analysis} />
            )}
            
            <AIInsightCard 
              title="Design Recommendations" 
              insights={[
                "Use large hero sections with clear CTAs",
                "Incorporate visual elements that reinforce trust and reliability",
                "Focus on clear typography with good readability",
                "Use color accents strategically to highlight key elements",
                "Include visual explanations for complex features"
              ]} 
              icon={<Layout className="h-5 w-5" />}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="design">
          <div className="grid grid-cols-1 gap-6">
            <AIInsightCard 
              title="Layout Recommendations" 
              insights={[
                "Use Z-pattern layout for homepage to guide eye movement naturally",
                "Implement sticky navigation to improve site-wide accessibility",
                "Keep important content above the fold, especially on mobile",
                "Maintain consistent spacing and alignment across all sections",
                "Utilize card-based layouts for feature presentations"
              ]} 
              icon={<Layout className="h-5 w-5" />}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIInsightCard 
                title="Color & Typography" 
                insights={[
                  "Use a strong color contrast ratio (min 4.5:1) for text legibility",
                  "Implement a modular type scale with clear hierarchy",
                  "Select fonts that align with the brand's personality",
                  "Limit color palette to primary, secondary, and 1-2 accent colors",
                  "Use color to highlight important elements and actions"
                ]} 
                icon={<Layout className="h-5 w-5" />}
              />
              
              <AIInsightCard 
                title="Component Recommendations" 
                insights={[
                  "Implement floating labels for form fields to save space",
                  "Use skeleton screens during loading for better UX",
                  "Add micro-interactions on hover states for visual feedback",
                  "Implement toast notifications for system feedback",
                  "Design mobile-optimized dropdown menus and navigation"
                ]} 
                icon={<Layout className="h-5 w-5" />}
              />
            </div>
            
            {wireframeId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                    Advanced Wireframe Analysis
                  </CardTitle>
                  <CardDescription>
                    In-depth analysis and optimization recommendations for your wireframe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Our AI has analyzed your wireframe structure and identified several opportunities for improvement:
                  </p>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <AIInsightCard 
                      title="Industry-Specific Recommendations" 
                      insights={[
                        "Add testimonials section with photos for increased credibility",
                        "Implement a clear pricing table with feature comparison",
                        "Use social proof elements in the hero section",
                        "Add a FAQ section with common objections addressed",
                        "Include a clear, benefit-focused value proposition"
                      ]} 
                      icon={<Zap className="h-5 w-5" />}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="conversion">
          <div className="grid grid-cols-1 gap-6">
            <AIInsightCard 
              title="Conversion Optimization" 
              insights={[
                "Use directional cues to guide attention toward primary CTAs",
                "Implement exit-intent strategies to reduce bounce rates",
                "Add urgency elements like limited-time offers where appropriate",
                "Use social proof near conversion points to reduce friction",
                "Simplify checkout process with progress indicators"
              ]} 
              icon={<Zap className="h-5 w-5" />}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIInsightCard 
                title="Call-to-Action Optimization" 
                insights={[
                  "Use action-oriented button text (\"Get Started\" vs \"Submit\")",
                  "Ensure CTA buttons have high color contrast",
                  "Maintain consistent CTA styling throughout the site",
                  "Place primary CTAs above the fold on key pages",
                  "Test different CTA placements for optimal performance"
                ]} 
                icon={<Zap className="h-5 w-5" />}
              />
              
              <AIInsightCard 
                title="Form Optimization" 
                insights={[
                  "Reduce form fields to only essential information",
                  "Use inline validation with helpful error messages",
                  "Implement autofill where possible to reduce friction",
                  "Break long forms into multi-step processes",
                  "Add benefit-focused microcopy near form fields"
                ]} 
                icon={<Zap className="h-5 w-5" />}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 gap-6">
            <AIInsightCard 
              title="Analytics Implementation" 
              insights={[
                "Set up key conversion tracking for all primary CTAs",
                "Implement heat mapping to identify user engagement areas",
                "Create goal funnels for main conversion paths",
                "Track scroll depth to measure content engagement",
                "Set up A/B testing infrastructure for ongoing optimization"
              ]} 
              icon={<BarChart className="h-5 w-5" />}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIInsightCard 
                title="Key Metrics to Track" 
                insights={[
                  "Conversion rate by traffic source and device",
                  "Average time on page for key landing pages",
                  "Click-through rate on primary CTAs",
                  "Form abandonment rates and drop-off points",
                  "User flow through key conversion paths"
                ]} 
                icon={<BarChart className="h-5 w-5" />}
              />
              
              <AIInsightCard 
                title="Optimization Strategy" 
                insights={[
                  "Implement regular A/B testing of key landing pages",
                  "Review heat maps quarterly to identify UX improvements",
                  "Conduct user testing sessions with ideal customer profiles",
                  "Analyze drop-off points and optimize problem areas",
                  "Compare performance metrics against industry benchmarks"
                ]} 
                icon={<BarChart className="h-5 w-5" />}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            AI Design Assistant
          </CardTitle>
          <CardDescription>
            Ask follow-up questions about design recommendations or get specific suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIChat 
            title="" 
            placeholder="Ask a question about design recommendations or best practices..."
            initialMessage="I've analyzed the client's responses and generated design recommendations. You can ask me specific questions about:

1. Layout structures that would work well
2. Color palette recommendations based on client preferences
3. Typography suggestions for this type of site
4. Component recommendations for their specific needs
5. Conversion optimization strategies

What specific design aspects would you like me to help with?"
            className="border-0 shadow-none p-0"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsTab;
