
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import QuestionsTab from "./QuestionsTab";
import SettingsTab from "./SettingsTab";
import { Question } from "./QuestionItem";

interface QuestionnaireSetupProps {
  questions: Question[];
  handleDragEnd: (result: any) => void;
  toggleQuestion: (id: string) => void;
  deleteQuestion: (id: string) => void;
  updateQuestion: (id: string, field: string, value: any) => void;
  addNewQuestion: () => void;
  isLoading: boolean;
  handleSave: () => Promise<void>;
}

const QuestionnaireSetup = ({
  questions,
  handleDragEnd,
  toggleQuestion,
  deleteQuestion,
  updateQuestion,
  addNewQuestion,
  isLoading,
  handleSave,
}: QuestionnaireSetupProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Questionnaire Setup</CardTitle>
        <CardDescription>
          Drag and drop to reorder questions. Toggle to enable/disable them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="questions">
          <TabsList className="mb-6">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions">
            <QuestionsTab
              questions={questions}
              handleDragEnd={handleDragEnd}
              toggleQuestion={toggleQuestion}
              deleteQuestion={deleteQuestion}
              updateQuestion={updateQuestion}
              addNewQuestion={addNewQuestion}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save & Preview"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionnaireSetup;
