import crypto from 'crypto';
import { format } from 'date-fns';

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

export function parseDate(value: string | null | undefined | number): Date | null {
    if (value == null || value === '') return null;

    let date;
    if (typeof value === 'number') {
        date = value > 1e12 ? new Date(value) : new Date(value * 1000);
    } else {
        const num = Number(value);
        if (!Number.isNaN(num) && num > 0) {
            date = num > 1e12 ? new Date(num) : new Date(num * 1000);
        } else {
            date = new Date(value);
        }
    }

    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return date;
}

export function formatDate(value: string | null | undefined | number | Date, fmt = 'MMM dd, yyyy HH:mm:ss'): string {
    const date = value instanceof Date ? value : parseDate(value);
    if (!date) {
        return '-';
    }
    return format(date, fmt);
}
