
export interface DesignOption {
  id: string;
  name: string;
  title: string;
  description?: string;
  preview?: string;
  type?: string;
  value?: string | number | boolean;
  selected?: boolean;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  metadata?: Record<string, any>;
}

export interface DesignPreviewProps {
  selectedDesigns: Record<string, DesignOption>;
  className?: string;
}
