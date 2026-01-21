import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key!!';
const ALGORITHM = 'aes-256-cbc';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
    iv
  );
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  try {
    const parts = text.split(':');
    if (parts.length !== 2) {
      console.warn("Malformed encrypted text, expecting 'iv:encrypted', got:", text);
      return '[MALFORMED_ENCRYPTED_DATA]';
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    if (iv.length !== 16) {
      console.warn("Invalid IV length for text:", text, "Length:", iv.length);
      return '[INVALID_IV_LENGTH]';
    }

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
      iv
    );

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error: any) {
    console.error('Decryption failed for text:', text, 'Error:', error.message);
    if (error.code === 'ERR_CRYPTO_INVALID_IV') {
      return '[DECRYPTION_FAILED_INVALID_IV]';
    }
    return '[DECRYPTION_FAILED_UNKNOWN_ERROR]';
  }
}
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hash);
}
