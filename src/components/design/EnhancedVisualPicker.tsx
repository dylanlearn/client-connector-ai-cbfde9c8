import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { VisualPicker, DesignOption } from './VisualPicker';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Sliders, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface VisualCalibrationOption extends DesignOption {
  attributes?: Record<string, number | string>;
  tags?: string[];
  ranking?: number;
  feedback?: 'positive' | 'negative' | null;
}

export interface EnhancedVisualPickerProps {
  options: VisualCalibrationOption[];
  onSelect?: (option: VisualCalibrationOption) => void;
  onCalibrationComplete?: (results: {
    selectedOptions: VisualCalibrationOption[];
    calibrationParams: Record<string, number | string>;
    userFeedback: Record<string, any>;
  }) => void;
  category?: string;
  className?: string;
  title?: string;
  showRankingControls?: boolean;
  maxSelections?: number;
  calibrationSettings?: {
    params: Array<{
      name: string;
      label: string;
      min: number;
      max: number;
      step: number;
      defaultValue: number;
    }>;
  };
}

export const EnhancedVisualPicker: React.FC<EnhancedVisualPickerProps> = ({
  options,
  onSelect,
  onCalibrationComplete,
  category = "design",
  className,
  title = "Select your preferences",
  showRankingControls = true,
  maxSelections = 3,
  calibrationSettings
}) => {
  const [selectedOptions, setSelectedOptions] = useState<VisualCalibrationOption[]>([]);
  const [optionFeedback, setOptionFeedback] = useState<Record<string, 'positive' | 'negative' | null>>({});
  const [calibrationParams, setCalibrationParams] = useState<Record<string, number>>({});
  const [currentView, setCurrentView] = useState<'selection' | 'calibration' | 'results'>('selection');
  
  // Initialize calibration parameters
  useEffect(() => {
    if (calibrationSettings?.params) {
      const initialParams: Record<string, number> = {};
      calibrationSettings.params.forEach(param => {
        initialParams[param.name] = param.defaultValue;
      });
      setCalibrationParams(initialParams);
    }
  }, [calibrationSettings]);

  const handleOptionSelect = useCallback((option: VisualCalibrationOption) => {
    setSelectedOptions(prev => {
      // If option already selected, remove it
      if (prev.find(o => o.id === option.id)) {
        return prev.filter(o => o.id !== option.id);
      }
      
      // If max selections reached, show warning and don't add
      if (prev.length >= maxSelections) {
        toast({
          title: "Maximum selections reached",
          description: `You can select up to ${maxSelections} options`,
          variant: "destructive"
        });
        return prev;
      }
      
      // Otherwise, add the option
      return [...prev, option];
    });
    
    if (onSelect) {
      onSelect(option);
    }
  }, [maxSelections, onSelect]);

  const handleFeedback = useCallback((optionId: string, feedback: 'positive' | 'negative') => {
    setOptionFeedback(prev => ({
      ...prev,
      [optionId]: prev[optionId] === feedback ? null : feedback
    }));
    
    // Update the option's feedback property
    setSelectedOptions(prev => 
      prev.map(opt => 
        opt.id === optionId ? 
          { ...opt, feedback: optionFeedback[optionId] === feedback ? null : feedback } : 
          opt
      )
    );
  }, [optionFeedback]);

  const handleCalibrationChange = useCallback((param: string, value: number) => {
    setCalibrationParams(prev => ({
      ...prev,
      [param]: value
    }));
  }, []);

  const moveToCalibration = useCallback(() => {
    if (selectedOptions.length === 0) {
      toast({
        title: "No selections made",
        description: "Please select at least one option before proceeding",
        variant: "destructive"
      });
      return;
    }
    setCurrentView('calibration');
  }, [selectedOptions.length]);

  const completeCalibration = useCallback(() => {
    if (onCalibrationComplete) {
      // Calculate overall user preferences based on selections and feedback
      const userFeedback = {
        positiveAttributes: {} as Record<string, number>,
        negativeAttributes: {} as Record<string, number>,
      };
      
      // Analyze selected options and their feedback to determine preference patterns
      selectedOptions.forEach(option => {
        if (option.attributes && option.feedback) {
          Object.entries(option.attributes).forEach(([key, value]) => {
            const target = option.feedback === 'positive' 
              ? userFeedback.positiveAttributes 
              : userFeedback.negativeAttributes;
            
            if (typeof value === 'number') {
              target[key] = (target[key] || 0) + value;
            }
          });
        }
      });
      
      onCalibrationComplete({
        selectedOptions,
        calibrationParams,
        userFeedback
      });
    }
    setCurrentView('results');
  }, [selectedOptions, calibrationParams, onCalibrationComplete]);

  // Render different views based on current state
  const renderContent = () => {
    switch (currentView) {
      case 'selection':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select up to {maxSelections} options that you prefer
              </p>
            </div>
            
            <VisualPicker
              options={options}
              selectedId={selectedOptions.length > 0 ? selectedOptions[0].id : null}
              onSelect={(id) => {
                const option = options.find(o => o.id === id);
                if (option) {
                  handleOptionSelect(option as VisualCalibrationOption);
                }
              }}
              category={category}
              fullWidth
              className={className}
            />
            
            {selectedOptions.length > 0 && (
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={moveToCalibration}
                  className="flex items-center"
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
        
      case 'calibration':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">Fine-tune Your Preferences</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Rate your selections and adjust parameters to calibrate the result
              </p>
            </div>
            
            {/* Selected options with feedback controls */}
            <div className="space-y-4">
              <h4 className="text-md font-medium">Your Selections</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedOptions.map(option => (
                  <div 
                    key={option.id} 
                    className="border rounded-lg p-2 relative"
                  >
                    <div className="aspect-video w-full overflow-hidden mb-2">
                      <img 
                        src={option.imageUrl} 
                        alt={option.title} 
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="px-2">
                      <h5 className="font-medium">{option.title}</h5>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    
                    {showRankingControls && (
                      <div className="flex justify-between mt-3 px-2 pb-2">
                        <Button 
                          variant={optionFeedback[option.id] === 'negative' ? "destructive" : "outline"}
                          size="sm"
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => handleFeedback(option.id, 'negative')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={optionFeedback[option.id] === 'positive' ? "default" : "outline"} 
                          size="sm"
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => handleFeedback(option.id, 'positive')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Calibration sliders if settings provided */}
            {calibrationSettings?.params && (
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  <h4 className="text-md font-medium">Adjust Parameters</h4>
                </div>
                
                {calibrationSettings.params.map(param => (
                  <div key={param.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={param.name}>{param.label}</Label>
                      <span className="text-sm font-medium">
                        {calibrationParams[param.name] || param.defaultValue}
                      </span>
                    </div>
                    <Slider
                      id={param.name}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={[calibrationParams[param.name] || param.defaultValue]}
                      onValueChange={([value]) => handleCalibrationChange(param.name, value)}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('selection')}
              >
                Back
              </Button>
              <Button onClick={completeCalibration}>
                Complete Calibration
              </Button>
            </div>
          </div>
        );
        
      case 'results':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">Calibration Complete</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your selections and preferences have been recorded
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <CheckCircle className="text-green-500 h-16 w-16" />
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => setCurrentView('selection')}
                variant="outline"
              >
                Start Over
              </Button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className={cn("enhanced-visual-picker p-4", className)}>
      {renderContent()}
    </div>
  );
};

export default EnhancedVisualPicker;
