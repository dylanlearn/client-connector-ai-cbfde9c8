
import { WireframeSection } from "@/services/ai/wireframe/wireframe-types";

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
  onComplete?: (wireframeData: any) => void;
}

// Types for WireframeVisualizer component
export interface WireframeProps {
  wireframe: {
    id: string;
    title: string;
    description?: string;
    sections: any[];
    imageUrl?: string;
  };
  onSelect?: () => void;
  isSelected?: boolean;
  className?: string;
  darkMode?: boolean;
  viewMode?: 'flowchart' | 'preview';
  deviceType?: 'desktop' | 'mobile' | 'tablet';
}

export interface WireframeDataProps {
  wireframeData: any;
  className?: string;
  darkMode?: boolean;
}
