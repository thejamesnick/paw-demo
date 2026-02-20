/**
 * Transaction Signer Tests
 * Tests for automatic transaction signing
 */

import { Keypair, Transaction, SystemProgram } from '@solana/web3.js';

describe('SignerEngine', () => {
  describe('signAndSend', () => {
    it('should prepare transaction for sending', () => {
      const keypair = Keypair.generate();
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: 1000,
        })
      );

      // Should be able to create transaction
      expect(transaction).toBeDefined();
      expect(transaction.instructions.length).toBe(1);
    });

    it('should sign transaction manually', () => {
      const keypair = Keypair.generate();
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: 1000,
        })
      );

      transaction.recentBlockhash = 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N';
      transaction.feePayer = keypair.publicKey;

      // Sign manually
      transaction.sign(keypair);

      expect(transaction.signatures.length).toBeGreaterThan(0);
      expect(transaction.signatures[0].signature).not.toBeNull();
    });

    it('should verify signed transaction', () => {
      const keypair = Keypair.generate();
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: 1000,
        })
      );

      transaction.recentBlockhash = 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N';
      transaction.feePayer = keypair.publicKey;
      transaction.sign(keypair);

      // Verify signature
      const verified = transaction.verifySignatures();
      expect(verified).toBe(true);
    });

    it('should serialize signed transaction', () => {
      const keypair = Keypair.generate();
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: 1000,
        })
      );

      transaction.recentBlockhash = 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N';
      transaction.feePayer = keypair.publicKey;
      transaction.sign(keypair);

      // Should be able to serialize
      const serialized = transaction.serialize();
      expect(serialized).toBeDefined();
      expect(serialized.length).toBeGreaterThan(0);
    });
  });

  describe('Transaction Creation', () => {
    it('should create transfer transaction', () => {
      const from = Keypair.generate();
      const to = Keypair.generate();
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to.publicKey,
          lamports: 1000000,
        })
      );

      expect(transaction.instructions.length).toBe(1);
      expect(transaction.instructions[0].programId.toBase58()).toBe(
        SystemProgram.programId.toBase58()
      );
    });

    it('should handle multiple instructions', () => {
      const from = Keypair.generate();
      const to1 = Keypair.generate();
      const to2 = Keypair.generate();
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to1.publicKey,
          lamports: 1000,
        })
      );

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to2.publicKey,
          lamports: 2000,
        })
      );

      expect(transaction.instructions.length).toBe(2);
    });
  });

  describe('Keypair Operations', () => {
    it('should generate valid keypair', () => {
      const keypair = Keypair.generate();

      expect(keypair).toBeDefined();
      expect(keypair.publicKey).toBeDefined();
      expect(keypair.secretKey).toBeDefined();
      expect(keypair.secretKey.length).toBe(64);
    });

    it('should have unique keypairs', () => {
      const keypair1 = Keypair.generate();
      const keypair2 = Keypair.generate();

      expect(keypair1.publicKey.toBase58()).not.toBe(
        keypair2.publicKey.toBase58()
      );
    });

    it('should convert public key to base58', () => {
      const keypair = Keypair.generate();
      const address = keypair.publicKey.toBase58();

      expect(address).toBeDefined();
      expect(typeof address).toBe('string');
      expect(address.length).toBeGreaterThan(30);
    });
  });
});
