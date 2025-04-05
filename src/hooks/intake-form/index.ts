
// This file would typically have imports and exports related to intake forms

// Import and re-export TaskStatus using 'export type' for isolatedModules compatibility
import { TaskStatus } from "@/types/client";
export type { TaskStatus };

// Create and export the useIntakeForm hook that's missing but used in multiple components
export * from './useFormSubmission';
export * from './useIntakeFormState';
export * from './useFormSync';

// Export the actual useIntakeForm hook
export { useIntakeForm } from './useIntakeForm';

// Export any constants or utilities specific to intake forms
export const INTAKE_FORM_SECTIONS = [
  'business',
  'audience',
  'design',
  'content',
  'technical'
];

export const FORM_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REVIEWED: 'reviewed'
};
