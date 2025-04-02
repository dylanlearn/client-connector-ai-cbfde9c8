
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AIReadinessScore = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Readiness Score</CardTitle>
        <CardDescription>
          How complete and actionable the client's input is.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center rounded-full w-24 h-24 border-8 border-indigo-500 mb-2">
            <span className="text-3xl font-bold">85%</span>
          </div>
          <p className="font-medium text-lg">Very Good</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Clarity of Purpose</span>
              <span className="font-medium">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Audience Definition</span>
              <span className="font-medium">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Visual References</span>
              <span className="font-medium">80%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Brand Elements</span>
              <span className="font-medium">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-medium text-indigo-700 mb-2">AI Recommendation</h4>
          <p className="text-sm text-indigo-900">
            This client provided strong inputs for overall goals and audience. Consider asking for more specific 
            brand assets like logos and typography guidelines before proceeding.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIReadinessScore;
