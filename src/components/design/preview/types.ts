
export interface DesignOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: "hero" | "navbar" | "about" | "footer" | "font" | "animation" | "interaction";
  rank?: number;
  notes?: string;
}

export interface DesignPreviewProps {
  selectedDesigns: Record<string, DesignOption>;
  className?: string;
}
