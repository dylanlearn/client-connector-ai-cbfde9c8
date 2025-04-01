import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Send, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const questions = [
  {
    id: "q1",
    question: "What is the main purpose of your website?",
    type: "text",
    required: true,
  },
  {
    id: "q2",
    question: "Who is your target audience?",
    type: "text",
    required: true,
  },
  {
    id: "q3",
    question: "What are the main goals you want to achieve with this website?",
    type: "text",
    required: true,
  },
  {
    id: "q4",
    question: "List 3-5 websites that you like the style of and explain why.",
    type: "text",
    required: true,
  },
  {
    id: "q5",
    question: "What are your brand colors? Please provide hex codes if available.",
    type: "text",
    required: false,
  },
];

const generateFollowUp = (questionId: string, answer: string): string | null => {
  if (!answer || answer.length > 50) return null;
  
  // Simple content-based follow-ups
  if (questionId === "q1") {
    if (answer.toLowerCase().includes("ecommerce") || answer.toLowerCase().includes("shop")) {
      return "Could you specify what kind of products you'll be selling and if you have any specific requirements for the shopping experience?";
    }
    return "Could you elaborate on the specific functions or features your website should have to fulfill this purpose?";
  } 
  
  if (questionId === "q2") {
    if (answer.toLowerCase().includes("everyone") || answer.toLowerCase().includes("all")) {
      return "Targeting everyone often means reaching no one effectively. Could you specify the primary demographics or user groups that would most benefit from your product/service?";
    }
    return "What are the specific needs or pain points of this target audience that your website should address?";
  }
  
  if (questionId === "q3") {
    return "Which of these goals would you consider your top priority, and how would you measure success?";
  }
  
  if (questionId === "q4") {
    return "For these websites you like, are there specific sections or features that you particularly want to emulate?";
  }
  
  return null;
};

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
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${(currentQuestion / (questions.length - 1)) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-500">
              <span>Start</span>
              <span>{currentQuestion + 1} of {questions.length}</span>
              <span>Complete</span>
            </div>
          </div>

          {!aiFollowUp ? (
            <div className="space-y-4">
              <Label htmlFor={`question-${currentQuestion}`} className="text-lg font-medium">
                {questions[currentQuestion].question}
                {questions[currentQuestion].required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              <Textarea
                id={`question-${currentQuestion}`}
                value={answers[questions[currentQuestion].id] || ""}
                onChange={handleChange}
                placeholder="Your answer..."
                rows={5}
                className="w-full"
              />
              
              {currentQuestion === 3 && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    <span className="font-medium">Tip:</span> Including specific details about what 
                    you like (colors, layout, typography) will help us better understand your preferences.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-600" fill="currentColor">
                      <path d="M19.044 7.921c0 2.935-2.377 5.313-5.313 5.313s-5.313-2.378-5.313-5.313c0-2.936 2.377-5.314 5.313-5.314s5.313 2.378 5.313 5.314zm-13.698 12.47h16.812c-1.692-3.604-6.558-6.25-8.405-6.25-1.846 0-6.713 2.646-8.407 6.25z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-500 mb-1">AI Assistant</p>
                    <p className="text-sm text-indigo-900">{aiFollowUp}</p>
                  </div>
                </div>
              </div>
              
              <Textarea
                value={followUpAnswer}
                onChange={(e) => setFollowUpAnswer(e.target.value)}
                placeholder="Your response..."
                rows={3}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0 && !aiFollowUp}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={isThinking}
          >
            {isThinking ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Thinking...
              </>
            ) : currentQuestion === questions.length - 1 && !aiFollowUp ? (
              <>
                Submit
                <Send className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionnairePreview;
