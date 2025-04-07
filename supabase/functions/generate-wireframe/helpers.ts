
/**
 * Helper utilities for enhancing wireframe generation
 */

// Add creative enhancements to the wireframe data
export function addCreativeEnhancements(wireframeData: any, creativityLevel: number = 7) {
  // Don't modify if no wireframe data
  if (!wireframeData) return wireframeData;
  
  // Enhance sections based on creativity level
  if (wireframeData.sections && Array.isArray(wireframeData.sections)) {
    wireframeData.sections = wireframeData.sections.map(section => {
      // Add animation suggestions for higher creativity levels
      if (creativityLevel >= 6 && !section.animationSuggestions) {
        section.animationSuggestions = generateAnimationSuggestion(section.sectionType);
      }
      
      // Add style variants for higher creativity levels
      if (creativityLevel >= 8 && !section.styleVariants) {
        section.styleVariants = generateStyleVariants(section.sectionType);
      }
      
      return section;
    });
  }
  
  // Add enhanced design tokens based on creativity level
  if (wireframeData.designTokens) {
    wireframeData.designTokens = enhanceDesignTokens(wireframeData.designTokens, creativityLevel);
  }
  
  return wireframeData;
}

// Generate animation suggestions based on section type
function generateAnimationSuggestion(sectionType: string) {
  const baseAnimations = {
    hero: [
      { element: "heading", animation: "fade-in-up", timing: "0.5s ease-out" },
      { element: "subheading", animation: "fade-in-up", timing: "0.7s ease-out", delay: "0.2s" },
      { element: "cta-button", animation: "pulse", timing: "2s infinite" }
    ],
    features: [
      { element: "feature-cards", animation: "fade-in-stagger", timing: "0.5s ease-out", staggerDelay: "0.15s" }
    ],
    testimonials: [
      { element: "testimonial-cards", animation: "slide-in-from-right", timing: "0.6s ease-in-out" }
    ],
    gallery: [
      { element: "images", animation: "zoom-in", timing: "0.4s ease-out" }
    ],
    cta: [
      { element: "cta-container", animation: "pulse", timing: "2s infinite" }
    ],
    footer: [
      { element: "social-icons", animation: "bounce", timing: "0.3s", hoverEffect: true }
    ]
  };
  
  // Default animations for unknown section types
  const defaultAnimations = [
    { element: "container", animation: "fade-in", timing: "0.5s ease-out" }
  ];
  
  return baseAnimations[sectionType.toLowerCase()] || defaultAnimations;
}

// Generate style variants based on section type
function generateStyleVariants(sectionType: string) {
  const variants = [
    {
      name: "Light",
      styles: {
        backgroundColor: "#ffffff",
        textColor: "#333333",
        accentColor: "#3b82f6"
      }
    },
    {
      name: "Dark",
      styles: {
        backgroundColor: "#1f2937",
        textColor: "#f3f4f6",
        accentColor: "#60a5fa"
      }
    },
    {
      name: "Colorful",
      styles: {
        backgroundColor: "#f0f9ff",
        textColor: "#1e3a8a",
        accentColor: "#2dd4bf"
      }
    }
  ];
  
  return variants;
}

// Enhance design tokens with more creative options
function enhanceDesignTokens(tokens: any, creativityLevel: number) {
  if (!tokens) return tokens;
  
  // Only enhance at higher creativity levels
  if (creativityLevel < 5) return tokens;
  
  // Add color palette variations
  if (tokens.colors && creativityLevel >= 7) {
    tokens.colors.variations = [
      { name: "Vibrant", primary: adjustColor(tokens.colors.primary, 20), secondary: adjustColor(tokens.colors.secondary, 20) },
      { name: "Muted", primary: desaturateColor(tokens.colors.primary), secondary: desaturateColor(tokens.colors.secondary) }
    ];
  }
  
  // Add enhanced typography options
  if (tokens.typography && creativityLevel >= 6) {
    tokens.typography.alternativeFonts = [
      { heading: "Montserrat", body: "Open Sans" },
      { heading: "Playfair Display", body: "Source Sans Pro" }
    ];
  }
  
  // Add micro-interactions at highest creativity levels
  if (creativityLevel >= 9) {
    tokens.interactions = {
      hover: { scale: 1.02, transition: "all 0.2s ease" },
      active: { scale: 0.98, transition: "all 0.1s ease" },
      buttonHover: { y: -2, shadow: "0 4px 6px rgba(0,0,0,0.1)" }
    };
  }
  
  return tokens;
}

// Helper function to adjust color brightness
function adjustColor(color: string, percent: number): string {
  // Simple placeholder implementation - in real code would use proper color manipulation
  return color; // In a real implementation, would adjust the brightness
}

// Helper function to desaturate colors
function desaturateColor(color: string): string {
  // Simple placeholder implementation - in real code would use proper color manipulation
  return color; // In a real implementation, would desaturate the color
}
