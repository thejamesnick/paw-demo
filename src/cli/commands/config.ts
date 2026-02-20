import { Command } from 'commander';
import { FileSystemStorage } from '../../core/storage/filesystem';

export const configCommand = new Command('config')
  .description('📟 View or update wallet configuration')
  .argument('[agent-id]', 'Agent identifier')
  .option('--agent-id <id>', 'Agent identifier (alternative)')
  .option('--network <network>', 'Set network (devnet, mainnet-beta, testnet)')
  .option('--slippage <bps>', 'Set default slippage in basis points (e.g., 50 = 0.5%, 1000 = 10%)')
  .option('--priority-fee <lamports>', 'Set default priority fee in lamports')
  .option('--show', 'Show current configuration')
  .action(async (agentIdArg, options) => {
    try {
      // Support both positional and flag syntax
      const agentId = agentIdArg || options.agentId;
      
      if (!agentId) {
        console.error('\n❌ Error: Agent ID is required');
        console.log('\nUsage: paw config <agent-id> [options]');
        console.log('   or: paw config --agent-id <agent-id> [options]');
        console.log('');
        process.exit(1);
      }

      // Check if wallet exists
      if (!(await FileSystemStorage.exists(agentId))) {
        console.error('\n❌ Error: Wallet not found for agent:', agentId);
        process.exit(1);
      }

      // Load current config
      const config = await FileSystemStorage.loadConfig(agentId);

      // If --show or no options, display config
      if (options.show || (!options.network && !options.slippage && !options.priorityFee)) {
        console.log('\n📟 PAW - Wallet Configuration');
        console.log('Agent ID:', config.agentId);
        console.log('Address: ', config.publicKey);
        console.log('Network: ', config.network || 'mainnet-beta');
        console.log('Default Slippage:', config.defaultSlippage || 50, 'bps');
        console.log('Default Priority Fee:', config.defaultPriorityFee || 'auto');
        console.log('Created: ', new Date(config.createdAt).toLocaleString());
        console.log('');
        return;
      }

      let updated = false;

      // Update network
      if (options.network) {
        const validNetworks = ['devnet', 'mainnet-beta', 'testnet'];
        if (!validNetworks.includes(options.network)) {
          console.error('\n❌ Error: Invalid network. Must be one of:', validNetworks.join(', '));
          process.exit(1);
        }

        const oldNetwork = config.network;
        config.network = options.network;
        console.log('Network: ', `${oldNetwork} → ${options.network}`);
        updated = true;
      }

      // Update slippage
      if (options.slippage) {
        const slippage = parseInt(options.slippage);
        if (isNaN(slippage) || slippage < 0) {
          console.error('\n❌ Error: Invalid slippage. Must be a positive number.');
          process.exit(1);
        }
        config.defaultSlippage = slippage;
        console.log('Default Slippage:', slippage, 'bps');
        updated = true;
      }

      // Update priority fee
      if (options.priorityFee) {
        const priorityFee = parseInt(options.priorityFee);
        if (isNaN(priorityFee) || priorityFee < 0) {
          console.error('\n❌ Error: Invalid priority fee. Must be a positive number.');
          process.exit(1);
        }
        config.defaultPriorityFee = priorityFee;
        console.log('Default Priority Fee:', priorityFee, 'lamports');
        updated = true;
      }

      if (updated) {
        await FileSystemStorage.saveConfig(agentId, config);
        console.log('\n✅ Configuration updated successfully!');
        console.log('');
      }
    } catch (error) {
      console.error('\n❌ Error:', (error as Error).message);
      process.exit(1);
    }
  });
