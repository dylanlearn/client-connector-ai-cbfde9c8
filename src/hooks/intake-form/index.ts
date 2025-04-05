// This file would typically have imports and exports related to intake forms
// We need to adjust the import of TaskStatus

import { TaskStatus } from "@/types/client";
export { TaskStatus };

// Export hooks related to intake forms
export * from './useFormSubmission';
export * from './useFormValidation';
export * from './useFormData';

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
