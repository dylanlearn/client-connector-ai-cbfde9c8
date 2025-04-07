import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define context types
interface DesignProcessContextType {
  sections: any[];
  addSection: (section: any) => void;
  updateSection: (id: string, updates: any) => void;
  removeSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
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

  // Provide the context value
  const value: DesignProcessContextType = {
    sections,
    addSection,
    updateSection,
    removeSection,
    reorderSections,
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

// Find the sections that are missing id and add them
// Sample code to fix (adjust to your actual file):
const generateWireframeSection = () => {
  return {
    id: uuidv4(), // Add this
    name: 'Hero Section',
    sectionType: 'hero',
    components: []
  };
};

// For the specific error at line 182, 187, 192:
const initialSections = [
  {
    id: uuidv4(), // Add this
    name: 'Hero Section', 
    sectionType: 'hero',
    components: []
  },
  {
    id: uuidv4(), // Add this
    name: 'Features Section',
    sectionType: 'features',
    components: []
  },
  {
    id: uuidv4(), // Add this
    name: 'Testimonials Section',
    sectionType: 'testimonials',
    components: []
  }
];
