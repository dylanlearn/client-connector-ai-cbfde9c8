
import { corsHeaders } from "./cors.ts";

// Structured logging with severity levels
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR"
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  userId?: string;
}

// Enterprise-level structured logging
export function log(level: LogLevel, message: string, data?: any, userId?: string): void {
  const entry: LogEntry = {
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
    userId
  };
  
  // In production, this could send to a logging service
  console.log(JSON.stringify(entry));
}

// Standard error response factory to reduce duplication
export function createErrorResponse(error: Error | string, defaultValues = {}): Response {
  const errorMessage = error instanceof Error ? error.message : error;
  log(LogLevel.ERROR, "Error in check-subscription", { error: errorMessage });
  
  return new Response(JSON.stringify({ 
    error: errorMessage,
    subscription: 'free',
    isActive: false,
    inTrial: false,
    expiresAt: null,
    willCancel: false,
    isAdmin: false,
    adminAssigned: false,
    adminAssignedStatus: null,
    ...defaultValues
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200, // Return 200 even on error with default values to prevent UI failures
  });
}
