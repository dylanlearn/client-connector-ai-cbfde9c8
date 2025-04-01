
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIAnalysis } from "@/contexts/AIContext";
import { MessageSquare, Zap, Smile, Frown } from "lucide-react";

interface AIAnalysisSummaryProps {
  analysis: AIAnalysis;
  className?: string;
}

const AIAnalysisSummary = ({ analysis, className = "" }: AIAnalysisSummaryProps) => {
  if (!analysis) return null;

  const { toneAnalysis, clarity, keyInsights } = analysis;

  // Calculate emotional tone dominance
  const dominantTone = toneAnalysis
    ? Object.entries(toneAnalysis).reduce(
        (max, [tone, value]) => (value > max.value ? { tone, value } : max),
        { tone: "", value: 0 }
      ).tone
    : "";

  const getToneEmoji = () => {
    switch (dominantTone) {
      case "formal":
        return "📊";
      case "casual":
        return "😊";
      case "professional":
        return "👔";
      case "friendly":
        return "👋";
      default:
        return "📝";
    }
  };

  const getClarityDescription = () => {
    if (!clarity) return "Not analyzed";
    if (clarity > 0.8) return "Excellent";
    if (clarity > 0.6) return "Good";
    if (clarity > 0.4) return "Average";
    return "Needs improvement";
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          AI Analysis Summary
        </CardTitle>
        <CardDescription>
          Based on client responses and communication style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {toneAnalysis && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Smile className="h-4 w-4 text-amber-500" />
              Tone Analysis{" "}
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {getToneEmoji()} {dominantTone.charAt(0).toUpperCase() + dominantTone.slice(1)}
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(toneAnalysis).map(([tone, value]) => (
                <div key={tone} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{tone.charAt(0).toUpperCase() + tone.slice(1)}</span>
                    <span className="font-medium">{Math.round(value * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${value * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {clarity !== undefined && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Response Clarity
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{getClarityDescription()}</span>
                <span className="font-medium">{Math.round(clarity * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    clarity > 0.7
                      ? "bg-green-500"
                      : clarity > 0.4
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${clarity * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {keyInsights && keyInsights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Key Insights
            </h4>
            <ul className="space-y-1.5 text-sm">
              {keyInsights.map((insight, index) => (
                <li key={index} className="flex gap-2">
                  <div className="text-amber-500 flex-shrink-0">•</div>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisSummary;
