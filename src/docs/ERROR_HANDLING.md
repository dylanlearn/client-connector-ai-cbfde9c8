
# Error Handling Guidelines

This document outlines the error handling strategy for the Wireframe Studio application, providing guidelines for consistent error management across the codebase.

## Core Principles

1. **User-Facing Errors**: Always provide clear, actionable error messages to users
2. **Error Logging**: Log all errors with sufficient context for debugging
3. **Graceful Degradation**: Components should fail in isolation without crashing the entire application
4. **Error Recovery**: Where possible, provide retry mechanisms and recovery paths

## Error Boundary Usage

Error boundaries are React components that catch JavaScript errors in their child component tree, log those errors, and display a fallback UI.

### When to Use Error Boundaries

- Around top-level route components
- Around complex, data-driven components
- Around third-party integrations
- Around features that are not critical to the application's core functionality

### Implementation Pattern

```tsx
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Component usage
const MyComponent = () => {
  return (
    <ErrorBoundary>
      <ComplexComponent />
    </ErrorBoundary>
  );
};

// Page usage
const MyPage = () => {
  return (
    <ErrorBoundary>
      <PageContent />
    </ErrorBoundary>
  );
};
```

## Client Error Logging

The application uses a centralized error logging system through the `recordClientError` and `logClientError` functions.

### Logging Errors

```tsx
import { logClientError } from '@/utils/monitoring/client-error-logger';

try {
  // Risky code
} catch (error) {
  logClientError(
    error instanceof Error ? error : new Error("Operation failed"),
    "ComponentName",
    userId, // Optional
    true, // Show toast notification
    { additionalContext: "More details" } // Optional metadata
  );
}
```

## Async Error Handling

For async operations, use the `useGlobalErrorHandler` hook:

```tsx
import { useGlobalErrorHandler } from '@/hooks/use-global-error-handler';

const MyComponent = () => {
  const { wrapPromise, handleError, error, isLoading } = useGlobalErrorHandler({
    component: 'MyComponent',
    toastOnError: true
  });
  
  const fetchData = async () => {
    try {
      const data = await wrapPromise(
        api.fetchSomething(), 
        'Fetching data',
        { retryCount: 1 }
      );
      return data;
    } catch (err) {
      handleError(err, 'Failed to load data');
      return null;
    }
  };
};
```

## Toast Notifications

Use toast notifications for user-facing errors:

```tsx
import { toast } from 'sonner';

toast.error("Operation failed", {
  description: "Please try again or contact support",
  action: {
    label: "Retry",
    onClick: () => retry()
  }
});
```

## Network Error Handling

The application intercepts fetch errors globally, but specific API calls should handle errors locally:

```tsx
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    logClientError(error, 'DataFetcher');
    throw error; // Re-throw to allow the caller to handle it
  }
};
```

## Error Boundaries and Suspense

When using React Suspense, wrap with error boundaries:

```tsx
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

## Best Practices

1. Never silently swallow errors
2. Use type checking to prevent type-related runtime errors
3. Provide fallback UI for loading and error states
4. Use meaningful error messages with clear next steps
5. Include context in error logs (component name, user action, data)
6. Monitor error rates in production

By following these guidelines, we ensure a robust error handling strategy across the application.
