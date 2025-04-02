
import { CheckCircle2 } from "lucide-react";

interface ProgressIndicatorProps {
  steps: Array<{title: string}>;
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-8 px-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium text-sm md:text-base
                ${index < currentStep 
                  ? "bg-indigo-600 text-white" 
                  : index === currentStep 
                    ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600" 
                    : "bg-gray-100 text-gray-400"
                }`}
            >
              {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="hidden md:block h-1 w-16 bg-gray-200 mt-5">
                <div 
                  className="h-full bg-indigo-600" 
                  style={{ width: index < currentStep ? "100%" : "0%" }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
