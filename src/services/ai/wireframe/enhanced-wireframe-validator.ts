
import { 
  WireframeData, 
  WireframeSection, 
  WireframeComponent, 
  WireframeGenerationParams 
} from './wireframe-types';
import { ErrorHandler } from '@/utils/error-handler';
import { WireframeError, WireframeErrorType } from '@/types/error-types';

/**
 * Enhanced validator for wireframe data with strict typechecking
 */
export class WireframeValidator {
  /**
   * Validate wireframe generation parameters
   * @throws WireframeError if validation fails
   */
  static validateGenerationParams(params: WireframeGenerationParams): void {
    const fieldErrors: Record<string, string> = {};
    
    // Check required fields
    if (!params.description || params.description.trim().length === 0) {
      fieldErrors.description = 'Description is required';
    } else if (params.description.trim().length < 10) {
      fieldErrors.description = 'Description should be at least 10 characters long for better results';
    }
    
    // Validate creativity level if provided
    if (params.creativityLevel !== undefined) {
      if (typeof params.creativityLevel !== 'number') {
        fieldErrors.creativityLevel = 'Creativity level must be a number';
      } else if (params.creativityLevel < 1 || params.creativityLevel > 10) {
        fieldErrors.creativityLevel = 'Creativity level must be between 1 and 10';
      }
    }
    
    // Validate color scheme if provided
    if (params.colorScheme) {
      if (typeof params.colorScheme !== 'object') {
        fieldErrors.colorScheme = 'Color scheme must be an object';
      } else {
        // Check if color values are valid hex codes or color names
        for (const [key, value] of Object.entries(params.colorScheme)) {
          if (value && !this.isValidColor(value)) {
            fieldErrors[`colorScheme.${key}`] = `Invalid color value for ${key}: ${value}`;
          }
        }
      }
    }
    
    // Throw validation error if there are any field errors
    if (Object.keys(fieldErrors).length > 0) {
      throw new WireframeError(
        'Invalid wireframe generation parameters',
        WireframeErrorType.INVALID_PARAMS,
        { fieldErrors }
      );
    }
  }
  
  /**
   * Validate wireframe data structure
   * @throws WireframeError if validation fails
   */
  static validateWireframeData(wireframe: WireframeData): void {
    const fieldErrors: Record<string, string> = {};
    
    // Check required fields
    if (!wireframe.id) fieldErrors.id = 'Wireframe ID is required';
    if (!wireframe.title) fieldErrors.title = 'Wireframe title is required';
    
    // Validate sections
    if (!Array.isArray(wireframe.sections)) {
      fieldErrors.sections = 'Sections must be an array';
    } else {
      wireframe.sections.forEach((section, index) => {
        try {
          this.validateSection(section);
        } catch (error) {
          if (error instanceof WireframeError) {
            fieldErrors[`sections[${index}]`] = error.message;
          }
        }
      });
    }
    
    // Validate color scheme
    if (!wireframe.colorScheme) {
      fieldErrors.colorScheme = 'Color scheme is required';
    } else {
      // Check required color properties
      const requiredColors = ['primary', 'secondary', 'accent', 'background', 'text'];
      requiredColors.forEach(color => {
        if (!wireframe.colorScheme[color]) {
          fieldErrors[`colorScheme.${color}`] = `${color} color is required`;
        } else if (!this.isValidColor(wireframe.colorScheme[color])) {
          fieldErrors[`colorScheme.${color}`] = `Invalid color value: ${wireframe.colorScheme[color]}`;
        }
      });
    }
    
    // Validate typography
    if (!wireframe.typography) {
      fieldErrors.typography = 'Typography settings are required';
    } else {
      // Check required typography properties
      if (!wireframe.typography.headings) fieldErrors['typography.headings'] = 'Headings font is required';
      if (!wireframe.typography.body) fieldErrors['typography.body'] = 'Body font is required';
    }
    
    // Throw validation error if there are any field errors
    if (Object.keys(fieldErrors).length > 0) {
      throw new WireframeError(
        'Invalid wireframe data structure',
        WireframeErrorType.VALIDATION_ERROR,
        { fieldErrors }
      );
    }
  }
  
  /**
   * Validate a wireframe section
   * @throws WireframeError if validation fails
   */
  static validateSection(section: WireframeSection): void {
    const fieldErrors: Record<string, string> = {};
    
    // Check required fields
    if (!section.id) fieldErrors.id = 'Section ID is required';
    if (!section.name) fieldErrors.name = 'Section name is required';
    if (!section.sectionType) fieldErrors.sectionType = 'Section type is required';
    
    // Validate position
    if (!section.position) {
      fieldErrors.position = 'Section position is required';
    } else {
      if (typeof section.position.x !== 'number') fieldErrors['position.x'] = 'X position must be a number';
      if (typeof section.position.y !== 'number') fieldErrors['position.y'] = 'Y position must be a number';
    }
    
    // Validate dimensions
    if (!section.dimensions) {
      fieldErrors.dimensions = 'Section dimensions are required';
    } else {
      if (!section.dimensions.width) fieldErrors['dimensions.width'] = 'Width is required';
      if (!section.dimensions.height) fieldErrors['dimensions.height'] = 'Height is required';
    }
    
    // Throw validation error if there are any field errors
    if (Object.keys(fieldErrors).length > 0) {
      throw new WireframeError(
        'Invalid wireframe section',
        WireframeErrorType.VALIDATION_ERROR,
        { fieldErrors }
      );
    }
  }
  
  /**
   * Checks if a value is a valid color
   */
  static isValidColor(color: string): boolean {
    // Check if it's a valid hex color
    const hexPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    if (hexPattern.test(color)) {
      return true;
    }
    
    // Check if it's a valid named color
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    return tempElement.style.color !== '';
  }
  
  /**
   * Safe validation that returns validation result instead of throwing
   */
  static safeValidateGenerationParams(params: WireframeGenerationParams): { 
    valid: boolean; 
    errors?: Record<string, string>;
  } {
    try {
      this.validateGenerationParams(params);
      return { valid: true };
    } catch (error) {
      if (error instanceof WireframeError) {
        return { 
          valid: false, 
          errors: error.context?.fieldErrors as Record<string, string>
        };
      }
      return { valid: false, errors: { '_general': 'Validation failed' } };
    }
  }
  
  /**
   * Safe validation for wireframe data that returns validation result instead of throwing
   */
  static safeValidateWireframeData(wireframe: WireframeData): { 
    valid: boolean; 
    errors?: Record<string, string>;
  } {
    try {
      this.validateWireframeData(wireframe);
      return { valid: true };
    } catch (error) {
      if (error instanceof WireframeError) {
        return { 
          valid: false, 
          errors: error.context?.fieldErrors as Record<string, string>
        };
      }
      return { valid: false, errors: { '_general': 'Validation failed' } };
    }
  }
}
