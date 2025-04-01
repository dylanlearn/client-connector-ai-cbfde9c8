
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuestionItem, { Question } from "./QuestionItem";

// Mock function to simulate beautiful-dnd since we can't install it
const mockBeautifulDnd = () => {
  return {
    DragDropContext: ({ children, onDragEnd }: any) => <div>{children}</div>,
    Droppable: ({ children }: any) => <div>{children({ innerRef: null, droppableProps: {}, placeholder: null })}</div>,
    Draggable: ({ children }: any) => <div>{children({ innerRef: null, draggableProps: {}, dragHandleProps: {} })}</div>,
  };
};

// Use mock functions since we can't actually install react-beautiful-dnd in this environment
const { DragDropContext, Droppable, Draggable } = mockBeautifulDnd();

interface QuestionsListProps {
  questions: Question[];
  onDragEnd: (result: any) => void;
  toggleQuestion: (id: string) => void;
  deleteQuestion: (id: string) => void;
  updateQuestion: (id: string, field: string, value: any) => void;
  addNewQuestion: () => void;
}

const QuestionsList = ({
  questions,
  onDragEnd,
  toggleQuestion,
  deleteQuestion,
  updateQuestion,
  addNewQuestion,
}: QuestionsListProps) => {
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided) => (
                    <QuestionItem
                      question={question}
                      provided={provided}
                      toggleQuestion={toggleQuestion}
                      deleteQuestion={deleteQuestion}
                      updateQuestion={updateQuestion}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <Button
        variant="outline"
        className="mt-6 w-full"
        onClick={addNewQuestion}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Question
      </Button>
    </div>
  );
};

export default QuestionsList;
