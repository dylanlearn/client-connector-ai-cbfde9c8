
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the DesignStage type and export it
export type DesignStage = 'intake' | 'analysis' | 'wireframe' | 'moodboard' | 'design' | 'delivery';

// Define context types
export interface DesignProcessContextType {
  sections: any[];
  addSection: (section: any) => void;
  updateSection: (id: string, updates: any) => void;
  removeSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  currentStage: DesignStage;
  progress: number;
  resetProcess: () => void;
  intakeData: any;
  designBrief: any;
  updateIntakeData: (data: any) => void;
  generateDesignBrief: () => void;
  generateWireframe: () => void;
}

// Create context
const DesignProcessContext = createContext<DesignProcessContextType | undefined>(
  undefined
);

// Provider component
export const DesignProcessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sections, setSections] = useState<any[]>([]);
  const [currentStage, setCurrentStage] = useState<DesignStage>('intake');
  const [progress, setProgress] = useState<number>(0);
  const [intakeData, setIntakeData] = useState<any>(null);
  const [designBrief, setDesignBrief] = useState<any>(null);

  // Function to add a new section
  const addSection = (section: any) => {
    setSections((prevSections) => [...prevSections, section]);
  };

  // Function to update an existing section
  const updateSection = (id: string, updates: any) => {
    setSections((prevSections) =>
      prevSections.map((section) => (section.id === id ? { ...section, ...updates } : section))
    );
  };

  // Function to remove a section
  const removeSection = (id: string) => {
    setSections((prevSections) => prevSections.filter((section) => section.id !== id));
  };

  // Function to reorder sections
  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    setSections(prevSections => {
      const newSections = [...prevSections];
      const [movedSection] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedSection);
      return newSections;
    });
  }, []);

  // Function to update intake data
  const updateIntakeData = (data: any) => {
    setIntakeData(data);
  };

  // Function to generate design brief
  const generateDesignBrief = () => {
    // Implementation would go here
    setDesignBrief({ 
      title: "Generated Design Brief", 
      content: "This is a generated design brief based on the intake data."
    });
    setCurrentStage('analysis');
    setProgress(33);
  };

  // Function to generate wireframe
  const generateWireframe = () => {
    // Implementation would go here
    setCurrentStage('wireframe');
    setProgress(66);
  };

  // Reset the design process
  const resetProcess = () => {
    setCurrentStage('intake');
    setProgress(0);
    setSections([]);
    setIntakeData(null);
    setDesignBrief(null);
  };

  // Provide the context value
  const value: DesignProcessContextType = {
    sections,
    addSection,
    updateSection,
    removeSection,
    reorderSections,
    currentStage,
    progress,
    resetProcess,
    intakeData,
    designBrief,
    updateIntakeData,
    generateDesignBrief,
    generateWireframe
  };

  return (
    <DesignProcessContext.Provider value={value}>
      {children}
    </DesignProcessContext.Provider>
  );
};

// Custom hook to consume the context
export const useDesignProcess = () => {
  const context = useContext(DesignProcessContext);
  if (!context) {
    throw new Error('useDesignProcess must be used within a DesignProcessProvider');
  }
  return context;
};

// Sample section generation with proper IDs
const generateWireframeSection = () => {
  return {
    id: uuidv4(),
    name: 'Hero Section',
    sectionType: 'hero',
    components: []
  };
};

// Sample initial sections with IDs
const initialSections = [
  {
    id: uuidv4(),
    name: 'Hero Section', 
    sectionType: 'hero',
    components: []
  },
  {
    id: uuidv4(),
    name: 'Features Section',
    sectionType: 'features',
    components: []
  },
  {
    id: uuidv4(),
    name: 'Testimonials Section',
    sectionType: 'testimonials',
    components: []
  }
];
