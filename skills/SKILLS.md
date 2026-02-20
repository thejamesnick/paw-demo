# 📟 PAW Skills for AI Agents

**PocketAgent Wallet (PAW)** - Lightning-fast autonomous wallet for AI agents on Solana

## What is PAW?

PAW is a high-performance agentic wallet designed for AI agents to execute crypto operations at Telegram bot speed. Built with Helius RPC for maximum throughput.

Key capabilities:
- Create and manage wallets programmatically
- Sign transactions automatically (no human approval needed)
- Execute swaps in milliseconds via Jupiter DEX
- Hold SOL and any SPL token
- Real-time balance and transaction tracking

## Quick Command Reference

### Essential Commands

```bash
# Create wallet (defaults to mainnet-beta for real trading)
paw init <agent-id>

# Or specify network:
# paw init <agent-id> --network devnet  # For testing with free SOL
# paw init <agent-id> --network mainnet-beta  # For real trading (default)

# Get address
paw address <agent-id>

# Check total portfolio (SOL + tokens in USD)
paw balance <agent-id>

# List all tokens
paw tokens <agent-id>

# Send SOL
paw send <agent-id> --to <address> --amount <sol-amount>

# Swap tokens (Jupiter DEX)
paw swap <agent-id> --from <token> --to <token> --amount <amount>

# View transaction history
paw history <agent-id>

# Configure wallet settings
paw config <agent-id> --network <devnet|mainnet-beta|testnet>
paw config <agent-id> --slippage <bps>
paw config <agent-id> --priority-fee <lamports>
paw config <agent-id> --show
```

## AI Agent Workflow Examples

### Example 1: Check Balance Before Action

```bash
# Get balance
paw balance trading-bot-001

# Output shows total portfolio:
# 💰 Total Portfolio:
#    ~1.649990 SOL
#    ~138.68 USD
```

### Example 2: Fast Token Swap

```bash
# Swap 0.1 SOL to USDC on mainnet
paw swap trading-bot-001 --from SOL --to USDC --amount 0.1 --network mainnet-beta

# Executes in <2 seconds using Jupiter aggregator
```

### Example 3: Send Payment

```bash
# Send 0.5 SOL to another agent
paw send agent-alice --to DJcVfT6dienfSbudJzZ82WN4EkVPgVaT18oBK971Yi2c --amount 0.5

# Or send to another agent by ID (if you know their address)
paw send agent-alice --to <address> --amount 0.5
```

### Example 4: Monitor Transactions

```bash
# Check last 10 transactions
paw history trading-bot-001 --limit 10

# Shows table with:
# - Transaction signature
# - Type (send/receive)
# - Amount
# - Status (success/failed)
# - Timestamp
```

### Example 5: Multi-Agent Setup

```bash
# Create multiple agents
paw init agent-alice
paw init agent-bob
paw init trading-bot-001

# Each agent has independent wallet and config
# Stored in ~/.paw/agents/<agent-id>/
```

## Decision-Making Script for AI Agents

```bash
#!/bin/bash
# Autonomous trading agent

AGENT="trading-bot-001"

# 1. Check portfolio
BALANCE=$(paw balance $AGENT)

# 2. Get transaction history
HISTORY=$(paw history $AGENT --limit 5)

# 3. Make decision based on balance
# If balance > 1 SOL, swap some to USDC
paw swap $AGENT --from SOL --to USDC --amount 0.5

# 4. Verify transaction
paw history $AGENT --limit 1
```

## Performance Features

### Lightning Fast Execution
- **Helius RPC**: Premium RPC endpoints for mainnet and devnet
- **Connection Pooling**: Reuses connections for speed
- **Jupiter DEX**: Best price aggregation across all Solana DEXs
- **Real-time Prices**: Live SOL price from CoinGecko

### Speed Comparison
- Balance check: ~200ms
- Token swap: ~1-2 seconds
- Send transaction: ~500ms
- History fetch: ~300ms

Similar to Telegram trading bots - fast enough for real-time trading!

## Network Configuration

```bash
# Set network (persists in config)
paw config <agent-id> --network mainnet-beta

# Set default slippage for all swaps (in basis points)
paw config <agent-id> --slippage 1000  # 10% for meme coins

# Set default priority fee for faster execution
paw config <agent-id> --priority-fee 100000  # 100k lamports

# Set multiple settings at once
paw config <agent-id> --network mainnet-beta --slippage 1000 --priority-fee 100000

# View current configuration
paw config <agent-id> --show

# Networks:
# - devnet: Free testing (use faucet for SOL)
# - mainnet-beta: Real money, production
# - testnet: Testing network

# Override config for single command
paw balance <agent-id> --network mainnet-beta
paw swap <agent-id> --from SOL --to USDC --amount 0.1 --slippage 500
```

## Common Token Addresses

```bash
# Mainnet tokens
SOL: Native token (use "SOL")
USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
USDT: Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
BONK: DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263

# Use token symbol or mint address
paw swap bot-1 --from SOL --to USDC --amount 0.1
```

## Security Model

### Double Encryption (Safe Inside a Safe)
1. **Layer 1**: Wallet keypair encrypted with AES-256-GCM + passphrase
2. **Layer 2**: Passphrase encrypted with machine-specific key

### Machine-Specific Key
Generated from:
- Hostname + Username + OS + Architecture + Home directory
- Wallet files are useless if stolen (only work on your machine)

### Memory Safety
- Keypairs loaded only when needed
- Cleared from memory immediately after use
- No plaintext secrets on disk

## Getting Started on Devnet (Testing)

```bash
# 1. Create wallet on devnet for testing
paw init my-first-agent --network devnet

# 2. Get address
ADDRESS=$(paw address my-first-agent | grep "Address:" | awk '{print $2}')

# 3. Get free devnet SOL
solana airdrop 2 $ADDRESS --url devnet

# 4. Check balance
paw balance my-first-agent

# 5. Test send
paw send my-first-agent --to <another-address> --amount 0.1

# 6. Check history
paw history my-first-agent
```

## Use Cases for AI Agents

1. **High-Frequency Trading Bot**: Execute trades based on price signals
2. **Meme Coin Trading**: Snipe launches, scalp pumps, automated take-profit
3. **Portfolio Manager**: Rebalance assets automatically
4. **Payment Processor**: Handle recurring payments
5. **Arbitrage Bot**: Cross-DEX arbitrage opportunities
6. **Yield Optimizer**: Move funds to highest yield protocols
7. **Market Maker**: Provide liquidity and earn fees
8. **DCA Bot**: Dollar-cost averaging strategy

## Meme Trading Capabilities

PAW is built for fast, autonomous meme coin trading:

### Quick Meme Trading Commands

```bash
# Buy meme coin with custom slippage
paw swap bot --from SOL --to <MEME_MINT> --amount 0.5 --slippage 1000

# Sell meme coin fast with priority fee
paw swap bot --from <MEME_MINT> --to SOL --amount 1000000 --slippage 1000 --priority-fee 100000

# Trade popular meme coins by symbol
paw swap bot --from SOL --to BONK --amount 0.5 --slippage 500
```

### Slippage Settings for Meme Coins

```bash
--slippage 50     # 0.5% - Stable tokens
--slippage 100    # 1% - Normal trading
--slippage 500    # 5% - Meme coins (volatile)
--slippage 1000   # 10% - High volatility / low liquidity
--slippage 5000   # 50% - New launches / extreme volatility
```

### Priority Fees for Speed

```bash
--priority-fee 10000    # Normal speed
--priority-fee 50000    # Fast
--priority-fee 100000   # Very fast (meme launches)
--priority-fee 500000   # Ultra fast (competitive sniping)
```

### Example: Sniper Bot

```bash
#!/bin/bash
# Snipe new token launch

AGENT="sniper-bot"
TARGET="<NEW_MEME_MINT>"

# Fast execution with high priority
paw swap $AGENT \
  --from SOL \
  --to $TARGET \
  --amount 0.5 \
  --slippage 2000 \
  --priority-fee 500000

# Verify purchase
paw tokens $AGENT | grep $TARGET
```

### Example: Take Profit Bot

```bash
#!/bin/bash
# Sell when target hit

AGENT="profit-bot"
MEME="<MEME_MINT>"

# Sell 50% of holdings
paw swap $AGENT \
  --from $MEME \
  --to SOL \
  --amount 500000 \
  --slippage 1000 \
  --priority-fee 100000
```

### Popular Meme Coins

```bash
BONK: DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
WIF: EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm
POPCAT: 7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr

# Use symbol or mint address
paw swap bot --from SOL --to BONK --amount 0.5
```

### Why PAW is Fast for Meme Trading

- **Helius RPC**: Premium endpoints for fastest execution
- **Jupiter DEX**: Aggregates ALL Solana DEXs for best prices
- **Auto Priority Fees**: Transactions land faster during congestion
- **<2 Second Swaps**: Fast enough to snipe launches and catch pumps
- **No Human Approval**: Fully autonomous execution

For detailed meme trading strategies, see: `docs/MEME_TRADING_GUIDE.md`

## Command Output Format

All commands output clean, parseable text:

```bash
# Balance output
📟 PAW - Balance
Agent ID: trading-bot-001
Address:  HWd4qkpz5r7c9zSFSUGy2MkkvwuvFd3tqiMkCLiMyb4D
Network:  devnet

💰 Total Portfolio:
   ~1.649990 SOL
   ~138.68 USD

# Easy to parse with grep/awk for automation
```

## Error Handling

PAW provides clear error messages:

```bash
# Insufficient balance
❌ Error: Insufficient balance. Required: 1.5 SOL, Available: 0.5 SOL

# Invalid address
❌ Error: Invalid recipient address

# Network issues
❌ Error: Failed to connect to Solana network
```

## Tips for AI Agents

1. **Always check balance before transactions**
2. **Use --network flag to override config when needed**
3. **Monitor transaction history to verify operations**
4. **Start on devnet for testing, move to mainnet when ready**
5. **Use tokens command to see all assets**
6. **Set network in config to avoid repeating --network flag**

## File Locations

```bash
# Wallet data
~/.paw/agents/<agent-id>/wallet.enc
~/.paw/agents/<agent-id>/passphrase.enc
~/.paw/agents/<agent-id>/config.json

# All encrypted except config.json
```

---

**Built for speed, security, and autonomy** 📟

For issues or questions: https://github.com/pocketagent/paw
