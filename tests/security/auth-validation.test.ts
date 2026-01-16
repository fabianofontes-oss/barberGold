
import { describe, it, expect } from 'vitest';
import { loginSchema, signUpSchema } from '../../src/modules/auth/schemas';

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email format');
      }
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('signUpSchema', () => {
    it('should validate valid signup data', () => {
      const result = signUpSchema.safeParse({
        email: 'newuser@example.com',
        password: 'securePassword123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short passwords', () => {
      const result = signUpSchema.safeParse({
        email: 'newuser@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 6 characters');
      }
    });

    it('should reject invalid email format', () => {
      const result = signUpSchema.safeParse({
        email: 'not-an-email',
        password: 'validPassword123',
      });
      expect(result.success).toBe(false);
    });
  });
});
