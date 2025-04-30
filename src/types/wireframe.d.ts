
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
}
