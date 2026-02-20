/**
 * Jupiter Integration Tests
 * Tests for Jupiter DEX client
 */

import { JupiterClient } from '../src/integrations/jupiter/client';

describe('JupiterClient', () => {
  describe('Token Addresses', () => {
    it('should have SOL token address', () => {
      expect(JupiterClient.TOKENS.SOL).toBeDefined();
      expect(typeof JupiterClient.TOKENS.SOL).toBe('string');
      expect(JupiterClient.TOKENS.SOL.length).toBeGreaterThan(30);
    });

    it('should have USDC token address', () => {
      expect(JupiterClient.TOKENS.USDC).toBeDefined();
      expect(typeof JupiterClient.TOKENS.USDC).toBe('string');
      expect(JupiterClient.TOKENS.USDC).toBe('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    });

    it('should have USDT token address', () => {
      expect(JupiterClient.TOKENS.USDT).toBeDefined();
      expect(typeof JupiterClient.TOKENS.USDT).toBe('string');
    });

    it('should have BONK token address', () => {
      expect(JupiterClient.TOKENS.BONK).toBeDefined();
      expect(typeof JupiterClient.TOKENS.BONK).toBe('string');
    });

    it('should have valid Solana addresses', () => {
      // Solana addresses are 32-44 characters base58
      expect(JupiterClient.TOKENS.SOL.length).toBeGreaterThanOrEqual(32);
      expect(JupiterClient.TOKENS.USDC.length).toBeGreaterThanOrEqual(32);
      expect(JupiterClient.TOKENS.USDT.length).toBeGreaterThanOrEqual(32);
      expect(JupiterClient.TOKENS.BONK.length).toBeGreaterThanOrEqual(32);
    });
  });

  describe('API Integration (requires network)', () => {
    // These tests require network access and may be slow
    // Skip in CI/CD if needed

    it('should fetch a quote from Jupiter API', async () => {
      const inputMint = JupiterClient.TOKENS.SOL;
      const outputMint = JupiterClient.TOKENS.USDC;
      const amount = 1000000000; // 1 SOL in lamports

      const quote = await JupiterClient.getQuote(
        inputMint,
        outputMint,
        amount,
        50
      );

      expect(quote).toBeDefined();
      expect(quote.inputMint).toBe(inputMint);
      expect(quote.outputMint).toBe(outputMint);
      expect(quote.inAmount).toBe(amount.toString());
      expect(quote.outAmount).toBeDefined();
      expect(quote.priceImpactPct).toBeDefined();
      expect(parseFloat(quote.outAmount)).toBeGreaterThan(0);
    }, 15000); // 15 second timeout for API call

    it('should fetch token list from Jupiter', async () => {
      const tokens = await JupiterClient.getTokenList();

      expect(tokens).toBeDefined();
      expect(Array.isArray(tokens)).toBe(true);
      expect(tokens.length).toBeGreaterThan(0); // Should have some tokens
    }, 15000);

    it('should find token by symbol', async () => {
      const token = await JupiterClient.findToken('SOL');

      expect(token).toBeDefined();
      if (token) {
        expect(token.symbol).toBe('SOL');
        expect(token.address || token.id).toBeDefined();
      }
    }, 15000);

    it('should find token by address', async () => {
      const usdcAddress = JupiterClient.TOKENS.USDC;
      const token = await JupiterClient.findToken(usdcAddress);

      expect(token).toBeDefined();
      if (token) {
        expect(token.address || token.id).toBe(usdcAddress);
      }
    }, 15000);

    it('should return null for non-existent token', async () => {
      const token = await JupiterClient.findToken('NONEXISTENT123456789');

      expect(token).toBeNull();
    }, 15000);
  });
});
