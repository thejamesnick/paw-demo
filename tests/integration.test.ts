/**
 * Integration Tests
 * End-to-end tests for PAW functionality
 */

import { WalletManager } from '../src/core/wallet/manager';
import { SolanaClient } from '../src/utils/solana';
import { JupiterClient } from '../src/integrations/jupiter/client';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('PAW Integration Tests', () => {
  const testAgentId = `integration-test-${Date.now()}`;
  const testWalletPath = path.join(os.homedir(), '.paw', 'agents', testAgentId);

  afterAll(async () => {
    // Cleanup
    if (fs.existsSync(testWalletPath)) {
      fs.rmSync(testWalletPath, { recursive: true, force: true });
    }
  });

  describe('Complete Wallet Lifecycle', () => {
    it('should create wallet, get info, and load keypair', async () => {
      // 1. Create wallet
      const wallet = await WalletManager.createWallet({
        agentId: testAgentId,
        network: 'devnet',
      });

      expect(wallet).toBeDefined();
      expect(wallet.agentId).toBe(testAgentId);

      // 2. Get wallet info
      const info = await WalletManager.getWalletInfo(testAgentId);
      expect(info.agentId).toBe(testAgentId);
      expect(info.address).toBe(wallet.address);

      // 3. Load keypair
      const keypair = await WalletManager.loadKeypairAuto(testAgentId);
      expect(keypair.publicKey.toBase58()).toBe(wallet.address);
    });

    it('should check balance on devnet', async () => {
      const info = await WalletManager.getWalletInfo(testAgentId);
      const balance = await SolanaClient.getBalance(info.address, 'devnet');

      expect(balance).toBeDefined();
      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);
    }, 10000);
  });

  describe('DeFi Integration', () => {
    it('should fetch Jupiter quote', async () => {
      const quote = await JupiterClient.getQuote(
        JupiterClient.TOKENS.SOL,
        JupiterClient.TOKENS.USDC,
        1000000000, // 1 SOL
        50
      );

      expect(quote).toBeDefined();
      expect(quote.inputMint).toBe(JupiterClient.TOKENS.SOL);
      expect(quote.outputMint).toBe(JupiterClient.TOKENS.USDC);
      expect(parseFloat(quote.outAmount)).toBeGreaterThan(0);
    }, 15000);
  });

  describe('Security', () => {
    it('should have encrypted files', () => {
      const keypairPath = path.join(testWalletPath, 'keypair.enc');
      const passphrasePath = path.join(testWalletPath, '.passphrase');

      expect(fs.existsSync(keypairPath)).toBe(true);
      expect(fs.existsSync(passphrasePath)).toBe(true);

      // Files should not contain plaintext
      const keypairContent = fs.readFileSync(keypairPath, 'utf8');
      const passphraseContent = fs.readFileSync(passphrasePath, 'utf8');

      // Should not contain obvious patterns
      expect(keypairContent).not.toContain('secretKey');
      expect(keypairContent).not.toContain('privateKey');
      expect(passphraseContent).toContain(':'); // salt:encrypted format
    });

    it('should have correct file permissions', () => {
      const keypairPath = path.join(testWalletPath, 'keypair.enc');
      const stats = fs.statSync(keypairPath);
      const mode = stats.mode & parseInt('777', 8);

      // Should be 0600 (owner read/write only)
      expect(mode).toBe(parseInt('600', 8));
    });
  });

  describe('Configuration', () => {
    it('should have valid config file', () => {
      const configPath = path.join(testWalletPath, 'config.json');
      expect(fs.existsSync(configPath)).toBe(true);

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(config.agentId).toBe(testAgentId);
      expect(config.publicKey).toBeDefined();
      expect(config.network).toBe('devnet');
      expect(config.createdAt).toBeDefined();
    });
  });
});
