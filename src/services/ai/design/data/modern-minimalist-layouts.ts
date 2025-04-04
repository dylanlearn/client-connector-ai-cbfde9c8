
import { DesignPattern } from '../types/design-pattern-types';

/**
 * Collection of modern minimalist layout patterns
 * that are currently trending and optimized for conversions
 */
export const modernMinimalistLayouts: DesignPattern[] = [
  {
    id: 'dark-hero-dual-image',
    name: 'Dark Hero with Dual Images',
    description: 'A high-contrast dark background with bold typography, centered content, a clear CTA, and dual imagery below. Highly effective for conversions.',
    category: 'landing-page',
    conversionOptimized: true,
    tags: ['minimalist', 'dark-theme', 'bold-typography', 'dual-imagery', 'high-contrast'],
    elements: {
      background: 'Dark (typically black or very dark gray)',
      typography: 'Large, bold, sans-serif headline with clean subtext',
      layout: 'Centered content with vertical flow and balanced dual images',
      cta: 'High-contrast button with simple, direct text',
      spacing: 'Generous whitespace between sections',
      branding: 'Minimal logo placement, usually top-left'
    },
    bestFor: ['Startups', 'Digital agencies', 'SaaS products', 'Creative services', 'Professional services'],
    conversionFeatures: [
      'Bold headline that clearly communicates value proposition',
      'Minimal distractions focus attention on core message',
      'Strategic placement of CTA in high-visibility area',
      'Social proof section with logo showcase',
      'Human imagery to create emotional connection'
    ],
    responsiveConsiderations: [
      'Dual images stack vertically on mobile',
      'Typography scales down gracefully on smaller screens',
      'Maintain adequate touch targets for CTA buttons'
    ]
  },
  {
    id: 'minimal-split-screen',
    name: 'Minimal Split Screen Layout',
    description: 'Clean layout that divides the screen into two sections, typically with text content on one side and visual content on the other.',
    category: 'landing-page',
    conversionOptimized: true,
    tags: ['split-screen', 'minimal', 'balanced', 'high-contrast'],
    elements: {
      background: 'Can be light or dark, often with high contrast between sections',
      typography: 'Bold headlines with clean body text, ample line spacing',
      layout: 'Horizontal split on desktop, vertical stack on mobile',
      cta: 'Positioned prominently within the text section',
      spacing: 'Clear separation between content blocks',
      branding: 'Subtle branding elements that don't compete with core message'
    },
    bestFor: ['Product showcases', 'Portfolio sites', 'SaaS products', 'Fashion brands', 'Real estate'],
    conversionFeatures: [
      'Visual balance creates pleasing aesthetic that keeps users engaged',
      'Clear content hierarchy guides users through conversion process',
      'Simple navigation minimizes decision fatigue',
      'Each section focuses on one key message or action'
    ],
    responsiveConsiderations: [
      'Section order matters when stacking vertically on mobile',
      'Consider content priority for mobile users',
      'Maintain adequate spacing between sections'
    ]
  }
];
