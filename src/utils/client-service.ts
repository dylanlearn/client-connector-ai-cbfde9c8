
// This file is the main entry point for client-related services
// It re-exports all functions from the service files for backwards compatibility

import { 
  createClientAccessLink,
  validateClientToken,
  getClientLinks
} from "@/services/access-links-service";

import {
  createDefaultClientTasks,
  getClientTasks,
  updateTaskStatus,
  getClientTasksProgress
} from "@/services/client-tasks-service";

// Re-export all functions
export {
  createClientAccessLink,
  validateClientToken,
  getClientLinks,
  createDefaultClientTasks,
  getClientTasks,
  updateTaskStatus,
  getClientTasksProgress
};

// Re-export types
export type { ClientAccessLink, ClientTask, TaskStatus } from "@/types/client";
