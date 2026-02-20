import crypto from 'crypto';
import os from 'os';

/**
 * Generate a unique key based on machine identity
 * This key is consistent for the same machine but different across machines
 */
export class MachineIdentity {
  /**
   * Get a machine-specific encryption key
   * Uses hostname, username, platform, and architecture
   */
  static getMachineKey(): string {
    // Combine machine-specific data
    const machineData = [
      os.hostname(),           // Computer name
      os.userInfo().username,  // User name
      os.platform(),           // OS (darwin, linux, win32)
      os.arch(),               // CPU architecture (x64, arm64)
      os.homedir(),            // Home directory path
    ].join('|');

    // Hash to create consistent 256-bit key
    // This is unique per machine - no additional salt needed
    return crypto
      .createHash('sha256')
      .update(machineData)
      .digest('hex');
  }

  /**
   * Encrypt data with machine-specific key
   * Data can only be decrypted on the same machine
   */
  static encrypt(data: string): string {
    const machineKey = MachineIdentity.getMachineKey();
    const algorithm = 'aes-256-cbc';

    // Derive encryption key from machine key
    const key = crypto.scryptSync(machineKey, 'salt', 32);
    const iv = crypto.randomBytes(16);

    // Encrypt
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return IV + encrypted data (both needed for decryption)
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt data with machine-specific key
   * Only works on the same machine where it was encrypted
   */
  static decrypt(encryptedData: string): string {
    const machineKey = MachineIdentity.getMachineKey();
    const algorithm = 'aes-256-cbc';

    // Split IV and encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    // Derive decryption key
    const key = crypto.scryptSync(machineKey, 'salt', 32);

    // Decrypt
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Check if data can be decrypted on this machine
   */
  static canDecrypt(encryptedData: string): boolean {
    try {
      MachineIdentity.decrypt(encryptedData);
      return true;
    } catch {
      return false;
    }
  }
}
