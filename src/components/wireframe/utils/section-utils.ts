
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Get SEO-friendly slug for a section
 */
export function getSectionSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Get a default section name based on type
 */
export function getDefaultSectionName(type: string, count?: number): string {
  const suffix = count ? ` ${count}` : '';
  
  switch (type) {
    case 'hero':
      return `Hero Section${suffix}`;
    case 'feature-grid':
      return `Features${suffix}`;
    case 'testimonials':
      return `Testimonials${suffix}`;
    case 'pricing':
      return `Pricing${suffix}`;
    case 'faq':
      return `FAQ${suffix}`;
    case 'cta':
      return `Call to Action${suffix}`;
    case 'navigation':
      return `Navigation${suffix}`;
    case 'footer':
      return `Footer${suffix}`;
    case 'blog':
      return `Blog Section${suffix}`;
    case 'contact':
      return `Contact${suffix}`;
    default:
      return `Section${suffix}`;
  }
}

/**
 * Check if a section can be deleted (some sections may be required)
 */
export function canDeleteSection(section: WireframeSection): boolean {
  // Don't allow deleting navigation or footer when they're singleton sections
  if (section.sectionType === 'navigation' && section.data?.isSingleton) {
    return false;
  }
  
  if (section.sectionType === 'footer' && section.data?.isSingleton) {
    return false;
  }
  
  return true;
}
