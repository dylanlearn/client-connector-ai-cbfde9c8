
import { AnimationCategory } from "@/types/animations";

// Map animation ID to AnimationCategory for analytics
// Using a static Map for better performance
const categoryMappingCache = new Map<string, AnimationCategory>([
  ["animation-1", "morphing_shape"],
  ["animation-2", "scroll_animation"],
  ["animation-3", "parallax_tilt"],
  ["animation-4", "glassmorphism"],
  ["animation-5", "hover_effect"],
  ["animation-6", "color_shift"],
  ["animation-7", "progressive_disclosure"],
  ["animation-8", "magnetic_element"],
  ["animation-9", "modal_dialog"],
]);

export const getAnimationCategory = (id: string): AnimationCategory => {
  return categoryMappingCache.get(id) || "hover_effect" as AnimationCategory;
};
