import { Command } from 'commander';
import { WalletManager } from '../../core/wallet/manager';
import chalk from 'chalk';

export const initCommand = new Command('init')
  .description('📟 Initialize a new agent wallet')
  .argument('[agent-id]', 'Unique agent identifier')
  .option('--agent-id <id>', 'Unique agent identifier (alternative)')
  .option('--passphrase <passphrase>', 'Custom passphrase (auto-generated if not provided)')
  .option('--network <network>', 'Network to use (devnet, mainnet-beta, testnet)', 'mainnet-beta')
  .action(async (agentIdArg, options) => {
    try {
      // Support both positional and flag syntax
      const agentId = agentIdArg || options.agentId;
      
      if (!agentId) {
        console.error(chalk.red('\n❌ Error: Agent ID is required'));
        console.log('\nUsage: paw init <agent-id>');
        console.log('   or: paw init --agent-id <agent-id>');
        console.log('');
        process.exit(1);
      }

      console.log(chalk.cyan('\n📟 PAW - PocketAgent Wallet'));
      console.log(chalk.gray('Creating wallet for agent...'));

      const walletInfo = await WalletManager.createWallet({
        agentId: agentId,
        passphrase: options.passphrase,
        network: options.network,
      });

      console.log(chalk.green('\n✅ Wallet created successfully!'));
      console.log(chalk.white('\nAgent ID:'), chalk.yellow(walletInfo.agentId));
      console.log(chalk.white('Address: '), chalk.yellow(walletInfo.address));
      console.log(chalk.white('Network: '), chalk.yellow(options.network));
      console.log(chalk.white('Created: '), chalk.gray(walletInfo.createdAt.toISOString()));

      console.log(chalk.cyan('\n📟 Security:'));
      console.log(chalk.gray('  • Wallet encrypted with AES-256-GCM'));
      console.log(chalk.gray('  • Passphrase encrypted with machine-specific key'));
      console.log(chalk.gray('  • Files stored in ~/.paw/agents/' + agentId));

      console.log(chalk.cyan('\n💰 Fund your wallet:'));
      if (options.network === 'devnet') {
        console.log(chalk.white('  solana airdrop 2 ' + walletInfo.address + ' --url devnet'));
        console.log(chalk.gray('  or visit: https://faucet.solana.com'));
      } else {
        console.log(chalk.white('  Send SOL to: ' + walletInfo.address));
        console.log(chalk.gray('  From any exchange or wallet'));
      }

      console.log(chalk.cyan('\n📟 Next steps:'));
      console.log(chalk.white('  paw address ' + agentId));
      console.log(chalk.white('  paw balance ' + agentId));
      console.log('');

    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), (error as Error).message);
      process.exit(1);
    }
  });
