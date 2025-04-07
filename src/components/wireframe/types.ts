
import { WireframeData, WireframeSection } from "@/services/ai/wireframe/wireframe-types";

// Types for WireframeFlow component
export interface WireframeFlowProps {
  onComplete: (selectedWireframe: WireframeSelection) => void;
}

// Define the WireframeSelection interface for better type safety
export interface WireframeSelection {
  id?: string;
  title: string;
  description: string;
  sections?: WireframeSection[];
  imageUrl?: string;
  style?: string;
  layoutType?: string;
}

// Interface for the Wireframe Bridge component
export interface IntakeWireframeBridgeProps {
  intakeData: {
    projectName?: string;
    projectDescription?: string;
    siteType?: string;
    designStyle?: string;
    primaryColor?: string;
    secondaryColor?: string;
    conversionPriority?: string;
    fontStyle?: string;
  };
  onComplete?: (wireframeData: WireframeData) => void;
}

// Types for WireframeVisualizer component
export interface WireframeProps {
  wireframe: (WireframeData & { id: string }); // Make sure id is required
  onSelect?: () => void;
  isSelected?: boolean;
  className?: string;
  darkMode?: boolean; // Added darkMode prop
  viewMode?: 'flowchart' | 'preview'; // Added viewMode prop
  deviceType?: 'desktop' | 'mobile' | 'tablet'; // Added deviceType prop
}

export interface WireframeDataProps {
  wireframeData: WireframeData;
  className?: string;
  darkMode?: boolean; // Added darkMode prop
}
