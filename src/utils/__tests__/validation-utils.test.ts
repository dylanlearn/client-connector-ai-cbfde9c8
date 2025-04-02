
import { validatePersonalMessage, VALIDATION_CONSTANTS } from '../validation-utils';

describe('Validation Utilities', () => {
  describe('validatePersonalMessage', () => {
    it('should return valid for null message', () => {
      const result = validatePersonalMessage(null);
      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    it('should return valid for undefined message', () => {
      const result = validatePersonalMessage(undefined);
      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    it('should return valid for empty message', () => {
      const result = validatePersonalMessage('');
      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    it('should return valid for message within max length', () => {
      const message = 'A'.repeat(VALIDATION_CONSTANTS.MAX_PERSONAL_MESSAGE_LENGTH);
      const result = validatePersonalMessage(message);
      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    it('should return invalid for message exceeding max length', () => {
      const message = 'A'.repeat(VALIDATION_CONSTANTS.MAX_PERSONAL_MESSAGE_LENGTH + 1);
      const result = validatePersonalMessage(message);
      expect(result.valid).toBe(false);
      expect(result.errorMessage).toContain(`must be ${VALIDATION_CONSTANTS.MAX_PERSONAL_MESSAGE_LENGTH} characters or less`);
    });
  });
});
