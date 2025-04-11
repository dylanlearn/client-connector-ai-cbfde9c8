# Type System Documentation

This document provides comprehensive guidance on the type system used throughout the Wireframe Studio application, intended to help maintain type safety and consistency across the codebase.

## Table of Contents

1. [Type Safety Principles](#type-safety-principles)
2. [Core Type Definitions](#core-type-definitions)
3. [Common Type Patterns](#common-type-patterns)
4. [Type Guards](#type-guards)
5. [Handling Component Props](#handling-component-props)
6. [Working with External Libraries](#working-with-external-libraries)
7. [Testing Types](#testing-types)

## Type Safety Principles

We follow these principles to maintain type safety throughout the application:

1. **Explicit over implicit**: Always define explicit types rather than relying on inference
2. **Single source of truth**: Define shared types in dedicated files
3. **Strict null checks**: Handle null and undefined explicitly
4. **Discriminated unions**: Use tagged unions for complex state
5. **Avoid `any`**: Use `unknown` when type is truly unknown, then narrow with type guards
6. **Readonly when appropriate**: Use readonly properties and arrays when mutation is not needed

## Core Type Definitions

### Wireframe Types

The fundamental types for the wireframe system are defined in `src/services/ai/wireframe/wireframe-types.ts`:

```typescript
export interface WireframeSection {
  id: string;
  name?: string;
  type?: string;
  sectionType?: string;
  // Other properties...
}

export interface WireframeComponent {
  id: string;
  type: string;
  // Other properties...
}

export interface WireframeData {
  id: string;
  title: string;
  sections: WireframeSection[];
  // Other properties...
}
```

### Component Types

Component type definitions are maintained in `src/components/wireframe/registry/component-types.ts`:

```typescript
export interface ComponentField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'number' | 'color' | 'image' | 'array' | 'object' | 'richtext';
  // Other properties...
}

export interface ComponentDefinition {
  type: string;
  name: string;
  variants: ComponentVariant[];
  fields: ComponentField[];
  // Other properties...
}
```

### Device and Responsive Types

Device type definitions are in `src/components/wireframe/preview/DeviceInfo.ts`:

```typescript
export type DeviceType = 'desktop' | 'tablet' | 'tabletLandscape' | 'mobile' | 'mobileLandscape' | 'mobileSm';

export interface DeviceDimensions {
  name: string;
  width: number;
  height: number;
  // Other properties...
}
```

## Common Type Patterns

### Discriminated Unions

Use discriminated unions for complex state with different behaviors:

```typescript
// Good practice
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: Data }
  | { status: 'error', error: Error };

// Usage
if (state.status === 'success') {
  // TypeScript knows data is available here
  console.log(state.data);
}
```

### Generic Components

Create flexible, type-safe components with generics:

```typescript
interface DataListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function DataList<T>(props: DataListProps<T>) {
  // Implementation
}
```

### Mapped Types

Use mapped types to transform existing types:

```typescript
// Creating a read-only version of a type
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Making all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

## Type Guards

Type guards help narrow types at runtime. Define custom type guards in `src/utils/type-guards.ts`:

```typescript
// Example type guard
export function isWireframeSection(obj: unknown): obj is WireframeSection {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as WireframeSection).id === 'string'
  );
}
```

## Handling Component Props

### Props Interface Pattern

Every component should have an explicit props interface:

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

// React.FC is optional but provides better type inference for children
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
}) => {
  // Implementation
};
```

### Event Handler Types

Use proper event types for handlers:

```typescript
// For DOM events
interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// For custom events
interface CustomEventHandler<T> {
  (data: T): void;
}

interface DataGridProps {
  onRowSelect: CustomEventHandler<{ id: string, index: number }>;
}
```

## Working with External Libraries

### Type Definitions for Libraries

Always check if a library has official or DefinitelyTyped type definitions:

```bash
# Check for built-in types
npm info some-library types

# Install DefinitelyTyped types if needed
npm install --save-dev @types/some-library
```

### Module Augmentation

Extend third-party module types when necessary:

```typescript
// In a declaration file (*.d.ts)
declare module 'some-library' {
  export interface SomeInterface {
    newProperty: string;
  }
  
  export function newFunction(): void;
}
```

## Testing Types

### Type Testing

Use TypeScript's conditional types to verify types during compilation:

```typescript
// Type assertion function
function assertType<T, Expected>(value: T): asserts value is Expected {
  // This does nothing at runtime
  // It only verifies that T is assignable to Expected
}

// Usage
const value = getWireframeSection();
assertType<typeof value, WireframeSection>(value);
```

### Testing Type Guards

Test type guards with specific test cases:

```typescript
describe('isWireframeSection type guard', () => {
  it('returns true for valid wireframe sections', () => {
    const section = { id: '123', type: 'hero' };
    expect(isWireframeSection(section)).toBe(true);
  });
  
  it('returns false for non-objects', () => {
    expect(isWireframeSection('not an object')).toBe(false);
  });
  
  it('returns false for objects missing required fields', () => {
    expect(isWireframeSection({ type: 'hero' })).toBe(false);
  });
});
```

---

By following these guidelines and maintaining a strong typing discipline, we can ensure type safety throughout the application and catch errors at compile time rather than runtime.
