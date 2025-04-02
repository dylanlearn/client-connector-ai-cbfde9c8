
import React from "react";

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

const ProgressBar = ({ currentQuestion, totalQuestions }: ProgressBarProps) => {
  const progressPercentage = (currentQuestion / (totalQuestions - 1)) * 100;
  
  return (
    <div className="mb-6">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1 text-sm text-gray-500">
        <span>Start</span>
        <span>{currentQuestion + 1} of {totalQuestions}</span>
        <span>Complete</span>
      </div>
    </div>
  );
};

export default ProgressBar;
