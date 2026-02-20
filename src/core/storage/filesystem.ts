import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { EncryptedKeypair } from '../../types/wallet';

export class FileSystemStorage {
  private static readonly PAW_DIR = path.join(os.homedir(), '.paw');
  private static readonly AGENTS_DIR = path.join(
    FileSystemStorage.PAW_DIR,
    'agents'
  );

  /**
   * Get the directory path for an agent
   */
  static getAgentDir(agentId: string): string {
    return path.join(FileSystemStorage.AGENTS_DIR, agentId);
  }

  /**
   * Get the keypair file path for an agent
   */
  static getKeypairPath(agentId: string): string {
    return path.join(FileSystemStorage.getAgentDir(agentId), 'keypair.enc');
  }

  /**
   * Get the passphrase file path for an agent
   */
  static getPassphrasePath(agentId: string): string {
    return path.join(FileSystemStorage.getAgentDir(agentId), '.passphrase');
  }

  /**
   * Get the config file path for an agent
   */
  static getConfigPath(agentId: string): string {
    return path.join(FileSystemStorage.getAgentDir(agentId), 'config.json');
  }

  /**
   * Check if an agent wallet exists
   */
  static async exists(agentId: string): Promise<boolean> {
    try {
      await fs.access(FileSystemStorage.getKeypairPath(agentId));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create agent directory if it doesn't exist
   */
  static async ensureAgentDir(agentId: string): Promise<void> {
    const agentDir = FileSystemStorage.getAgentDir(agentId);
    await fs.mkdir(agentDir, { recursive: true });
  }

  /**
   * Save encrypted keypair to disk
   */
  static async saveKeypair(
    agentId: string,
    encryptedKeypair: EncryptedKeypair
  ): Promise<void> {
    await FileSystemStorage.ensureAgentDir(agentId);

    // Combine all components into single buffer
    const data = Buffer.concat([
      encryptedKeypair.salt,
      encryptedKeypair.iv,
      encryptedKeypair.encrypted,
      encryptedKeypair.authTag,
    ]);

    const keypairPath = FileSystemStorage.getKeypairPath(agentId);
    await fs.writeFile(keypairPath, data, { mode: 0o600 }); // Read/write for owner only
  }

  /**
   * Load encrypted keypair from disk
   */
  static async loadKeypair(agentId: string): Promise<EncryptedKeypair> {
    const keypairPath = FileSystemStorage.getKeypairPath(agentId);
    const data = await fs.readFile(keypairPath);

    // Extract components
    const salt = data.slice(0, 32);
    const iv = data.slice(32, 48);
    const encrypted = data.slice(48, data.length - 16);
    const authTag = data.slice(data.length - 16);

    return { salt, iv, encrypted, authTag };
  }

  /**
   * Save agent configuration
   */
  static async saveConfig(agentId: string, config: any): Promise<void> {
    await FileSystemStorage.ensureAgentDir(agentId);
    const configPath = FileSystemStorage.getConfigPath(agentId);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  /**
   * Load agent configuration
   */
  static async loadConfig(agentId: string): Promise<any> {
    const configPath = FileSystemStorage.getConfigPath(agentId);
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Delete agent wallet
   */
  static async deleteAgent(agentId: string): Promise<void> {
    const agentDir = FileSystemStorage.getAgentDir(agentId);
    await fs.rm(agentDir, { recursive: true, force: true });
  }

  /**
   * List all agent IDs
   */
  static async listAgents(): Promise<string[]> {
    try {
      const agents = await fs.readdir(FileSystemStorage.AGENTS_DIR);
      return agents;
    } catch {
      return [];
    }
  }

  /**
   * Save passphrase (encrypted with machine-specific key)
   * Passphrase is NEVER stored in plaintext!
   */
  static async savePassphrase(
    agentId: string,
    passphrase: string
  ): Promise<void> {
    const { MachineIdentity } = await import('../crypto/machine-identity');
    
    // Encrypt passphrase with machine-specific key
    const encrypted = MachineIdentity.encrypt(passphrase);
    
    // Save encrypted passphrase
    const passphrasePath = FileSystemStorage.getPassphrasePath(agentId);
    await fs.writeFile(passphrasePath, encrypted, { mode: 0o600 });
  }

  /**
   * Load passphrase (decrypt with machine-specific key)
   * Only works on the same machine where it was saved
   */
  static async loadPassphrase(agentId: string): Promise<string> {
    const { MachineIdentity } = await import('../crypto/machine-identity');
    
    const passphrasePath = FileSystemStorage.getPassphrasePath(agentId);
    const encrypted = await fs.readFile(passphrasePath, 'utf-8');
    
    // Decrypt with machine-specific key
    return MachineIdentity.decrypt(encrypted);
  }

  /**
   * Check if passphrase file exists
   */
  static async hasPassphrase(agentId: string): Promise<boolean> {
    try {
      await fs.access(FileSystemStorage.getPassphrasePath(agentId));
      return true;
    } catch {
      return false;
    }
  }
}
