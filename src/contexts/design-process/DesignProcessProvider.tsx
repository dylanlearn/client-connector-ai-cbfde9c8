import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { IntakeFormData } from '@/types/intake-form';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';

export type DesignStage = 
  | 'intake'
  | 'analysis'
  | 'moodboard'
  | 'wireframe'
  | 'feedback'
  | 'revision'
  | 'handoff';

interface DesignBrief {
  title: string;
  description: string;
  targetAudience: string;
  brandPersonality: string[];
  keyComponents: string[];
  conversionGoals: string[];
}

interface DesignContext {
  currentStage: DesignStage;
  progress: number;
  intakeData: IntakeFormData | null;
  designBrief: DesignBrief | null;
  wireframeData: WireframeData | null;
  clientFeedback: string[];
  designerNotes: string[];
  setCurrentStage: (stage: DesignStage) => void;
  updateIntakeData: (data: Partial<IntakeFormData>) => void;
  generateDesignBrief: () => Promise<void>;
  generateWireframe: () => Promise<void>;
  addClientFeedback: (feedback: string) => void;
  addDesignerNote: (note: string) => void;
  resetProcess: () => void;
}

const DesignProcessContext = createContext<DesignContext | null>(null);

export const useDesignProcess = () => {
  const context = useContext(DesignProcessContext);
  if (!context) {
    throw new Error('useDesignProcess must be used within a DesignProcessProvider');
  }
  return context;
};

export const DesignProcessProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStage, setCurrentStage] = useState<DesignStage>('intake');
  const [intakeData, setIntakeData] = useState<IntakeFormData | null>(null);
  const [designBrief, setDesignBrief] = useState<DesignBrief | null>(null);
  const [wireframeData, setWireframeData] = useState<WireframeData | null>(null);
  const [clientFeedback, setClientFeedback] = useState<string[]>([]);
  const [designerNotes, setDesignerNotes] = useState<string[]>([]);
  
  const calculateProgress = (): number => {
    const stages: DesignStage[] = ['intake', 'analysis', 'moodboard', 'wireframe', 'feedback', 'revision', 'handoff'];
    const currentIndex = stages.indexOf(currentStage);
    return Math.round(((currentIndex + 1) / stages.length) * 100);
  };
  
  const progress = calculateProgress();
  
  useEffect(() => {
    if (user) {
      const savedProcess = localStorage.getItem(`designProcess_${user.id}`);
      if (savedProcess) {
        try {
          const {
            currentStage: savedStage,
            intakeData: savedIntake,
            designBrief: savedBrief,
            wireframeData: savedWireframe,
            clientFeedback: savedFeedback,
            designerNotes: savedNotes
          } = JSON.parse(savedProcess);
          
          setCurrentStage(savedStage || 'intake');
          setIntakeData(savedIntake || null);
          setDesignBrief(savedBrief || null);
          setWireframeData(savedWireframe || null);
          setClientFeedback(savedFeedback || []);
          setDesignerNotes(savedNotes || []);
        } catch (error) {
          console.error('Error loading saved design process:', error);
        }
      }
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem(`designProcess_${user.id}`, JSON.stringify({
        currentStage,
        intakeData,
        designBrief,
        wireframeData,
        clientFeedback,
        designerNotes
      }));
    }
  }, [user, currentStage, intakeData, designBrief, wireframeData, clientFeedback, designerNotes]);
  
  const updateIntakeData = useCallback((data: Partial<IntakeFormData>) => {
    setIntakeData(prevData => ({
      ...prevData || {},
      ...data
    }));
  }, []);
  
  const generateDesignBrief = useCallback(async () => {
    if (!intakeData) {
      toast({
        title: "Missing information",
        description: "Please complete the intake form first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const brief: DesignBrief = {
        title: `Design Brief for ${intakeData.projectName || 'Unnamed Project'}`,
        description: intakeData.projectDescription || 'No description provided',
        targetAudience: intakeData.targetAudience || 'General audience',
        brandPersonality: ['professional', 'trustworthy'],
        keyComponents: ['hero', 'features', 'testimonials', 'contact'],
        conversionGoals: ['lead generation', 'user engagement']
      };
      
      setDesignBrief(brief);
      setCurrentStage('analysis');
      
      toast({
        title: "Design brief generated",
        description: "The AI has created a design brief based on your inputs."
      });
    } catch (error) {
      console.error('Error generating design brief:', error);
      toast({
        title: "Error generating brief",
        description: "There was a problem creating your design brief.",
        variant: "destructive"
      });
    }
  }, [intakeData, toast]);
  
  const generateWireframe = useCallback(async () => {
    if (!designBrief) {
      toast({
        title: "Missing design brief",
        description: "Please generate a design brief first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const wireframe: WireframeData = {
        title: designBrief.title,
        description: designBrief.description,
        sections: generateWireframeSections()
      };
      
      setWireframeData(wireframe);
      setCurrentStage('wireframe');
      
      toast({
        title: "Wireframe generated",
        description: "The AI has created a wireframe based on your design brief."
      });
    } catch (error) {
      console.error('Error generating wireframe:', error);
      toast({
        title: "Error generating wireframe",
        description: "There was a problem creating your wireframe.",
        variant: "destructive"
      });
    }
  }, [designBrief, toast]);
  
  const addClientFeedback = useCallback((feedback: string) => {
    setClientFeedback(prev => [...prev, feedback]);
  }, []);
  
  const addDesignerNote = useCallback((note: string) => {
    setDesignerNotes(prev => [...prev, note]);
  }, []);
  
  const resetProcess = useCallback(() => {
    setCurrentStage('intake');
    setIntakeData(null);
    setDesignBrief(null);
    setWireframeData(null);
    setClientFeedback([]);
    setDesignerNotes([]);
    
    if (user) {
      localStorage.removeItem(`designProcess_${user.id}`);
    }
    
    toast({
      title: "Design process reset",
      description: "Your design process has been reset."
    });
  }, [user, toast]);
  
  const value = {
    currentStage,
    progress,
    intakeData,
    designBrief,
    wireframeData,
    clientFeedback,
    designerNotes,
    setCurrentStage,
    updateIntakeData,
    generateDesignBrief,
    generateWireframe,
    addClientFeedback,
    addDesignerNote,
    resetProcess
  };
  
  return (
    <DesignProcessContext.Provider value={value}>
      {children}
    </DesignProcessContext.Provider>
  );
};

export default DesignProcessProvider;
