
/**
 * Type guard utility functions to ensure data is of the correct type
 */

import { WireframeSection, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { ComponentDefinition } from '@/components/wireframe/registry/component-types';
import { DeviceType } from '@/components/wireframe/preview/DeviceInfo';

/**
 * Ensures an array of unknown items is cast to an array of strings
 * Filters out any non-string values
 */
export function toStringArray(arr: unknown[]): string[] {
  return arr.filter(item => typeof item === 'string') as string[];
}

/**
 * Type guard to check if an object is a valid WireframeSection
 */
export function isWireframeSection(obj: unknown): obj is WireframeSection {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as WireframeSection).id === 'string'
  );
}

/**
 * Type guard to check if an object is a valid WireframeComponent
 */
export function isWireframeComponent(obj: unknown): obj is WireframeComponent {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'type' in obj &&
    typeof (obj as WireframeComponent).id === 'string' &&
    typeof (obj as WireframeComponent).type === 'string'
  );
}

/**
 * Type guard to check if a value is a valid DeviceType
 */
export function isValidDeviceType(value: string): value is DeviceType {
  return ['desktop', 'tablet', 'tabletLandscape', 'mobile', 'mobileLandscape', 'mobileSm'].includes(value);
}

/**
 * Type guard to check if an object has a property of a specific type
 */
export function hasProperty<T, K extends string>(
  obj: T, 
  prop: K, 
  type: 'string' | 'number' | 'boolean' | 'object' | 'function'
): obj is T & { [P in K]: unknown } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    prop in obj &&
    typeof (obj as any)[prop] === type
  );
}

/**
 * Safely cast a value to a specific type or return a default
 * @param value The value to cast
 * @param defaultValue Default value to return if casting fails
 * @returns The cast value or the default
 */
export function safeTypeCast<T>(value: unknown, defaultValue: T): T {
  try {
    return value as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Assert a condition at runtime
 * @param condition Condition to check
 * @param message Error message if condition is false
 * @throws Error if condition is false
 */
export function assertType(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Type assertion failed: ${message}`);
  }
}
