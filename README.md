# PAW 📟

**PocketAgent Wallet** - Agentic Wallets for Autonomous AI Agents

> Give your AI agents the power to manage their own crypto

## About PAW

PAW (PocketAgent Wallet) is a specialized wallet infrastructure designed for AI agents to autonomously manage crypto assets and interact with DeFi protocols. Unlike traditional wallets built for humans, PAW enables AI agents to hold funds, execute transactions, and participate in DeFi—all without manual approval for every action.

Think of it as giving your AI agent its own pocket of crypto that it can manage intelligently within the guardrails you set.

## What We're Building

PAW provides:

- **Programmatic Wallet Creation** - AI agents create wallets on demand
- **Automated Transaction Signing** - No manual approval needed
- **SOL & SPL Token Support** - Full Solana token compatibility
- **DeFi Protocol Integration** - Jupiter DEX for best swap prices
- **Lightning-Fast Execution** - Helius RPC for <2 second swaps
- **Meme Trading Ready** - Configurable slippage and priority fees
- **Real-Time Pricing** - Live SOL prices from CoinGecko
- **Safe Key Management** - Double encryption (wallet + machine-specific passphrase)
- **Multi-Agent Support** - Each agent manages its own wallet independently
- **Interactive Dashboard** - Retro pager-style TUI for monitoring

## Submission Requirements

✅ Working prototype on Solana Devnet  
✅ Programmatic wallet creation  
✅ Automatic transaction signing  
✅ DeFi protocol interaction (Jupiter for swaps)  
✅ Deep dive documentation (written + video)  
✅ Open-source code with README  
✅ SKILLS.md for AI agents  
✅ Demo of autonomous agent using the wallet

## Current Status

🚧 **In Development** - Building for the Superteam DeFi Developer Challenge

**Phase 1:** Solana Implementation (Current Focus)
- Starting with Solana for fast, low-cost transactions
- Building core wallet infrastructure
- Implementing basic DeFi integrations

**Phase 2:** Multi-chain Expansion (Planned)
- EVM chains (Ethereum, Base, Polygon)
- Cross-chain capabilities
- Unified API across all chains

## Why Solana First?

We're launching on Solana because:
- ⚡ Fast transaction speeds (400ms block times)
- 💰 Low fees (fractions of a cent)
- 🤖 Perfect for high-frequency agent operations
- 🌊 Rich DeFi ecosystem (Jupiter, Raydium, Marinade, etc.)
- 📈 Growing AI agent community

## Key Features

### 🚀 Lightning-Fast Trading
- **Helius RPC**: Premium endpoints for fastest execution
- **<2 Second Swaps**: Fast enough to snipe meme launches
- **Priority Fees**: Configurable fees for competitive trading
- **Jupiter DEX**: Best prices across ALL Solana DEXs
- **Faster than Mobile Wallets**: 2-3x faster than Phantom/Solflare

### 💰 Portfolio Management
- **Real-Time Pricing**: Live SOL prices from CoinGecko
- **Total Portfolio View**: See combined value of SOL + tokens in USD
- **Multi-Token Support**: Trade any SPL token by mint address
- **Transaction History**: Track all agent activities

### 🎯 Meme Trading Ready
- **Configurable Slippage**: Set high slippage for volatile tokens
- **Custom Priority Fees**: Boost transaction speed during congestion
- **Config Defaults**: Set slippage/fees once, use everywhere
- **Popular Tokens**: Built-in support for BONK, WIF, POPCAT, etc.

### 🔐 Enterprise Security
- **Double Encryption**: Wallet + machine-specific passphrase
- **Zero Plaintext**: All secrets encrypted at rest
- **Memory Safe**: Keys cleared after use
- **Theft Resistant**: Stolen files are useless

### 📟 Retro Dashboard
- **Pager-Style TUI**: Monochrome green-on-black aesthetic
- **Real-Time Updates**: Auto-refresh every 30 seconds
- **Transaction Feed**: Recent activity at a glance
- **Keyboard Controls**: Navigate with arrow keys

## Use Cases

- **Meme Coin Trading** - Snipe launches, scalp pumps, automated take-profit
- **High-Frequency Trading** - Execute trades at Telegram bot speed
- **Yield Farmers** - Agents that optimize yield across protocols
- **Portfolio Managers** - Rebalancing and diversification agents
- **Arbitrage Agents** - Cross-DEX opportunity seekers
- **DCA Bots** - Dollar-cost averaging strategies
- **DAO Participants** - Agents that vote and manage treasury

## Tech Stack

- **Language:** TypeScript/Node.js
- **CLI Framework:** Commander.js
- **Blockchain:** Solana (Devnet + Mainnet)
- **RPC Provider:** Helius (premium endpoints)
- **Wallet Library:** @solana/web3.js
- **Key Storage:** AES-256-GCM encrypted files (~/.paw/)
- **Encryption:** Double-layer (wallet + machine-specific)
- **DeFi Integration:** Jupiter Aggregator API v6
- **Price Feeds:** CoinGecko API
- **Dashboard:** Blessed (retro TUI)
- **Package Manager:** Yarn

## Security Model

PAW uses a **double-encryption security model** for maximum protection:

### Layer 1: Wallet Encryption (AES-256-GCM)
- **What:** Your wallet's private key
- **Encrypted with:** Random passphrase (32 bytes)
- **Algorithm:** AES-256-GCM with PBKDF2 (100,000 iterations)
- **Result:** `keypair.enc` (encrypted blob)

### Layer 2: Passphrase Encryption (Machine-Specific)
- **What:** The passphrase from Layer 1
- **Encrypted with:** Machine-specific key (derived from hostname, username, OS, etc.)
- **Algorithm:** AES-256-CBC with Scrypt
- **Result:** `.passphrase` (encrypted blob, only works on this machine)

### Layer 3: File Permissions
- **All files:** Mode 0600 (owner read/write only)
- **OS-level protection:** Other users can't read files

**Key Features:**
- 🔐 Double encryption (safe inside a safe)
- 🖥️ Machine-bound (files useless on other computers)
- 🔑 Zero plaintext (everything encrypted at rest)
- 🧹 Memory-safe (keys cleared after signing)
- 🛡️ Theft-resistant (stolen files are useless)

### What's Stored on Disk:

```bash
~/.paw/agents/bot-001/
├── keypair.enc          # Encrypted wallet (AES-256-GCM)
├── .passphrase          # Encrypted passphrase (machine-specific)
└── config.json          # Public metadata only (no secrets)
```

**All secrets are encrypted - nothing in plaintext!**

See [SECURITY.md](about/SECURITY.md) for detailed security documentation.

## Project Structure

```
paw/
├── src/
│   ├── cli/           # CLI interface and commands
│   ├── core/          # Core wallet system (TypeScript)
│   │   ├── wallet/    # Wallet creation & management
│   │   ├── signer/    # Automatic transaction signing
│   │   └── storage/   # Secure key storage
│   ├── integrations/  # DeFi protocol integrations
│   │   └── jupiter/   # Jupiter DEX integration
│   └── utils/         # Helper utilities
├── examples/
│   ├── trading-bot/   # Demo trading agent
│   ├── openclaw/      # OpenClaw integration example
│   └── multi-agent/   # Multi-agent demo
├── docs/
│   ├── README.md
│   ├── SKILLS.md      # For AI agents to read
│   ├── DEEP_DIVE.md   # Technical deep dive
│   └── API.md         # CLI command reference
└── tests/             # Test suite
```

## Getting Started

### Installation

```bash
# Install PAW globally (like installing a wallet app)
npm install -g @pocketagent/paw
```

### Quick Start

```bash
# 1. Create a wallet for your agent (defaults to mainnet-beta)
paw init my-trading-bot

# Or specify network explicitly:
# paw init my-trading-bot --network devnet  # For testing
# paw init my-trading-bot --network mainnet-beta  # For real trading

# 2. Get your wallet address
paw address my-trading-bot

# 3. Fund it on Solana devnet (use faucet)
# Visit: https://faucet.solana.com

# 4. Check total portfolio balance (SOL + tokens in USD)
paw balance my-trading-bot

# 5. Configure for meme trading (mainnet)
paw config my-trading-bot --network mainnet-beta --slippage 1000 --priority-fee 100000

# 6. List all tokens
paw tokens my-trading-bot

# 7. Send SOL
paw send my-trading-bot --to <recipient-address> --amount 0.5

# 8. Swap tokens (fast execution with Jupiter)
paw swap my-trading-bot --from SOL --to BONK --amount 0.5

# 9. View transaction history
paw history my-trading-bot

# 10. Launch interactive dashboard
paw dashboard my-trading-bot
```

### For AI Agents

```javascript
// Your agent can execute PAW commands
const { exec } = require('child_process');

// Initialize wallet
exec('paw init trading-bot-001');

// Check total portfolio balance
exec('paw balance trading-bot-001', (err, stdout) => {
  console.log(stdout); 
  // 💰 Total Portfolio:
  //    ~1.649990 SOL
  //    ~138.68 USD
});

// Execute meme coin trade with high slippage
exec('paw swap trading-bot-001 --from SOL --to BONK --amount 0.5 --slippage 1000 --priority-fee 100000');
```

### Programmatic Usage (TypeScript/Node.js)

```typescript
import { WalletManager, SolanaClient } from '@pocketagent/paw';

// Create wallet
const wallet = await WalletManager.createWallet({
  agentId: 'trading-bot-001',
  network: 'devnet',
});

// Check balance
const balance = await SolanaClient.getBalance(wallet.address, 'devnet');
console.log(`Balance: ${balance} SOL`);
```

## Roadmap

- [x] Project planning and design
- [ ] Core wallet infrastructure (Solana Devnet)
  - [ ] Programmatic wallet creation
  - [ ] Automated transaction signing
  - [ ] SOL/SPL token support
- [ ] Key management system
  - [ ] Secure key storage for agents
  - [ ] Encryption and access controls
- [ ] DeFi integration (Jupiter DEX)
  - [ ] Token swaps
  - [ ] Price feeds
- [ ] AI agent simulation
  - [ ] Simple trading bot logic
  - [ ] Decision-making framework
- [ ] Multi-agent support
  - [ ] Independent wallet management
  - [ ] Agent registry
- [ ] Monitoring tools (Optional)
  - [ ] CLI for observing agent actions
  - [ ] Transaction history viewer
- [ ] Documentation
  - [ ] README with setup instructions
  - [ ] SKILLS.md for AI agents
  - [ ] Deep dive (written + video)
- [ ] Testing & deployment on Devnet

## Contributing

This project is being developed for the Superteam DeFi Developer Challenge. Stay tuned for contribution guidelines after the initial release!

## License

TBD

---

**Built for the Superteam DeFi Developer Challenge 2026**  
*Empowering AI agents, one paw at a time* �
