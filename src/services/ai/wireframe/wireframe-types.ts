
// Updating only the WireframeResult interface to ensure style type is consistent

export interface WireframeResult {
  title?: string;
  description?: string;
  sections: WireframeSection[];
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text?: string;
    [key: string]: any;
  };
  typography?: {
    headings: string;
    body: string;
    fontPairings?: string[];
    [key: string]: any;
  };
  style?: string;
  visualReferences?: string[];
  layoutType?: string;
  id?: string;
  imageUrl?: string;
  [key: string]: any;
}
