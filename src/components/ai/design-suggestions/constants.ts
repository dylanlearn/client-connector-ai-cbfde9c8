
import { IndustryOption, StyleOption } from "./types";

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { value: "any", label: "Any industry" },
  { value: "tech", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "hospitality", label: "Hospitality" },
  { value: "other", label: "Other (specify)" },
];

export const STYLE_OPTIONS: StyleOption[] = [
  { value: "any", label: "Any style" },
  { value: "minimalist", label: "Minimalist" },
  { value: "modern", label: "Modern" },
  { value: "corporate", label: "Corporate" },
  { value: "playful", label: "Playful" },
  { value: "luxury", label: "Luxury" },
  { value: "vintage", label: "Vintage/Retro" },
  { value: "other", label: "Other (specify)" },
];
