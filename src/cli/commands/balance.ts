import { Command } from 'commander';
import { WalletManager } from '../../core/wallet/manager';
import { SolanaClient } from '../../utils/solana';
import { FileSystemStorage } from '../../core/storage/filesystem';
import { PublicKey, Cluster } from '@solana/web3.js';
import { PriceService } from '../../utils/price';

export const balanceCommand = new Command('balance')
  .description('📟 Check wallet balance')
  .argument('[agent-id]', 'Agent identifier')
  .option('--agent-id <id>', 'Agent identifier (alternative)')
  .option('--network <network>', 'Network to use (overrides config)')
  .action(async (agentIdArg, options) => {
    try {
      // Support both positional and flag syntax
      const agentId = agentIdArg || options.agentId;
      
      if (!agentId) {
        console.error('\n❌ Error: Agent ID is required');
        console.log('\nUsage: paw balance <agent-id>');
        console.log('   or: paw balance --agent-id <agent-id>');
        console.log('');
        process.exit(1);
      }

      const walletInfo = await WalletManager.getWalletInfo(agentId);
      
      // Use network from options or fall back to config
      let network = options.network;
      if (!network) {
        const config = await FileSystemStorage.loadConfig(agentId);
        network = config.network || 'mainnet-beta';
      }

      const connection = SolanaClient.getConnection(network as Cluster);
      const publicKey = new PublicKey(walletInfo.address);

      // Get SOL balance
      const solBalanceLamports = await connection.getBalance(publicKey);
      const solBalance = solBalanceLamports / 1e9;

      // Get SPL token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
      );

      // Calculate total value in USD
      const SOL_PRICE = await PriceService.getSolPrice();
      let totalUSD = solBalance * SOL_PRICE;
      
      // Track stablecoin balances
      let stablecoinBalance = 0;

      // Add SPL token values
      for (const accountInfo of tokenAccounts.value) {
        const parsedInfo = accountInfo.account.data.parsed.info;
        const mint = parsedInfo.mint;
        const tokenBalance = parsedInfo.tokenAmount.uiAmount || 0;
        
        // Known stablecoins = $1 each
        const stablecoins = [
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
          'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
        ];
        
        if (stablecoins.includes(mint)) {
          stablecoinBalance += tokenBalance;
          totalUSD += tokenBalance;
        }
      }

      const totalSOL = totalUSD / SOL_PRICE;

      console.log('\n📟 PAW - Balance');
      console.log('Agent ID:', agentId);
      console.log('Address: ', walletInfo.address);
      console.log('Network: ', network);
      console.log('');
      console.log('💰 Total Portfolio:');
      console.log('   ~' + totalSOL.toFixed(6), 'SOL');
      console.log('   ~' + totalUSD.toFixed(2), 'USD');
      console.log('');
    } catch (error) {
      console.error('\n❌ Error:', (error as Error).message);
      process.exit(1);
    }
  });
