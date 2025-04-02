
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Answer {
  question: string;
  answer: string;
  followup?: string;
}

interface AnswersTabProps {
  answers: Answer[];
}

const AnswersTab = ({ answers }: AnswersTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Questionnaire Answers</CardTitle>
        <CardDescription>
          Complete responses from the client, including AI follow-up questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {answers.map((item, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="font-medium">{item.question}</h3>
              </div>
              <div className="p-4">
                <p className="whitespace-pre-line">{item.answer}</p>
                
                {item.followup && (
                  <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-1 rounded-full">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-indigo-600" fill="currentColor">
                          <path d="M19.044 7.921c0 2.935-2.377 5.313-5.313 5.313s-5.313-2.378-5.313-5.313c0-2.936 2.377-5.314 5.313-5.314s5.313 2.378 5.313 5.314zm-13.698 12.47h16.812c-1.692-3.604-6.558-6.25-8.405-6.25-1.846 0-6.713 2.646-8.407 6.25z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-indigo-500 mb-1">AI Follow-up</p>
                        <p className="text-sm text-indigo-900">{item.followup}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswersTab;
