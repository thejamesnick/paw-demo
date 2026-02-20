import { Command } from 'commander';
import { WalletManager } from '../../core/wallet/manager';
import { SolanaClient } from '../../utils/solana';
import { FileSystemStorage } from '../../core/storage/filesystem';
import { PublicKey, Cluster, LAMPORTS_PER_SOL } from '@solana/web3.js';
import Table from 'cli-table3';

export const historyCommand = new Command('history')
  .description('📟 Show transaction history')
  .argument('[agent-id]', 'Agent identifier')
  .option('--agent-id <id>', 'Agent identifier (alternative)')
  .option('--network <network>', 'Network to use (overrides config)')
  .option('--limit <limit>', 'Number of transactions to show', '10')
  .action(async (agentIdArg, options) => {
    try {
      // Support both positional and flag syntax
      const agentId = agentIdArg || options.agentId;
      
      if (!agentId) {
        console.error('\n❌ Error: Agent ID is required');
        console.log('\nUsage: paw history <agent-id>');
        console.log('   or: paw history --agent-id <agent-id>');
        console.log('');
        process.exit(1);
      }

      // Use network from options or fall back to config
      let network = options.network;
      if (!network) {
        const config = await FileSystemStorage.loadConfig(agentId);
        network = config.network || 'mainnet-beta';
      }

      console.log('\n📟 PAW - Transaction History');
      console.log('Agent ID:', agentId);
      console.log('Network: ', network);
      console.log('');

      const walletInfo = await WalletManager.getWalletInfo(agentId);
      const connection = SolanaClient.getConnection(network as Cluster);
      const publicKey = new PublicKey(walletInfo.address);

      // Get transaction signatures
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: parseInt(options.limit),
      });

      if (signatures.length === 0) {
        console.log('No transactions found.');
        console.log('');
        return;
      }

      // Create table
      const table = new Table({
        head: ['Date & Time', 'Type', 'Amount (SOL)', 'Status', 'Signature'],
        colWidths: [22, 10, 15, 10, 25],
        style: {
          head: ['cyan'],
          border: ['gray'],
        },
      });

      // Fetch and display transactions
      for (const sig of signatures) {
        const status = sig.err ? '❌ Failed' : '✅ Success';
        const date = sig.blockTime
          ? new Date(sig.blockTime * 1000).toLocaleString()
          : 'Unknown';

        // Fetch full transaction details
        const tx = await connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });

        let type = '🔄';
        let amount = '0.000000';
        
        if (tx && tx.meta) {
          // Find our account index in the transaction
          const accountIndex = tx.transaction.message.accountKeys.findIndex(
            (key) => key.pubkey.toString() === publicKey.toString()
          );

          if (accountIndex !== -1) {
            const preBalance = tx.meta.preBalances[accountIndex] / LAMPORTS_PER_SOL;
            const postBalance = tx.meta.postBalances[accountIndex] / LAMPORTS_PER_SOL;
            const change = postBalance - preBalance;

            if (change > 0) {
              type = '📥 In';
              amount = `+${change.toFixed(6)}`;
            } else if (change < 0) {
              type = '📤 Out';
              amount = `${change.toFixed(6)}`;
            }
          }
        }

        const shortSig = `${sig.signature.slice(0, 10)}...${sig.signature.slice(-10)}`;

        table.push([date, type, amount, status, shortSig]);
      }

      console.log(table.toString());
      console.log('');
      console.log(`View full details: https://explorer.solana.com/address/${walletInfo.address}?cluster=${network}`);
      console.log('');
    } catch (error) {
      console.error('\n❌ Error:', (error as Error).message);
      process.exit(1);
    }
  });
