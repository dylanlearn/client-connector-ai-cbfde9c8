
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { questions } from "@/data/questionnaire-questions";
import { generateFollowUp } from "@/utils/questionnaire-utils";
import QuestionnaireCard from "@/components/questionnaire/QuestionnaireCard";

const QuestionnairePreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiFollowUp, setAiFollowUp] = useState<string | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleNext = () => {
    const question = questions[currentQuestion];
    
    // Check if required question is answered
    if (question.required && !answers[question.id]) {
      toast({
        title: "Required field",
        description: "Please answer this question before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Check if current answer needs AI follow-up
    if (
      answers[question.id] &&
      !aiFollowUp &&
      currentQuestion < questions.length - 1
    ) {
      setIsThinking(true);
      
      // Simulate AI thinking and generating a follow-up
      setTimeout(() => {
        setIsThinking(false);
        const followUpQuestion = generateFollowUp(question.id, answers[question.id]);
        if (followUpQuestion) {
          setAiFollowUp(followUpQuestion);
        } else {
          moveToNextQuestion();
        }
      }, 1500);
      
      return;
    }

    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    // Move to next question or finish
    if (aiFollowUp) {
      // Save follow-up answer and clear for next question
      setAnswers({
        ...answers,
        [`${questions[currentQuestion].id}_followup`]: followUpAnswer,
      });
      setAiFollowUp(null);
      setFollowUpAnswer("");
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate("/questionnaire-results");
    }
  };

  const handlePrevious = () => {
    if (aiFollowUp) {
      setAiFollowUp(null);
      setFollowUpAnswer("");
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <QuestionnaireCard
        questions={questions}
        currentQuestion={currentQuestion}
        answers={answers}
        handleChange={handleChange}
        aiFollowUp={aiFollowUp}
        followUpAnswer={followUpAnswer}
        setFollowUpAnswer={setFollowUpAnswer}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        isThinking={isThinking}
      />
    </div>
  );
};

export default QuestionnairePreview;
