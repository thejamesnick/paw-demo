import { Command } from 'commander';
import { WalletManager } from '../../core/wallet/manager';
import { SignerEngine } from '../../core/signer/engine';
import { SolanaClient } from '../../utils/solana';
import { FileSystemStorage } from '../../core/storage/filesystem';
import {
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  Cluster,
} from '@solana/web3.js';

export const sendCommand = new Command('send')
  .description('📟 Send SOL to another address')
  .argument('[agent-id]', 'Agent identifier')
  .option('--agent-id <id>', 'Agent identifier (alternative)')
  .requiredOption('--to <address>', 'Recipient address')
  .requiredOption('--amount <amount>', 'Amount in SOL')
  .option('--network <network>', 'Network to use (overrides config)')
  .action(async (agentIdArg, options) => {
    try {
      // Support both positional and flag syntax
      const agentId = agentIdArg || options.agentId;
      
      if (!agentId) {
        console.error('\n❌ Error: Agent ID is required');
        console.log('\nUsage: paw send <agent-id> --to <address> --amount <amount>');
        console.log('   or: paw send --agent-id <agent-id> --to <address> --amount <amount>');
        console.log('');
        process.exit(1);
      }

      // Use network from options or fall back to config
      let network = options.network;
      if (!network) {
        const config = await FileSystemStorage.loadConfig(agentId);
        network = config.network || 'mainnet-beta';
      }

      console.log('\n📟 PAW - Send Transaction');
      console.log('Agent ID:', agentId);
      console.log('To:      ', options.to);
      console.log('Amount:  ', options.amount, 'SOL');
      console.log('Network: ', network);

      // Load keypair
      const keypair = await WalletManager.loadKeypairAuto(agentId);

      // Get connection
      const connection = SolanaClient.getConnection(network as Cluster);

      // Create transfer instruction
      const lamports = Math.floor(parseFloat(options.amount) * LAMPORTS_PER_SOL);
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: new PublicKey(options.to),
        lamports,
      });

      // Create transaction
      const transaction = new Transaction().add(transferInstruction);

      // Sign and send
      console.log('\nSigning transaction...');
      const signature = await SignerEngine.signAndSend(
        transaction,
        keypair,
        connection
      );

      console.log('\n✅ Transaction sent!');
      console.log('Signature:', signature);
      console.log('Explorer:  https://explorer.solana.com/tx/' + signature + '?cluster=' + network);
      console.log('');
    } catch (error) {
      console.error('\n❌ Error:', (error as Error).message);
      process.exit(1);
    }
  });
