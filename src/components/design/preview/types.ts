
export interface DesignOption {
  id: string;
  name: string;
  description?: string;
  preview?: string;
  type?: string;
  value?: string | number | boolean;
  selected?: boolean;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}
