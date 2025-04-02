
import { questions } from "@/data/questionnaire-questions";
import QuestionnaireCard from "@/components/questionnaire/QuestionnaireCard";
import { useQuestionnaire } from "@/hooks/use-questionnaire";

const QuestionnairePreview = () => {
  const {
    currentQuestion,
    answers,
    aiFollowUp,
    followUpAnswer,
    isThinking,
    handleChange,
    handleNext,
    handlePrevious,
    setFollowUpAnswer,
  } = useQuestionnaire(questions);

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
