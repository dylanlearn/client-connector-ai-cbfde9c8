
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AIEnhancementCard = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>AI Enhancement</CardTitle>
        <CardDescription>
          How our AI will work with your questionnaire
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-medium text-indigo-700 mb-2">Dynamic Questions</h4>
          <p className="text-sm text-indigo-900">
            Our AI analyzes client responses in real-time to ask relevant follow-up questions.
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-700 mb-2">Clarification Requests</h4>
          <p className="text-sm text-purple-900">
            When clients give vague answers, AI will ask for more specific information.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-700 mb-2">Style Detection</h4>
          <p className="text-sm text-blue-900">
            AI analyzes language patterns to determine brand voice and design preferences.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIEnhancementCard;
