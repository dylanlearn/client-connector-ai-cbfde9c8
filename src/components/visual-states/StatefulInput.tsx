
import React from 'react';
import { useVisualState } from '@/contexts/VisualStateContext';

export const StatefulInput = () => {
  const { 
    previewState,
    transitionDuration,
    transitionTimingFunction,
    transitionDelay
  } = useVisualState();

  // Define states styling
  const states = {
    default: "border-gray-300 bg-white",
    hover: "border-gray-400 bg-white",
    active: "border-blue-500 bg-white",
    focus: "border-blue-500 bg-white ring-2 ring-blue-200",
    disabled: "border-gray-200 bg-gray-100 text-gray-400"
  };

  const transitionStyle = {
    transition: `all ${transitionDuration}ms ${transitionTimingFunction} ${transitionDelay}ms`
  };

  return (
    <input
      type="text"
      placeholder="Input field"
      className={`px-4 py-2 rounded border ${states[previewState]}`}
      style={transitionStyle}
      disabled={previewState === 'disabled'}
    />
  );
};
