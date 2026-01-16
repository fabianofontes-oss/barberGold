import { z } from 'zod';

// ===================================
// AUTH SCHEMAS
// ===================================

/**
 * Validation for user login
 * Enforces email format and password presence.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    // We don't enforce complexity on login to avoid leaking password policy to attackers
    // or frustrating legacy users, but we enforce presence.
});

/**
 * Validation for user registration
 * Enforces strict password policy and email format.
 */
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long')
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
