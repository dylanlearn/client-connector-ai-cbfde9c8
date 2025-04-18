
// Type definitions for layer management

export interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  children?: LayerItem[];
  parentId?: string;
  order: number;
}

export interface LayerInfo extends LayerItem {
  depth: number;
}

export interface LayerOperationResult {
  success: boolean;
  message?: string;
  layerId?: string;
}

export interface LayerSelectionConfig {
  allowMultiple: boolean;
  highlightSelected: boolean;
  style?: {
    borderColor?: string;
    borderWidth?: string;
    outlineColor?: string;
    outlineWidth?: string;
    backgroundColor?: string;
    opacity?: number;
  };
}

export interface SelectionConfig {
  style: {
    transparentCorners?: boolean;
    borderColor?: string;
    cornerColor?: string;
    cornerStyle?: string;
    cornerSize?: number;
    cornerStrokeColor?: string;
    selectionBackgroundColor?: string;
  }
}

export type LayerOperation = 
  | 'create'
  | 'update'
  | 'delete'
  | 'move'
  | 'group'
  | 'ungroup'
  | 'lock'
  | 'unlock'
  | 'show'
  | 'hide';
