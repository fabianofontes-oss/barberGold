
import { describe, it, expect, vi, beforeEach } from 'vitest';

// MOCKING ENV VARS
// Ideally we would set these in vitest.config.ts or .env.test but this is faster for now
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.com';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
process.env.NEXT_PUBLIC_APP_MODE = 'demo';

import { sanitizeSettingsForStorage } from '../../src/context/BarberContext';

describe('Security: Storage Sanitization', () => {
  it('should remove sensitive Stripe keys from storage', () => {
    const data = {
      shopSettings: {
        gatewayConfig: {
          stripe: {
            publishableKey: 'pk_live_123',
            secretKey: 'sk_live_SECRET',
            enabled: true
          }
        }
      }
    };

    const sanitized = sanitizeSettingsForStorage(data);

    expect(sanitized.shopSettings.gatewayConfig.stripe.publishableKey).toBe('pk_live_123');
    expect(sanitized.shopSettings.gatewayConfig.stripe.secretKey).toBeUndefined();
  });

  it('should remove sensitive PagSeguro keys from storage', () => {
    const data = {
      shopSettings: {
        gatewayConfig: {
          pagSeguro: {
            email: 'test@example.com',
            token: 'SECRET_TOKEN',
            enabled: true
          }
        }
      }
    };

    const sanitized = sanitizeSettingsForStorage(data);

    expect(sanitized.shopSettings.gatewayConfig.pagSeguro.email).toBe('test@example.com');
    expect(sanitized.shopSettings.gatewayConfig.pagSeguro.token).toBeUndefined();
  });

  it('should remove sensitive MercadoPago keys from storage', () => {
    const data = {
      shopSettings: {
        gatewayConfig: {
          mercadoPago: {
            publicKey: 'pk_test',
            accessToken: 'access_token_SECRET',
            enabled: true
          }
        }
      }
    };

    const sanitized = sanitizeSettingsForStorage(data);

    expect(sanitized.shopSettings.gatewayConfig.mercadoPago.publicKey).toBe('pk_test');
    expect(sanitized.shopSettings.gatewayConfig.mercadoPago.accessToken).toBeUndefined();
  });

  it('should treat the input data as immutable (deep copy check)', () => {
     const data = {
        shopSettings: {
          gatewayConfig: {
             stripe: {
                secretKey: 'SENSITIVE'
             }
          }
        }
     };

     const sanitized = sanitizeSettingsForStorage(data);

     // Original object must NOT be modified
     expect(data.shopSettings.gatewayConfig.stripe.secretKey).toBe('SENSITIVE');
     // Sanitized object must be clean
     expect(sanitized.shopSettings.gatewayConfig.stripe.secretKey).toBeUndefined();
  });

});
