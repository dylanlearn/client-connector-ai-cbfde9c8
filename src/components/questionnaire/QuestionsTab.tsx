
import React from "react";
import { Question } from "./QuestionItem";
import QuestionsList from "./QuestionsList";

interface QuestionsTabProps {
  questions: Question[];
  handleDragEnd: (result: any) => void;
  toggleQuestion: (id: string) => void;
  deleteQuestion: (id: string) => void;
  updateQuestion: (id: string, field: string, value: any) => void;
  addNewQuestion: () => void;
}

const QuestionsTab = ({
  questions,
  handleDragEnd,
  toggleQuestion,
  deleteQuestion,
  updateQuestion,
  addNewQuestion,
}: QuestionsTabProps) => {
  return (
    <QuestionsList
      questions={questions}
      onDragEnd={handleDragEnd}
      toggleQuestion={toggleQuestion}
      deleteQuestion={deleteQuestion}
      updateQuestion={updateQuestion}
      addNewQuestion={addNewQuestion}
    />
  );
};

export default QuestionsTab;
