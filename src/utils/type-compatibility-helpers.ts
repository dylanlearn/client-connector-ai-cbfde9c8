
import { WireframeColorScheme, WireframeTypography } from "@/services/ai/wireframe/wireframe-types";

/**
 * Convert WireframeColorScheme to Record<string, string>
 * This helps with type compatibility issues in various parts of the app
 */
export function colorSchemeToRecord(scheme: WireframeColorScheme): Record<string, string> {
  return {
    primary: scheme.primary,
    secondary: scheme.secondary,
    accent: scheme.accent,
    background: scheme.background,
    text: scheme.text || '#000000',
    // Add any additional properties that might be accessed
  };
}

/**
 * Convert WireframeTypography to Record<string, string>
 * This helps with type compatibility issues in various parts of the app
 */
export function typographyToRecord(typography: WireframeTypography): Record<string, string> {
  return {
    headings: typography.headings,
    body: typography.body,
    // Add any additional properties that might be accessed
  };
}

/**
 * Ensures a section has the required components array
 */
export function ensureSectionComponents(section: any) {
  if (!section.components) {
    return {
      ...section,
      components: []
    };
  }
  return section;
}
