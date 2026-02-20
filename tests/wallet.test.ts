/**
 * Wallet Manager Tests
 * Tests for wallet creation and management
 */

import { WalletManager } from '../src/core/wallet/manager';
import { FileSystemStorage } from '../src/core/storage/filesystem';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('WalletManager', () => {
  const testAgentId = `test-agent-${Date.now()}`;
  const testWalletPath = path.join(os.homedir(), '.paw', 'agents', testAgentId);

  afterAll(async () => {
    // Cleanup test wallet
    if (fs.existsSync(testWalletPath)) {
      fs.rmSync(testWalletPath, { recursive: true, force: true });
    }
  });

  describe('createWallet', () => {
    it('should create a new wallet', async () => {
      const wallet = await WalletManager.createWallet({
        agentId: testAgentId,
        network: 'devnet',
      });

      expect(wallet).toBeDefined();
      expect(wallet.agentId).toBe(testAgentId);
      expect(wallet.publicKey).toBeDefined();
      expect(wallet.address).toBeDefined();
      expect(wallet.address.length).toBeGreaterThan(30);
    });

    it('should create wallet files on disk', async () => {
      const walletExists = fs.existsSync(path.join(testWalletPath, 'keypair.enc'));
      const passphraseExists = fs.existsSync(path.join(testWalletPath, '.passphrase'));
      const configExists = fs.existsSync(path.join(testWalletPath, 'config.json'));

      expect(walletExists).toBe(true);
      expect(passphraseExists).toBe(true);
      expect(configExists).toBe(true);
    });

    it('should throw error if wallet already exists', async () => {
      await expect(
        WalletManager.createWallet({
          agentId: testAgentId,
          network: 'devnet',
        })
      ).rejects.toThrow();
    });
  });

  describe('getWalletInfo', () => {
    it('should get wallet info', async () => {
      const info = await WalletManager.getWalletInfo(testAgentId);

      expect(info).toBeDefined();
      expect(info.agentId).toBe(testAgentId);
      expect(info.publicKey).toBeDefined();
      expect(info.address).toBeDefined();
      expect(info.createdAt).toBeDefined();
    });

    it('should throw error for non-existent wallet', async () => {
      await expect(
        WalletManager.getWalletInfo('non-existent-agent')
      ).rejects.toThrow();
    });
  });

  describe('loadKeypairAuto', () => {
    it('should load keypair automatically', async () => {
      const keypair = await WalletManager.loadKeypairAuto(testAgentId);

      expect(keypair).toBeDefined();
      expect(keypair.publicKey).toBeDefined();
      expect(keypair.secretKey).toBeDefined();
      expect(keypair.secretKey.length).toBe(64);
    });

    it('should throw error for non-existent wallet', async () => {
      await expect(
        WalletManager.loadKeypairAuto('non-existent-agent')
      ).rejects.toThrow();
    });
  });
});

describe('FileSystemStorage', () => {
  const testAgentId = `test-storage-${Date.now()}`;

  afterAll(async () => {
    // Cleanup
    const testPath = path.join(os.homedir(), '.paw', 'agents', testAgentId);
    if (fs.existsSync(testPath)) {
      fs.rmSync(testPath, { recursive: true, force: true });
    }
  });

  describe('exists', () => {
    it('should return false for non-existent wallet', async () => {
      const exists = await FileSystemStorage.exists('non-existent-agent-123');
      expect(exists).toBe(false);
    });

    it('should return true for existing wallet', async () => {
      // Create a test wallet first
      await WalletManager.createWallet({
        agentId: testAgentId,
        network: 'devnet',
      });

      const exists = await FileSystemStorage.exists(testAgentId);
      expect(exists).toBe(true);
    });
  });

  describe('config operations', () => {
    it('should save and load config', async () => {
      const config = {
        agentId: testAgentId,
        publicKey: 'test-public-key',
        createdAt: new Date().toISOString(),
        network: 'devnet' as const,
        defaultSlippage: 1000,
        defaultPriorityFee: 100000,
      };

      await FileSystemStorage.saveConfig(testAgentId, config);
      const loaded = await FileSystemStorage.loadConfig(testAgentId);

      expect(loaded.agentId).toBe(config.agentId);
      expect(loaded.publicKey).toBe(config.publicKey);
      expect(loaded.network).toBe(config.network);
      expect(loaded.defaultSlippage).toBe(config.defaultSlippage);
      expect(loaded.defaultPriorityFee).toBe(config.defaultPriorityFee);
    });

    it('should update config', async () => {
      const config = await FileSystemStorage.loadConfig(testAgentId);
      config.network = 'mainnet-beta';
      config.defaultSlippage = 500;

      await FileSystemStorage.saveConfig(testAgentId, config);
      const updated = await FileSystemStorage.loadConfig(testAgentId);

      expect(updated.network).toBe('mainnet-beta');
      expect(updated.defaultSlippage).toBe(500);
    });
  });

  describe('getAgentDir', () => {
    it('should return correct agent directory path', () => {
      const agentDir = FileSystemStorage.getAgentDir(testAgentId);

      expect(agentDir).toContain('.paw');
      expect(agentDir).toContain('agents');
      expect(agentDir).toContain(testAgentId);
    });

    it('should return absolute path', () => {
      const agentDir = FileSystemStorage.getAgentDir(testAgentId);

      expect(path.isAbsolute(agentDir)).toBe(true);
    });
  });
});
