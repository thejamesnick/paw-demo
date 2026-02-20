import crypto from 'crypto';
import { Keypair } from '@solana/web3.js';
import { EncryptedKeypair } from '../../types/wallet';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const ITERATIONS = 100000;

export class EncryptionService {
  /**
   * Generate a secure random passphrase
   */
  static generatePassphrase(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  /**
   * Encrypt a Solana keypair with a passphrase
   * Uses AES-256-GCM with PBKDF2 key derivation
   */
  static encrypt(keypair: Keypair, passphrase: string): EncryptedKeypair {
    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    // Derive encryption key from passphrase
    const key = crypto.pbkdf2Sync(
      passphrase,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      'sha256'
    );

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt the secret key
    const secretKey = Buffer.from(keypair.secretKey);
    const encrypted = Buffer.concat([
      cipher.update(secretKey),
      cipher.final(),
    ]);

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    // Clear sensitive data
    secretKey.fill(0);

    return {
      salt,
      iv,
      encrypted,
      authTag,
    };
  }

  /**
   * Decrypt an encrypted keypair
   * Returns keypair that exists only in memory
   */
  static decrypt(
    encryptedData: EncryptedKeypair,
    passphrase: string
  ): Keypair {
    // Derive key from passphrase
    const key = crypto.pbkdf2Sync(
      passphrase,
      encryptedData.salt,
      ITERATIONS,
      KEY_LENGTH,
      'sha256'
    );

    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      encryptedData.iv
    );
    decipher.setAuthTag(encryptedData.authTag);

    // Decrypt
    const decrypted = Buffer.concat([
      decipher.update(encryptedData.encrypted),
      decipher.final(),
    ]);

    // Create keypair from decrypted secret key
    const keypair = Keypair.fromSecretKey(new Uint8Array(decrypted));

    // Clear decrypted buffer
    decrypted.fill(0);

    return keypair;
  }

  /**
   * Clear a keypair from memory (security best practice)
   */
  static clearKeypair(keypair: Keypair): void {
    keypair.secretKey.fill(0);
  }
}
