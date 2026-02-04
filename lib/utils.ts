import crypto from 'crypto';

/** Generate a secure random API key (e.g. for VoicePass API auth). */
export function generateApiKey(): string {
  return 'vp_' + crypto.randomBytes(32).toString('hex');
}

export function maskPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber || phoneNumber.length < 4) {
    return '****'; // Or handle as an error/edge case
  }
  const lastFourDigits = phoneNumber.slice(-4);
  const maskedPart = '*'.repeat(phoneNumber.length - 4);
  return maskedPart + lastFourDigits;
}
