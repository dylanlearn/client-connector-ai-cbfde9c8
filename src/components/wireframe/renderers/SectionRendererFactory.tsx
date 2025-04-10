
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { SectionComponentProps } from '../types';
import HeroSectionRenderer from './HeroSectionRenderer';
import CTASectionRenderer from './CTASectionRenderer';
import ComponentRenderer from './ComponentRenderer';

/**
 * Factory component that returns the appropriate section renderer
 */
const SectionRendererFactory: React.FC<SectionComponentProps> = (props) => {
  const { section } = props;
  
  // Select the renderer based on section type
  switch (section.sectionType) {
    case 'hero':
      return <HeroSectionRenderer {...props} />;
    case 'cta':
      return <CTASectionRenderer {...props} />;
    // Add more specialized renderers for other section types
    default:
      // Fall back to the generic component renderer
      return <ComponentRenderer {...props} />;
  }
};

export default SectionRendererFactory;
