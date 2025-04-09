
import { DeviceType } from './responsive-utils';

// Canvas configuration interface
export interface WireframeCanvasConfig {
  zoom: number;
  panOffset: { x: number; y: number; };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  gridType: "lines" | "dots" | "columns";
  snapTolerance: number;
  showSmartGuides: boolean;
  width: number;
  height: number;
  backgroundColor: string;
}

// Section rendering utilities
export interface SectionRenderingOptions {
  scale?: number;
  responsiveDevice?: DeviceType;
  preview?: boolean;
}
