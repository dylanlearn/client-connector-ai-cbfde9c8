
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ClientErrorPayload {
  message: string;
  stack?: string | null;
  componentName: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
  url?: string;
  userAgent?: string;
}

/**
 * Records a client-side error for monitoring and analysis
 * 
 * @param message - Error message
 * @param stack - Error stack trace (optional)
 * @param componentName - The component where the error occurred
 * @param userId - Optional user ID for attribution
 * @param metadata - Additional error context data
 * @returns Promise that resolves when the error has been recorded
 */
export async function recordClientError(
  message: string,
  stack: string | undefined | null,
  componentName: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    if (!message) {
      console.error('Cannot record client error: No message provided');
      return;
    }

    const errorPayload: ClientErrorPayload = {
      message: message.substring(0, 500), // Limit message length
      stack: stack ? stack.substring(0, 2000) : null, // Limit stack trace length
      componentName: componentName || 'Unknown',
      userId,
      metadata,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };

    // Log to console for development debugging
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Error Monitoring]', errorPayload);
    }

    // Store in Supabase if available
    if (supabase) {
      await supabase.from('client_errors').insert([errorPayload]);
    }
  } catch (recordError) {
    // Fail silently but log to console - we don't want error recording to cause more errors
    console.error('Failed to record client error:', recordError);
  }
}

/**
 * Records API usage metrics
 * 
 * @param endpoint - The API endpoint that was called
 * @param requestData - Request data (will be sanitized)
 * @param responseData - Response data (will be sanitized)
 * @param userId - User ID for attribution
 * @param metadata - Additional context
 */
export async function recordApiUsage(
  endpoint: string,
  requestData: unknown,
  responseData: unknown,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    // Sanitize request and response data by removing sensitive fields
    const sanitizedRequest = sanitizeData(requestData);
    const sanitizedResponse = sanitizeData(responseData);

    const apiUsagePayload = {
      endpoint,
      requestData: sanitizedRequest,
      responseData: sanitizedResponse,
      userId,
      metadata,
      timestamp: new Date().toISOString()
    };

    if (supabase) {
      await supabase.from('api_usage').insert([apiUsagePayload]);
    }
  } catch (error) {
    console.error('Failed to record API usage:', error);
  }
}

/**
 * Helper function to sanitize data before storing
 * Removes sensitive fields like passwords, tokens, etc.
 */
function sanitizeData(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Clone the data to avoid modifying the original
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  
  // List of sensitive fields to remove
  const sensitiveFields = [
    'password', 'token', 'secret', 'key', 'auth',
    'apiKey', 'api_key', 'credential', 'jwt'
  ];

  // Remove sensitive fields
  if (!Array.isArray(sanitized)) {
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }
  }

  return sanitized;
}
