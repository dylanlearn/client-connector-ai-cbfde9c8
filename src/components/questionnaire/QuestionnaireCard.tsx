
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "./ProgressBar";
import QuestionPrompt from "./QuestionPrompt";
import AIFollowUp from "./AIFollowUp";
import NavigationButtons from "./NavigationButtons";
import { QuestionItem } from "@/data/questionnaire-questions";

interface QuestionnaireCardProps {
  questions: QuestionItem[];
  currentQuestion: number;
  answers: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  aiFollowUp: string | null;
  followUpAnswer: string;
  setFollowUpAnswer: (answer: string) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  isThinking: boolean;
}

const QuestionnaireCard = ({
  questions,
  currentQuestion,
  answers,
  handleChange,
  aiFollowUp,
  followUpAnswer,
  setFollowUpAnswer,
  handleNext,
  handlePrevious,
  isThinking
}: QuestionnaireCardProps) => {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="text-center border-b pb-6">
        <div className="mb-4 flex justify-center">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-indigo-600" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <CardTitle className="text-2xl">Design Questionnaire</CardTitle>
        <CardDescription>
          Help us understand your vision so we can create the perfect design for you.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <ProgressBar 
          currentQuestion={currentQuestion} 
          totalQuestions={questions.length} 
        />

        {!aiFollowUp ? (
          <QuestionPrompt 
            question={questions[currentQuestion]}
            answer={answers[questions[currentQuestion].id] || ""}
            onChange={handleChange}
            currentQuestionIndex={currentQuestion}
          />
        ) : (
          <AIFollowUp 
            followUpQuestion={aiFollowUp}
            followUpAnswer={followUpAnswer}
            setFollowUpAnswer={setFollowUpAnswer}
          />
        )}
      </CardContent>
      
      <CardFooter>
        <NavigationButtons 
          onPrevious={handlePrevious}
          onNext={handleNext}
          isFirstQuestion={currentQuestion === 0}
          isLastQuestion={currentQuestion === questions.length - 1}
          hasFollowUp={!!aiFollowUp}
          isThinking={isThinking}
        />
      </CardFooter>
    </Card>
  );
};

export default QuestionnaireCard;
