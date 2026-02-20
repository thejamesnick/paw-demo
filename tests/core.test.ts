/**
 * Core Module Tests
 * Tests for encryption, machine identity, and basic functionality
 */

import { EncryptionService } from '../src/core/storage/encryption';
import { MachineIdentity } from '../src/core/crypto/machine-identity';
import { Keypair } from '@solana/web3.js';

describe('EncryptionService', () => {
  describe('generatePassphrase', () => {
    it('should generate a passphrase', () => {
      const passphrase = EncryptionService.generatePassphrase();
      
      expect(passphrase).toBeDefined();
      expect(typeof passphrase).toBe('string');
      expect(passphrase.length).toBeGreaterThan(0);
    });

    it('should generate unique passphrases', () => {
      const passphrase1 = EncryptionService.generatePassphrase();
      const passphrase2 = EncryptionService.generatePassphrase();
      
      expect(passphrase1).not.toBe(passphrase2);
    });

    it('should generate passphrases of sufficient length', () => {
      const passphrase = EncryptionService.generatePassphrase();
      
      // Should be at least 32 characters
      expect(passphrase.length).toBeGreaterThanOrEqual(32);
    });
  });

  describe('encrypt and decrypt keypair', () => {
    it('should encrypt and decrypt a keypair', () => {
      const keypair = Keypair.generate();
      const passphrase = 'test-passphrase-123';

      const encrypted = EncryptionService.encrypt(keypair, passphrase);
      const decrypted = EncryptionService.decrypt(encrypted, passphrase);

      // Check that decrypted keypair matches original
      expect(decrypted.publicKey.toBase58()).toBe(keypair.publicKey.toBase58());
      expect(Buffer.from(decrypted.secretKey).toString('hex')).toBe(
        Buffer.from(keypair.secretKey).toString('hex')
      );
    });

    it('should produce different ciphertext for same keypair', () => {
      const keypair = Keypair.generate();
      const passphrase = 'test-passphrase-123';

      const encrypted1 = EncryptionService.encrypt(keypair, passphrase);
      const encrypted2 = EncryptionService.encrypt(keypair, passphrase);

      // Different salt/IV should produce different ciphertext
      expect(encrypted1.encrypted.toString('hex')).not.toBe(
        encrypted2.encrypted.toString('hex')
      );
    });

    it('should fail to decrypt with wrong passphrase', () => {
      const keypair = Keypair.generate();
      const passphrase = 'correct-passphrase';
      const wrongPassphrase = 'wrong-passphrase';

      const encrypted = EncryptionService.encrypt(keypair, passphrase);

      expect(() => {
        EncryptionService.decrypt(encrypted, wrongPassphrase);
      }).toThrow();
    });
  });
});

describe('MachineIdentity', () => {
  describe('getMachineKey', () => {
    it('should generate a machine key', () => {
      const key = MachineIdentity.getMachineKey();

      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });

    it('should generate consistent key for same machine', () => {
      const key1 = MachineIdentity.getMachineKey();
      const key2 = MachineIdentity.getMachineKey();

      expect(key1).toBe(key2);
    });

    it('should generate key with sufficient length', () => {
      const key = MachineIdentity.getMachineKey();

      // Should be at least 64 characters (hex encoded hash)
      expect(key.length).toBeGreaterThanOrEqual(64);
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt data', () => {
      const data = 'test-secret-data-123';

      const encrypted = MachineIdentity.encrypt(data);
      const decrypted = MachineIdentity.decrypt(encrypted);

      expect(decrypted).toBe(data);
    });

    it('should produce different ciphertext for same data', () => {
      const data = 'test-secret-data-123';

      const encrypted1 = MachineIdentity.encrypt(data);
      const encrypted2 = MachineIdentity.encrypt(data);

      // Different IV should produce different output
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle empty data', () => {
      const data = '';

      const encrypted = MachineIdentity.encrypt(data);
      const decrypted = MachineIdentity.decrypt(encrypted);

      expect(decrypted).toBe(data);
    });

    it('should handle long data', () => {
      const data = 'a'.repeat(1000);

      const encrypted = MachineIdentity.encrypt(data);
      const decrypted = MachineIdentity.decrypt(encrypted);

      expect(decrypted).toBe(data);
    });

    it('should handle unicode characters', () => {
      const data = '🔐 Unicode data 📟 with émojis';

      const encrypted = MachineIdentity.encrypt(data);
      const decrypted = MachineIdentity.decrypt(encrypted);

      expect(decrypted).toBe(data);
    });
  });
});
