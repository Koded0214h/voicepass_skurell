export function maskPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber || phoneNumber.length < 4) {
    return '****'; // Or handle as an error/edge case
  }
  const lastFourDigits = phoneNumber.slice(-4);
  const maskedPart = '*'.repeat(phoneNumber.length - 4);
  return maskedPart + lastFourDigits;
}
