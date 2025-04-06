
import { expect } from 'vitest';

/**
 * Test helper functions for working with UI components
 */

/**
 * Checks if a string contains any of the specified substrings
 * @param text The text to check
 * @param substrings Array of substrings to look for
 * @returns true if any substring is found
 */
export function containsAny(text: string, substrings: string[]): boolean {
  return substrings.some(substring => text.includes(substring));
}

/**
 * Checks if a component renders with expected content
 * @param component The rendered component
 * @param expectedText Text that should be present
 */
export function expectTextContent(component: { textContent: string }, expectedText: string): void {
  expect(component.textContent).toContain(expectedText);
}

/**
 * Checks if the string matches the regex pattern
 * @param str String to check
 * @param pattern Regex pattern to match against
 */
export function matchesPattern(str: string, pattern: RegExp): boolean {
  return pattern.test(str);
}

/**
 * Generates mock data for testing
 * @param type Type of mock data to generate
 * @param count Number of mock items to create
 */
export function generateMockData(type: string, count: number = 1): any[] {
  // Implementation depends on the type of mock data needed
  return Array(count).fill(null).map((_, index) => ({
    id: `mock-${type}-${index}`,
    name: `Mock ${type} ${index}`,
    createdAt: new Date().toISOString()
  }));
}

/**
 * Creates a mock fetch function for testing API calls
 */
export function mockFetch(response: any, status = 200): jest.Mock {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response))
    })
  );
}

/**
 * Creates a mock Supabase client for testing
 */
export function createMockSupabaseClient() {
  return {
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      user: jest.fn(),
      session: jest.fn()
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      then: jest.fn()
    })
  };
}
