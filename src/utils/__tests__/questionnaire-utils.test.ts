
import { describe, it, expect } from 'vitest';
import { generateFollowUp } from '../questionnaire-utils';

describe('questionnaire-utils', () => {
  describe('generateFollowUp', () => {
    // Tests for question 1 (main purpose)
    it('should return null if answer is empty', () => {
      expect(generateFollowUp('q1', '')).toBeNull();
    });

    it('should return null if answer is too long (>50 chars)', () => {
      const longAnswer = 'This is a really long answer that exceeds fifty characters in length and should not generate any follow-up questions';
      expect(generateFollowUp('q1', longAnswer)).toBeNull();
    });

    it('should return ecommerce-specific follow-up for q1 when answer mentions ecommerce', () => {
      const expected = "Could you specify what kind of products you'll be selling and if you have any specific requirements for the shopping experience?";
      expect(generateFollowUp('q1', 'I need an ecommerce website')).toBe(expected);
      expect(generateFollowUp('q1', 'Looking to set up an online shop')).toBe(expected);
    });

    it('should return generic follow-up for q1 when answer does not mention ecommerce', () => {
      const expected = "Could you elaborate on the specific functions or features your website should have to fulfill this purpose?";
      expect(generateFollowUp('q1', 'I need a blog')).toBe(expected);
    });

    // Tests for question 2 (target audience)
    it('should return specific follow-up for q2 when answer is too general', () => {
      const expected = "Targeting everyone often means reaching no one effectively. Could you specify the primary demographics or user groups that would most benefit from your product/service?";
      expect(generateFollowUp('q2', 'everyone')).toBe(expected);
      expect(generateFollowUp('q2', 'My target audience is all people')).toBe(expected);
    });

    it('should return generic follow-up for q2 when answer is specific', () => {
      const expected = "What are the specific needs or pain points of this target audience that your website should address?";
      expect(generateFollowUp('q2', 'Young professionals aged 25-35')).toBe(expected);
    });

    // Tests for question 3 (goals)
    it('should return standard follow-up for q3', () => {
      const expected = "Which of these goals would you consider your top priority, and how would you measure success?";
      expect(generateFollowUp('q3', 'Increase sales and brand awareness')).toBe(expected);
    });

    // Tests for question 4 (websites they like)
    it('should return standard follow-up for q4', () => {
      const expected = "For these websites you like, are there specific sections or features that you particularly want to emulate?";
      expect(generateFollowUp('q4', 'I like apple.com, nike.com and airbnb.com')).toBe(expected);
    });

    // Tests for other questions
    it('should return null for questions without defined follow-ups', () => {
      expect(generateFollowUp('q5', 'Blue (#0000FF) and Green (#00FF00)')).toBeNull();
      expect(generateFollowUp('q6', 'Some answer')).toBeNull();
    });
  });
});
