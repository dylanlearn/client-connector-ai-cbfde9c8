
# Testing Guide for Wireframe Studio

This project uses Vitest for testing React hooks and components. This document provides guidelines for running and writing tests.

## Running Tests

To run the tests, use the following command:

```bash
npx vitest
```

To run tests with coverage:

```bash
npx vitest --coverage
```

To run a specific test file:

```bash
npx vitest src/utils/wireframe/__tests__/export-utils.test.ts
```

To run tests in watch mode:

```bash
npx vitest --watch
```

## Test Structure

Tests are organized alongside the code they're testing:

- `src/utils/wireframe/__tests__/` - Tests for wireframe utilities
- `src/hooks/wireframe/__tests__/` - Tests for wireframe hooks
- `src/components/wireframe/export/__tests__/` - Tests for wireframe export components
- `src/test/setup.ts` - Global test setup and mocks

## Writing New Tests

When writing new tests:

1. Create a test file in the `__tests__` directory next to the code you're testing
2. Import the necessary testing utilities from Vitest and Testing Library
3. Mock any external dependencies
4. Write your test cases following the AAA (Arrange-Act-Assert) pattern
5. Test both success and error paths

### Example Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { someFunction } from '../your-module';

describe('YourModule', () => {
  beforeEach(() => {
    // Setup code before each test
    vi.clearAllMocks();
  });

  it('should handle success case', () => {
    // Arrange
    const input = { /* test data */ };
    
    // Act
    const result = someFunction(input);
    
    // Assert
    expect(result).toEqual(/* expected output */);
  });

  it('should handle error case', () => {
    // Arrange
    const invalidInput = { /* invalid data */ };
    
    // Act & Assert
    expect(() => someFunction(invalidInput)).toThrow();
  });
});
```

## Mocking Dependencies

Common dependencies are mocked in `src/test/setup.ts`:

- Supabase client
- Toast notifications
- localStorage
- fetch API
- ResizeObserver and IntersectionObserver
- html2canvas and jsPDF for export functionality

For component-specific mocks, define them in the individual test files.

## Test Coverage Goals

Our target for test coverage is:

- Functions: 80%+
- Branches: 70%+
- Lines: 75%+
- Statements: 75%+

Focus on testing:
- Critical business logic
- Error handling paths
- Edge cases
- User interactions

## Debugging Tests

If tests are failing, you can use the following strategies:

1. Run a single test with debug output:
   ```
   npx vitest debug src/path/to/test.ts
   ```

2. Use `console.log` statements in your test
   ```typescript
   it('should work', () => {
     const result = myFunction();
     console.log('Result:', result);
     expect(result).toBe(true);
   });
   ```

3. Use the `debug()` function from Testing Library for component tests:
   ```typescript
   import { render, screen, debug } from '@testing-library/react';
   
   it('renders correctly', () => {
     render(<MyComponent />);
     debug();
     expect(screen.getByText('Hello')).toBeInTheDocument();
   });
   ```

## Best Practices

- Keep tests simple and focused on a single piece of functionality
- Use descriptive test and describe names
- Prefer multiple focused tests over large complex tests
- Test both normal and error cases
- Use data-testid attributes for component testing
- Clean up any side effects in afterEach blocks
- Don't test implementation details, test behavior
