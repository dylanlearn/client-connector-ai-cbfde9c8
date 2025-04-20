
import React from 'react';
import { useVisualState } from '@/contexts/VisualStateContext';

export const StatefulCard = () => {
  const { 
    previewState,
    transitionDuration,
    transitionTimingFunction,
    transitionDelay
  } = useVisualState();

  // Define states styling
  const states = {
    default: "bg-white border border-gray-200 shadow-sm",
    hover: "bg-gray-50 border-gray-300 shadow-md",
    active: "bg-gray-100 border-gray-400 transform scale-[0.98] shadow",
    focus: "bg-white border-blue-400 shadow-md ring-2 ring-blue-200",
    disabled: "bg-gray-100 border border-gray-200 opacity-60"
  };

  const transitionStyle = {
    transition: `all ${transitionDuration}ms ${transitionTimingFunction} ${transitionDelay}ms`
  };

  return (
    <div
      className={`w-64 h-40 rounded-lg p-4 flex items-center justify-center ${states[previewState]}`}
      style={transitionStyle}
      tabIndex={previewState === 'disabled' ? -1 : 0}
    >
      <span className={previewState === 'disabled' ? 'text-gray-400' : 'text-gray-800'}>
        Interactive Card
      </span>
    </div>
  );
};
