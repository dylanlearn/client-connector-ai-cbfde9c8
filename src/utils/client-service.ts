
// This file is the main entry point for client-related services
// It re-exports all functions from the service files for backwards compatibility

import { 
  createClientAccessLink,
  validateClientToken,
  getClientLinks,
  recordLinkDelivery,
  getLinkDeliveries,
  resendClientLink,
  updateClientLinkStatus,
  deleteClientLink,
  archiveProject,
  deleteProject
} from "@/services/clients";

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
  recordLinkDelivery,
  getLinkDeliveries,
  resendClientLink,
  createDefaultClientTasks,
  getClientTasks,
  updateTaskStatus,
  getClientTasksProgress,
  updateClientLinkStatus,
  deleteClientLink,
  archiveProject,
  deleteProject
};

// Re-export types from client.ts
export type {
  ClientAccessLink,
  ClientTaskProgress,
  TaskStatus,
  ClientTask,
  TaskCardProps,
  WhatNextSectionProps,
  LoadingViewProps,
  ClientLinkResult
} from "@/types/client";
