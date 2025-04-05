
/**
 * Application-wide constants
 */

// Status options for projects
export const PROJECT_STATUSES = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
} as const;

// Status labels for display
export const STATUS_LABELS = {
  [PROJECT_STATUSES.DRAFT]: 'Draft',
  [PROJECT_STATUSES.IN_PROGRESS]: 'In Progress',
  [PROJECT_STATUSES.REVIEW]: 'In Review',
  [PROJECT_STATUSES.COMPLETED]: 'Completed',
  [PROJECT_STATUSES.ARCHIVED]: 'Archived'
} as const;

// Color mapping for statuses
export const STATUS_COLORS = {
  [PROJECT_STATUSES.DRAFT]: 'bg-gray-100 text-gray-800',
  [PROJECT_STATUSES.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUSES.REVIEW]: 'bg-amber-100 text-amber-800',
  [PROJECT_STATUSES.COMPLETED]: 'bg-green-100 text-green-800',
  [PROJECT_STATUSES.ARCHIVED]: 'bg-gray-100 text-gray-500'
} as const;

// Default pagination settings
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
} as const;

// Interaction tracking settings
export const TRACKING = {
  THROTTLE_DELAY: 500, // ms
  BATCH_SIZE: 25,
  SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes in ms
} as const;

// Animation settings
export const ANIMATION = {
  DEFAULT_DURATION: 0.3, // seconds
  DEFAULT_DELAY: 0.1, // seconds
  DEFAULT_EASE: 'easeInOut'
} as const;
