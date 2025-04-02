
import { Lightbulb, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConversionInsights = () => {
  const insights = [
    {
      text: "Users who engage with the feature comparison section are 2.4x more likely to convert.",
      impact: "high"
    },
    {
      text: "Mobile users drop off at the form page 32% more frequently than desktop users.",
      impact: "medium"
    },
    {
      text: "Adding social proof immediately before CTA increased click-through rate by 18%.",
      impact: "high"
    },
    {
      text: "Users spend an average of 45 seconds on the pricing page before making a decision.",
      impact: "low"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm font-medium mb-2">
        <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
        <span>AI-Generated Insights</span>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="text-sm">
            <div className={`p-2 rounded-md border ${getImpactColor(insight.impact)}`}>
              {insight.text}
            </div>
            <div className="flex justify-end items-center mt-1 space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsUp className="h-3 w-3 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2 text-xs text-center text-muted-foreground">
        <p>AI evaluates conversion data to generate these insights. Feedback helps improve future recommendations.</p>
      </div>
    </div>
  );
};

export default ConversionInsights;
