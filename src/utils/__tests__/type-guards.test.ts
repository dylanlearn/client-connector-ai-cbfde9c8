
import { describe, it, expect } from 'vitest';
import { 
  toStringArray, 
  isWireframeSection, 
  isWireframeComponent, 
  isValidDeviceType,
  hasProperty,
  safeTypeCast,
  assertType
} from '../type-guards';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

describe('Type guard utilities', () => {
  describe('toStringArray', () => {
    it('should filter out non-string values', () => {
      const mixedArray = ['string', 123, true, 'another string', null, undefined];
      const result = toStringArray(mixedArray);
      
      expect(result).toEqual(['string', 'another string']);
      expect(result.length).toBe(2);
    });
    
    it('should return empty array if no strings provided', () => {
      const nonStringArray = [1, 2, 3, true, false, null, undefined];
      const result = toStringArray(nonStringArray);
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });
  
  describe('isWireframeSection', () => {
    it('should return true for valid WireframeSection objects', () => {
      const validSection = {
        id: '123',
        name: 'Test Section',
        type: 'hero',
        components: []
      };
      
      expect(isWireframeSection(validSection)).toBe(true);
    });
    
    it('should return false for non-objects', () => {
      expect(isWireframeSection('not an object')).toBe(false);
      expect(isWireframeSection(123)).toBe(false);
      expect(isWireframeSection(null)).toBe(false);
      expect(isWireframeSection(undefined)).toBe(false);
    });
    
    it('should return false for objects without id', () => {
      const invalidSection = {
        name: 'Test Section',
        type: 'hero',
        components: []
      };
      
      expect(isWireframeSection(invalidSection)).toBe(false);
    });
    
    it('should return false for objects with non-string id', () => {
      const invalidSection = {
        id: 123,
        name: 'Test Section',
        type: 'hero'
      };
      
      expect(isWireframeSection(invalidSection)).toBe(false);
    });
  });
  
  describe('isWireframeComponent', () => {
    it('should return true for valid WireframeComponent objects', () => {
      const validComponent = {
        id: '123',
        type: 'button',
        content: 'Click me'
      };
      
      expect(isWireframeComponent(validComponent)).toBe(true);
    });
    
    it('should return false for non-objects', () => {
      expect(isWireframeComponent('not an object')).toBe(false);
      expect(isWireframeComponent(123)).toBe(false);
      expect(isWireframeComponent(null)).toBe(false);
      expect(isWireframeComponent(undefined)).toBe(false);
    });
    
    it('should return false for objects without required fields', () => {
      const missingId = { type: 'button', content: 'Click me' };
      const missingType = { id: '123', content: 'Click me' };
      const wrongTypes = { id: 123, type: 456 };
      
      expect(isWireframeComponent(missingId)).toBe(false);
      expect(isWireframeComponent(missingType)).toBe(false);
      expect(isWireframeComponent(wrongTypes)).toBe(false);
    });
  });
  
  describe('isValidDeviceType', () => {
    it('should return true for valid device types', () => {
      expect(isValidDeviceType('desktop')).toBe(true);
      expect(isValidDeviceType('tablet')).toBe(true);
      expect(isValidDeviceType('mobile')).toBe(true);
      expect(isValidDeviceType('tabletLandscape')).toBe(true);
      expect(isValidDeviceType('mobileLandscape')).toBe(true);
      expect(isValidDeviceType('mobileSm')).toBe(true);
    });
    
    it('should return false for invalid device types', () => {
      expect(isValidDeviceType('invalid')).toBe(false);
      expect(isValidDeviceType('DESKTOP')).toBe(false);
      expect(isValidDeviceType('')).toBe(false);
    });
  });
  
  describe('hasProperty', () => {
    it('should return true when object has property of correct type', () => {
      const obj = { name: 'John', age: 30, active: true };
      
      expect(hasProperty(obj, 'name', 'string')).toBe(true);
      expect(hasProperty(obj, 'age', 'number')).toBe(true);
      expect(hasProperty(obj, 'active', 'boolean')).toBe(true);
    });
    
    it('should return false when object does not have the property', () => {
      const obj = { name: 'John' };
      
      expect(hasProperty(obj, 'age', 'number')).toBe(false);
    });
    
    it('should return false when property is of wrong type', () => {
      const obj = { name: 'John', age: '30' };
      
      expect(hasProperty(obj, 'age', 'number')).toBe(false);
    });
    
    it('should return false for non-objects', () => {
      expect(hasProperty('not an object', 'length', 'number')).toBe(false);
      expect(hasProperty(null, 'prop', 'string')).toBe(false);
      expect(hasProperty(undefined, 'prop', 'string')).toBe(false);
    });
  });
  
  describe('safeTypeCast', () => {
    it('should cast value when possible', () => {
      const value = { id: '123', name: 'Test' };
      const result = safeTypeCast<{ id: string }>(value, { id: 'default' });
      
      expect(result).toBe(value);
      expect(result.id).toBe('123');
    });
    
    it('should return default value when casting fails', () => {
      const defaultValue = { id: 'default' };
      const result = safeTypeCast<{ id: string }>(null, defaultValue);
      
      expect(result).toBe(defaultValue);
      expect(result.id).toBe('default');
    });
  });
  
  describe('assertType', () => {
    it('should not throw when condition is true', () => {
      expect(() => assertType(true, 'This should not throw')).not.toThrow();
    });
    
    it('should throw when condition is false', () => {
      expect(() => assertType(false, 'Test error message')).toThrow('Type assertion failed: Test error message');
    });
  });
});
