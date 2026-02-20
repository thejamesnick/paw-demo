import { Keypair, PublicKey } from '@solana/web3.js';
import { WalletConfig, WalletInfo } from '../../types/wallet';
import { EncryptionService } from '../storage/encryption';
import { FileSystemStorage } from '../storage/filesystem';

export class WalletManager {
  /**
   * Create a new wallet for an agent
   */
  static async createWallet(config: WalletConfig): Promise<WalletInfo> {
    const { agentId, passphrase } = config;

    // Check if wallet already exists
    if (await FileSystemStorage.exists(agentId)) {
      throw new Error(`Wallet for agent "${agentId}" already exists`);
    }

    // Generate passphrase if not provided
    const finalPassphrase =
      passphrase || EncryptionService.generatePassphrase();

    // Generate new keypair
    const keypair = Keypair.generate();

    // Encrypt keypair
    const encryptedKeypair = EncryptionService.encrypt(
      keypair,
      finalPassphrase
    );

    // Save encrypted keypair to disk
    await FileSystemStorage.saveKeypair(agentId, encryptedKeypair);

    // Save passphrase (encrypted with machine-specific key)
    // This is NOT plaintext! It's encrypted so only this machine can decrypt it
    await FileSystemStorage.savePassphrase(agentId, finalPassphrase);

    // Save config
    await FileSystemStorage.saveConfig(agentId, {
      agentId,
      publicKey: keypair.publicKey.toBase58(),
      createdAt: new Date().toISOString(),
      network: config.network || 'mainnet-beta',
    });

    const walletInfo = {
      agentId,
      publicKey: keypair.publicKey,
      address: keypair.publicKey.toBase58(),
      createdAt: new Date(),
    };

    // Clear keypair from memory
    EncryptionService.clearKeypair(keypair);

    return walletInfo;
  }

  /**
   * Load wallet info for an agent
   */
  static async getWalletInfo(agentId: string): Promise<WalletInfo> {
    if (!(await FileSystemStorage.exists(agentId))) {
      throw new Error(`Wallet for agent "${agentId}" not found`);
    }

    const config = await FileSystemStorage.loadConfig(agentId);

    return {
      agentId: config.agentId,
      publicKey: new PublicKey(config.publicKey),
      address: config.publicKey,
      createdAt: new Date(config.createdAt),
    };
  }

  /**
   * Load keypair (decrypted in memory)
   */
  static async loadKeypair(
    agentId: string,
    passphrase: string
  ): Promise<Keypair> {
    if (!(await FileSystemStorage.exists(agentId))) {
      throw new Error(`Wallet for agent "${agentId}" not found`);
    }

    const encryptedKeypair = await FileSystemStorage.loadKeypair(agentId);
    return EncryptionService.decrypt(encryptedKeypair, passphrase);
  }

  /**
   * Load keypair automatically using saved passphrase
   * Passphrase is encrypted with machine-specific key
   */
  static async loadKeypairAuto(agentId: string): Promise<Keypair> {
    if (!(await FileSystemStorage.exists(agentId))) {
      throw new Error(`Wallet for agent "${agentId}" not found`);
    }

    // Load encrypted passphrase and decrypt it
    const passphrase = await FileSystemStorage.loadPassphrase(agentId);

    // Load and decrypt keypair
    const encryptedKeypair = await FileSystemStorage.loadKeypair(agentId);
    return EncryptionService.decrypt(encryptedKeypair, passphrase);
  }

  /**
   * Delete a wallet
   */
  static async deleteWallet(agentId: string): Promise<void> {
    await FileSystemStorage.deleteAgent(agentId);
  }

  /**
   * List all wallets
   */
  static async listWallets(): Promise<string[]> {
    return FileSystemStorage.listAgents();
  }
}
