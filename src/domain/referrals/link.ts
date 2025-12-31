import { ReferralLinkInput } from './types';

export function buildReferralUrl(input: ReferralLinkInput, baseUrl = 'https://barberflow.app'): string {
  const trimmedBase = baseUrl.replace(/\/$/, '');
  return `${trimmedBase}/r/${encodeURIComponent(input.code)}`;
}

export function parseReferralCodeFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length === 2 && parts[0] === 'r') return decodeURIComponent(parts[1]);
    return null;
  } catch {
    return null;
  }
}

export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase();
}

export function buildStaffReferralCode(ownerCode: string, staffId: string): string {
  const base = normalizeReferralCode(ownerCode || 'CODE');
  const suffix = (staffId || 'STAFF').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  return `${base}-${suffix}`;
}
