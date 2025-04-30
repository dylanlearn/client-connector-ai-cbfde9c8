
export interface WireframeComponent {
  id: string;
  componentType: string;
  properties: Record<string, any>;
  children?: WireframeComponent[];
}

export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  components: WireframeComponent[];
  style?: Record<string, any>;
  // Adding missing properties that are being used elsewhere
  position?: { x: number; y: number; z?: number };
  dimensions?: { width: number; height: number };
  styleProperties?: Record<string, any>;
  backgroundColor?: string;
  textAlign?: string;
  padding?: string | number;
  gap?: string | number;
  layout?: any;
}

export interface WireframeColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  [key: string]: string;
}

export interface WireframeTypography {
  headings: string;
  body: string;
  [key: string]: string;
}

export interface WireframeData {
  id: string;
  title: string;
  sections: WireframeSection[];
  colorScheme: WireframeColorScheme;
  typography: WireframeTypography;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string; // Adding missing property
  style?: Record<string, any>; // Adding missing property
}

// Adding missing types for version control
export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  data: WireframeData;
  parent_version_id?: string;
  created_at: string;
  created_by?: string;
  change_description?: string;
  is_current: boolean;
  version?: number; // For compatibility
}

export interface WireframeVersionDiff {
  type: "added" | "removed" | "modified";
  path: string;
  values: [any, any];
}

export interface WireframeCompareResult {
  changes: WireframeVersionDiff[];
  summary: string;
}

export interface WireframeVersionControlOptions {
  branchName?: string;
  changeDescription?: string;
  userId?: string;
}
