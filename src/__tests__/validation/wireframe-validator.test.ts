
import { describe, it, expect } from 'vitest';
import { WireframeValidator } from '@/services/ai/wireframe/enhanced-wireframe-validator';
import { WireframeError, WireframeErrorType } from '@/types/error-types';

describe('WireframeValidator', () => {
  describe('validateGenerationParams', () => {
    it('should validate valid generation params', () => {
      // Arrange
      const validParams = {
        description: 'A landing page for a SaaS product',
        projectId: '123',
        creativityLevel: 8,
        colorScheme: { primary: '#3182ce' }
      };
      
      // Act & Assert
      expect(() => WireframeValidator.validateGenerationParams(validParams)).not.toThrow();
    });
    
    it('should throw error for missing description', () => {
      // Arrange
      const invalidParams = {
        description: '',
        projectId: '123'
      };
      
      // Act & Assert
      expect(() => WireframeValidator.validateGenerationParams(invalidParams))
        .toThrow(WireframeError);
    });
    
    it('should throw error for invalid creativity level', () => {
      // Arrange
      const invalidParams = {
        description: 'A landing page',
        creativityLevel: 15 // Invalid: too high
      };
      
      // Act & Assert
      expect(() => WireframeValidator.validateGenerationParams(invalidParams))
        .toThrow(WireframeError);
    });
  });
  
  describe('validateWireframeData', () => {
    it('should validate valid wireframe data', () => {
      // Arrange
      const validWireframe = {
        id: '123',
        title: 'Test Wireframe',
        description: 'A test wireframe',
        sections: [
          {
            id: 'section1',
            name: 'Header',
            sectionType: 'header',
            position: { x: 0, y: 0 },
            dimensions: { width: '100%', height: 80 }
          }
        ],
        colorScheme: {
          primary: '#3182ce',
          secondary: '#805ad5',
          accent: '#ed8936',
          background: '#ffffff',
          text: '#1a202c'
        },
        typography: {
          headings: 'Inter',
          body: 'Inter'
        }
      };
      
      // Act & Assert
      expect(() => WireframeValidator.validateWireframeData(validWireframe)).not.toThrow();
    });
    
    it('should throw error for missing wireframe fields', () => {
      // Arrange
      const invalidWireframe = {
        id: '123'
        // Missing required fields
      };
      
      // Act & Assert
      expect(() => WireframeValidator.validateWireframeData(invalidWireframe as any))
        .toThrow(WireframeError);
    });
  });
  
  describe('safeValidateGenerationParams', () => {
    it('should return valid:true for valid params', () => {
      // Arrange
      const validParams = {
        description: 'A landing page for a SaaS product',
        creativityLevel: 8
      };
      
      // Act
      const result = WireframeValidator.safeValidateGenerationParams(validParams);
      
      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
    
    it('should return valid:false with errors for invalid params', () => {
      // Arrange
      const invalidParams = {
        description: '' // Invalid: empty
      };
      
      // Act
      const result = WireframeValidator.safeValidateGenerationParams(invalidParams);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.description).toBeDefined();
    });
  });
});

