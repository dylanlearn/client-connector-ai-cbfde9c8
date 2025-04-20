
import React from 'react';
import { useVisualState } from '@/contexts/VisualStateContext';

export const StatefulButton = () => {
  const { 
    previewState,
    transitionDuration,
    transitionTimingFunction,
    transitionDelay
  } = useVisualState();

  // Define states styling
  const states = {
    default: "bg-blue-500 hover:bg-blue-600 text-white",
    hover: "bg-blue-600 text-white",
    active: "bg-blue-700 transform scale-95 text-white",
    focus: "bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-2",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed"
  };

  const transitionStyle = {
    transition: `all ${transitionDuration}ms ${transitionTimingFunction} ${transitionDelay}ms`
  };

  return (
    <button
      className={`px-4 py-2 rounded font-medium ${states[previewState]}`}
      style={transitionStyle}
      disabled={previewState === 'disabled'}
    >
      Button
    </button>
  );
};
