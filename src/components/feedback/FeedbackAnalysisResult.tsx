
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Clock, HelpCircle, AlertCircle, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { FeedbackAnalysisResult } from "@/services/ai/content/feedback-analysis-service";
import { toast } from "sonner";

interface FeedbackAnalysisCardProps {
  result: FeedbackAnalysisResult;
  onExport?: () => void;
}

const FeedbackAnalysisCard = ({ result, onExport }: FeedbackAnalysisCardProps) => {
  const { actionItems, toneAnalysis, summary } = result;
  
  const handleCopyToClipboard = () => {
    const text = actionItems.map(item => `- [${item.priority.toUpperCase()}] ${item.task}`).join('\n');
    navigator.clipboard.writeText(text);
    toast.success("To-do list copied to clipboard");
  };
  
  // Determine overall tone badge
  const getToneBadge = () => {
    if (toneAnalysis.urgent) {
      return <Badge className="bg-red-500 text-white">Urgent</Badge>;
    } else if (toneAnalysis.critical) {
      return <Badge className="bg-orange-500 text-white">Critical</Badge>;
    } else if (toneAnalysis.vague) {
      return <Badge className="bg-yellow-500 text-white">Vague</Badge>;
    } else if (toneAnalysis.positive > 0.6) {
      return <Badge className="bg-green-500 text-white">Positive</Badge>;
    } else if (toneAnalysis.negative > 0.6) {
      return <Badge className="bg-red-400 text-white">Negative</Badge>;
    } else {
      return <Badge className="bg-gray-500 text-white">Neutral</Badge>;
    }
  };
  
  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Feedback Analysis</CardTitle>
          {getToneBadge()}
        </div>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sentiment Analysis */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Sentiment Analysis</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Positive</span>
                <span>{Math.round(toneAnalysis.positive * 100)}%</span>
              </div>
              <Progress value={toneAnalysis.positive * 100} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Neutral</span>
                <span>{Math.round(toneAnalysis.neutral * 100)}%</span>
              </div>
              <Progress value={toneAnalysis.neutral * 100} className="h-2 bg-gray-200" indicatorClassName="bg-blue-500" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Negative</span>
                <span>{Math.round(toneAnalysis.negative * 100)}%</span>
              </div>
              <Progress value={toneAnalysis.negative * 100} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Tone Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className={`flex items-center p-3 rounded-lg ${toneAnalysis.urgent ? 'bg-red-50' : 'bg-gray-50'}`}>
            <Clock className={`w-5 h-5 mr-2 ${toneAnalysis.urgent ? 'text-red-500' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium">Urgency</p>
              <p className="text-xs">{toneAnalysis.urgent ? 'Time-sensitive' : 'Not urgent'}</p>
            </div>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${toneAnalysis.vague ? 'bg-yellow-50' : 'bg-gray-50'}`}>
            <HelpCircle className={`w-5 h-5 mr-2 ${toneAnalysis.vague ? 'text-yellow-500' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium">Clarity</p>
              <p className="text-xs">{toneAnalysis.vague ? 'Needs clarification' : 'Clear feedback'}</p>
            </div>
          </div>
          
          <div className={`flex items-center p-3 rounded-lg ${toneAnalysis.critical ? 'bg-orange-50' : 'bg-gray-50'}`}>
            <AlertCircle className={`w-5 h-5 mr-2 ${toneAnalysis.critical ? 'text-orange-500' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium">Criticality</p>
              <p className="text-xs">{toneAnalysis.critical ? 'Critical issues' : 'Standard feedback'}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Action Items */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Action Items ({actionItems.length})</h3>
            <Button size="sm" variant="outline" onClick={handleCopyToClipboard}>
              <ClipboardCheck className="h-4 w-4 mr-1" />
              Copy as To-do
            </Button>
          </div>
          
          <div className="space-y-2">
            {actionItems.map((item, index) => (
              <div key={index} className="flex items-start p-3 border rounded-lg">
                {item.priority === 'high' ? (
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                ) : item.priority === 'medium' ? (
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{item.task}</p>
                    <Badge className={
                      item.priority === 'high' 
                        ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                        : item.priority === 'medium' 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' 
                          : 'bg-green-100 text-green-800 hover:bg-green-100'
                    }>
                      {item.priority}
                    </Badge>
                  </div>
                  
                  {item.urgency > 70 && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        Urgency: {item.urgency}%
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {onExport && (
          <div className="flex justify-end">
            <Button onClick={onExport}>
              Export to Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackAnalysisCard;
