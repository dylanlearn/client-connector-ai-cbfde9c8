
export type ResponsiveLayoutSettings = {
  device: 'desktop' | 'tablet' | 'mobile';
  columns: number;
  breakpoint: number;
};

export interface AdaptiveWireframeSection {
  id: string;
  visible: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  layout: {
    desktop: any;
    tablet?: any;
    mobile?: any;
  };
  dimensions: {
    desktop: { width: number; height: number };
    tablet?: { width: number; height: number };
    mobile?: { width: number; height: number };
  };
  [key: string]: any;
}
