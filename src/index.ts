// Core exports for programmatic use
export { WalletManager } from './core/wallet/manager';
export { SignerEngine } from './core/signer/engine';
export { EncryptionService } from './core/storage/encryption';
export { FileSystemStorage } from './core/storage/filesystem';
export { MachineIdentity } from './core/crypto/machine-identity';
export { SolanaClient } from './utils/solana';
export { JupiterClient } from './integrations/jupiter/client';

// Type exports
export type {
  WalletConfig,
  WalletInfo,
  Balance,
  TokenBalance,
  EncryptedKeypair,
} from './types/wallet';
export type {
  SwapParams,
  SwapResult,
  SendParams,
  SendResult,
} from './types/transaction';
