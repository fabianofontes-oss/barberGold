import { ShopSettings } from '@/types';

export function sanitizeShopSettings(settings: ShopSettings): ShopSettings {
  if (!settings) return settings;

  const sanitized: ShopSettings = JSON.parse(JSON.stringify(settings));

  if (sanitized.gatewayConfig) {
    if (sanitized.gatewayConfig.mercadoPago) {
      sanitized.gatewayConfig.mercadoPago.accessToken = '';
    }
    if (sanitized.gatewayConfig.pagSeguro) {
      sanitized.gatewayConfig.pagSeguro.token = '';
    }
    if (sanitized.gatewayConfig.stripe) {
      sanitized.gatewayConfig.stripe.secretKey = '';
    }
    if (sanitized.gatewayConfig.infinitePay) {
      sanitized.gatewayConfig.infinitePay.apiKey = '';
      sanitized.gatewayConfig.infinitePay.appKey = '';
    }
    if (sanitized.gatewayConfig.stone) {
      sanitized.gatewayConfig.stone.apiKey = '';
    }
  }

  // Pix key might be considered sensitive if it's a CPF/Phone that shouldn't be exposed,
  // but it's needed for payment generation on client side (QR Code).
  // However, we should check if we want to expose it.
  // The 'Settings.tsx' shows it uses `generatePixPayload` on the client side, so it NEEDS the key.
  // So we cannot redact Pix Key if we want the client to generate QR codes.
  // We will leave Pix config as is, assuming it's public info (Pix key is public).

  return sanitized;
}
