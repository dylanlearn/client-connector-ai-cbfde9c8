
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle2, XCircle, Zap, BarChart4, Layout, Type, Palette } from "lucide-react";
import { AIWireframe } from "@/services/ai/wireframe/wireframe-types";
import AIInsightCard from "@/components/ai/AIInsightCard";

interface WireframeAnalysisInsightsProps {
  wireframe: AIWireframe;
  onApplyRecommendation?: (recommendationType: string, value: any) => void;
}

/**
 * Component that analyzes a wireframe and provides actionable insights for improvement
 */
const WireframeAnalysisInsights: React.FC<WireframeAnalysisInsightsProps> = ({ 
  wireframe,
  onApplyRecommendation
}) => {
  const wireframeData = wireframe.data;
  
  if (!wireframeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wireframe Analysis</CardTitle>
          <CardDescription>No data available for analysis</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Extract insights from the wireframe structure and contents
  const {
    accessibilityInsights,
    layoutInsights,
    conversionInsights,
    typographyInsights,
    colorInsights,
    userExperienceInsights,
    mobileInsights
  } = analyzeWireframe(wireframeData);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
          Design Insights & Recommendations
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your wireframe with actionable recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="conversion">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="conversion">
              <Zap className="mr-2 h-4 w-4" />
              Conversion
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="mr-2 h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="mr-2 h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="color">
              <Palette className="mr-2 h-4 w-4" />
              Color
            </TabsTrigger>
            <TabsTrigger value="mobile">
              <BarChart4 className="mr-2 h-4 w-4" />
              Mobile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversion">
            <div className="space-y-4">
              <AIInsightCard 
                title="Conversion Rate Optimization" 
                insights={conversionInsights.recommendations}
                icon={<Zap className="h-5 w-5" />}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      What's Working Well
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      {conversionInsights.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-amber-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <XCircle className="h-4 w-4 text-amber-500 mr-2" />
                      Opportunities for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      {conversionInsights.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-amber-500">•</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {conversionInsights.quickFixes.map((fix, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary/10">
                      + {fix.label}
                    </Badge>
                  ))}
                </CardContent>
                <CardFooter className="pt-0 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onApplyRecommendation?.('conversion', { type: 'optimize-cta' })}
                  >
                    Apply Conversion Improvements
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="layout">
            <div className="space-y-4">
              <AIInsightCard 
                title="Layout Analysis" 
                insights={layoutInsights.recommendations}
                icon={<Layout className="h-5 w-5" />}
              />
              
              {/* Similar pattern for other tabs */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {layoutInsights.quickFixes.map((fix, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary/10">
                      + {fix.label}
                    </Badge>
                  ))}
                </CardContent>
                <CardFooter className="pt-0 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onApplyRecommendation?.('layout', { type: 'balance-layout' })}
                  >
                    Apply Layout Improvements
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Similar pattern for other tabs: typography, color, mobile */}
          <TabsContent value="typography">
            <AIInsightCard 
              title="Typography Analysis" 
              insights={typographyInsights.recommendations}
              icon={<Type className="h-5 w-5" />}
            />
            {/* Typography recommendations and quick actions */}
          </TabsContent>
          
          <TabsContent value="color">
            <AIInsightCard 
              title="Color Scheme Analysis" 
              insights={colorInsights.recommendations}
              icon={<Palette className="h-5 w-5" />}
            />
            {/* Color recommendations and quick actions */}
          </TabsContent>
          
          <TabsContent value="mobile">
            <AIInsightCard 
              title="Mobile Design Analysis" 
              insights={mobileInsights.recommendations}
              icon={<BarChart4 className="h-5 w-5" />}
            />
            {/* Mobile recommendations and quick actions */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

/**
 * Analyze wireframe data to extract actionable insights
 */
function analyzeWireframe(wireframeData: any) {
  // Default insights
  const conversionInsights = {
    recommendations: [
      "Add a clear, high-contrast CTA button in the hero section",
      "Include social proof elements like testimonials or trust badges",
      "Reduce form fields to only essential information",
      "Use directional cues to guide attention to conversion elements",
      "Add urgency or scarcity elements where appropriate"
    ],
    strengths: [
      "Clear value proposition in the hero section",
      "Logical information hierarchy guides users to take action"
    ],
    weaknesses: [
      "CTAs could be more visually prominent",
      "Limited social proof elements"
    ],
    quickFixes: [
      { label: "Add testimonial section", action: "add-testimonials" },
      { label: "Optimize button contrast", action: "optimize-cta" },
      { label: "Add trust badges", action: "add-trust-elements" }
    ]
  };
  
  const layoutInsights = {
    recommendations: [
      "Balance text and visual elements for better hierarchy",
      "Use whitespace more consistently between sections",
      "Apply the rule of thirds to create more visual interest",
      "Create clearer visual hierarchies through sizing",
      "Ensure content grouping follows logical user expectations"
    ],
    strengths: [
      "Good overall section structure",
      "Appropriate section ordering"
    ],
    weaknesses: [
      "Inconsistent spacing between elements",
      "Some sections feel visually crowded"
    ],
    quickFixes: [
      { label: "Balance whitespace", action: "balance-whitespace" },
      { label: "Improve content hierarchy", action: "improve-hierarchy" },
      { label: "Optimize section order", action: "optimize-order" }
    ]
  };
  
  // Additional insight categories with practical recommendations
  const typographyInsights = {
    recommendations: [
      "Use no more than 2 font families for better consistency",
      "Increase contrast between heading and body text sizes",
      "Ensure line length is 50-75 characters for readability",
      "Apply more consistent text alignment across sections",
      "Use font weight variations to create better hierarchy"
    ],
    quickFixes: []
  };
  
  const colorInsights = {
    recommendations: [
      "Use your primary color for main CTAs to maintain consistency",
      "Increase contrast ratio for better accessibility",
      "Limit accent colors to create a more cohesive experience",
      "Apply the 60-30-10 color rule for balance",
      "Use color psychology strategically for emotional impact"
    ],
    quickFixes: []
  };
  
  const userExperienceInsights = {
    recommendations: [
      "Streamline user flows to reduce cognitive load",
      "Add clear section headings for better scanability",
      "Ensure interactive elements look clickable",
      "Use consistent interaction patterns",
      "Provide clear feedback for user actions"
    ],
    quickFixes: []
  };
  
  const accessibilityInsights = {
    recommendations: [
      "Ensure color contrast meets WCAG 2.1 AA standards",
      "Add descriptive alt text for all images",
      "Structure content with proper heading hierarchy",
      "Make interactive elements keyboard accessible",
      "Design focus states for interactive elements"
    ],
    quickFixes: []
  };
  
  const mobileInsights = {
    recommendations: [
      "Simplify navigation for mobile screens",
      "Ensure touch targets are at least 44×44px",
      "Adjust typography for smaller screens",
      "Optimize images for faster mobile loading",
      "Reorder content for mobile priority"
    ],
    quickFixes: []
  };
  
  // Here we could add logic to analyze the wireframe structure
  // and generate more personalized insights
  
  return {
    conversionInsights,
    layoutInsights,
    typographyInsights,
    colorInsights,
    userExperienceInsights,
    accessibilityInsights,
    mobileInsights
  };
}

export default WireframeAnalysisInsights;
