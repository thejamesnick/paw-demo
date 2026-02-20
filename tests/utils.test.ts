/**
 * Utility Module Tests
 * Tests for price service and Solana client
 */

import { PriceService } from '../src/utils/price';
import { SolanaClient } from '../src/utils/solana';

describe('PriceService', () => {
  describe('getSolPrice', () => {
    it('should fetch SOL price from CoinGecko', async () => {
      const price = await PriceService.getSolPrice();

      expect(price).toBeDefined();
      expect(typeof price).toBe('number');
      expect(price).toBeGreaterThan(0);
      expect(price).toBeLessThan(10000); // Reasonable upper bound
    }, 10000);

    it('should cache price for subsequent calls', async () => {
      const price1 = await PriceService.getSolPrice();
      const price2 = await PriceService.getSolPrice();

      // Should be same (cached)
      expect(price1).toBe(price2);
    }, 10000);

    it('should return a valid number', async () => {
      const price = await PriceService.getSolPrice();

      expect(isNaN(price)).toBe(false);
      expect(isFinite(price)).toBe(true);
    }, 10000);
  });
});

describe('SolanaClient', () => {
  describe('getConnection', () => {
    it('should create a connection for devnet', () => {
      const connection = SolanaClient.getConnection('devnet');

      expect(connection).toBeDefined();
      expect(connection.rpcEndpoint).toContain('devnet');
    });

    it('should create a connection for mainnet-beta', () => {
      const connection = SolanaClient.getConnection('mainnet-beta');

      expect(connection).toBeDefined();
      expect(connection.rpcEndpoint).toContain('mainnet');
    });

    it('should reuse connections', () => {
      const connection1 = SolanaClient.getConnection('devnet');
      const connection2 = SolanaClient.getConnection('devnet');

      // Should be same instance
      expect(connection1).toBe(connection2);
    });

    it('should create different connections for different networks', () => {
      const devnetConnection = SolanaClient.getConnection('devnet');
      const mainnetConnection = SolanaClient.getConnection('mainnet-beta');

      expect(devnetConnection).not.toBe(mainnetConnection);
      expect(devnetConnection.rpcEndpoint).not.toBe(mainnetConnection.rpcEndpoint);
    });
  });

  describe('clearConnections', () => {
    it('should clear cached connections', () => {
      const connection1 = SolanaClient.getConnection('devnet');
      SolanaClient.clearConnections();
      const connection2 = SolanaClient.getConnection('devnet');

      // Should be different instances after clear
      expect(connection1).not.toBe(connection2);
    });
  });

  describe('getBalance (requires network)', () => {
    it('should fetch balance for a valid address', async () => {
      // Use a known address (system program)
      const address = '11111111111111111111111111111111';
      
      const balance = await SolanaClient.getBalance(address, 'devnet');

      expect(balance).toBeDefined();
      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);
    }, 10000);

    it('should return 0 for new address', async () => {
      // Generate a random address that likely has 0 balance
      const { Keypair } = await import('@solana/web3.js');
      const keypair = Keypair.generate();
      const address = keypair.publicKey.toBase58();

      const balance = await SolanaClient.getBalance(address, 'devnet');

      expect(balance).toBe(0);
    }, 10000);
  });
});
