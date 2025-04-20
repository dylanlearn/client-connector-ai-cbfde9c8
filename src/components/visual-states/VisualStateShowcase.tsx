
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useVisualState } from '@/contexts/VisualStateContext';
import StatefulComponent from './StatefulComponent';
import { stylePresets, PresetStyleDemo } from './PresetStateStyles';
import { StateControls } from './StateControls';
import { StateTransitionPreview } from './StateTransitionPreview';

export const VisualStateShowcase: React.FC = () => {
  const { previewState, transitionDuration, transitionTimingFunction } = useVisualState();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Visual States System</h1>
      <p className="text-gray-600 mb-8">
        Visualize component states with transitions and customizable timing functions
      </p>

      {/* Controls Section */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">State Controls</h2>
        <StateControls />
      </Card>

      {/* Active State Display */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current State Preview</h2>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium">Active State:</span>
          <Badge variant="outline" className="bg-blue-50">
            {previewState.toUpperCase()}
          </Badge>
          <span className="text-sm font-medium ml-4">Transition:</span>
          <Badge variant="outline" className="bg-blue-50">
            {transitionDuration}ms {transitionTimingFunction}
          </Badge>
        </div>
      </div>

      {/* Transition Preview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Transition Preview</h2>
        <StateTransitionPreview />
      </div>

      {/* Component Presets */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Component Style Presets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stylePresets.map((preset) => (
            <Card key={preset.id} className="p-6">
              <h3 className="text-lg font-medium mb-3">{preset.name}</h3>
              
              <div className="flex flex-col items-start gap-4">
                <StatefulComponent
                  defaultStyles={preset.defaultStyles}
                  hoverStyles={preset.hoverStyles}
                  activeStyles={preset.activeStyles}
                  focusStyles={preset.focusStyles}
                  disabledStyles={preset.disabledStyles}
                >
                  <PresetStyleDemo presetId={preset.id} />
                </StatefulComponent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Examples */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Custom Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Button */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-3">Custom Button</h3>
            <StatefulComponent
              defaultStyles="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-medium shadow-md"
              hoverStyles="from-purple-600 to-indigo-700 shadow-lg transform -translate-y-0.5"
              activeStyles="from-purple-700 to-indigo-800 shadow-sm transform translate-y-0.5"
              focusStyles="ring-2 ring-offset-2 ring-purple-400 outline-none"
              disabledStyles="opacity-60 cursor-not-allowed"
            >
              <button>Subscribe Now</button>
            </StatefulComponent>
          </Card>
          
          {/* Custom Card */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-3">Custom Card</h3>
            <StatefulComponent
              defaultStyles="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all"
              hoverStyles="shadow-md border-gray-300 bg-gray-50"
              activeStyles="transform scale-[0.98] bg-gray-100 shadow-inner"
              focusStyles="ring-2 ring-blue-400 outline-none"
              disabledStyles="opacity-70"
            >
              <div className="w-full">
                <h3 className="font-semibold text-lg">Premium Plan</h3>
                <p className="text-gray-600 mt-1">Get access to all premium features</p>
              </div>
            </StatefulComponent>
          </Card>
        </div>
      </div>
    </div>
  );
};
