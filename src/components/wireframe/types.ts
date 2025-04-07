
import { WireframeData, WireframeSection } from "@/services/ai/wireframe/wireframe-types";

export interface WireframeProps {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  imageUrl?: string;
  version?: string;
  lastUpdated?: string;
}

export interface WireframeVisualizerProps {
  wireframe: WireframeProps;
  darkMode?: boolean;
  onSelect?: (id: string) => void;
}

export interface SectionRenderProps {
  section: WireframeSection;
  darkMode?: boolean;
}

export interface ComponentPreviewProps {
  component: any;
  darkMode?: boolean;
}

export interface WireframeDataVisualizerProps {
  wireframe: WireframeData;
  darkMode?: boolean;
}
