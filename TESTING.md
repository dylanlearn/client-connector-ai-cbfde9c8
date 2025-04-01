
# Testing Client Hub Hooks

This project uses Vitest for testing React hooks and components.

## Running Tests

To run the tests, use the following command:

```bash
npx vitest
```

To run tests with coverage:

```bash
npx vitest --coverage
```

## Test Structure

Tests are organized alongside the code they're testing:

- `src/hooks/client-hub/__tests__/` - Tests for client hub hooks
- `src/test/setup.ts` - Global test setup and mocks

## Adding New Tests

When adding new tests:

1. Create a new test file in the `__tests__` directory next to the code you're testing
2. Import the necessary testing utilities from Vitest and Testing Library
3. Mock any external dependencies
4. Write your test cases

## Available Mocks

Common dependencies are mocked in `src/test/setup.ts`:

- Supabase client
- Toast notifications
- matchMedia (for responsive design tests)

For component-specific mocks, define them in the individual test files.
