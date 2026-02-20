# 📟 PAW Meme Trading Guide for AI Agents

## Why PAW is Perfect for Meme Trading

PAW is built for speed and autonomy - exactly what you need for serious meme coin trading on Solana:

### Speed Features
- **Helius RPC**: Premium endpoints for fastest execution
- **Jupiter DEX**: Aggregates ALL Solana DEXs (Raydium, Orca, Meteora, etc.)
- **Auto Priority Fees**: Transactions land faster during high congestion
- **Connection Pooling**: Reuses connections for minimal latency
- **<2 Second Swaps**: Fast enough to snipe launches and catch pumps

### Trading Features
- **Custom Slippage**: Set high slippage for volatile meme coins
- **Priority Fees**: Boost transaction priority for faster execution
- **Any Token**: Trade ANY SPL token by mint address
- **Real-time Monitoring**: Check balance and history instantly
- **Autonomous**: No human approval needed

## Meme Trading Commands

### Basic Meme Coin Swap

```bash
# Buy meme coin with SOL
paw swap trading-bot --from SOL --to <MEME_MINT_ADDRESS> --amount 0.5 --slippage 1000

# Sell meme coin for SOL
paw swap trading-bot --to SOL --from <MEME_MINT_ADDRESS> --amount 1000000 --slippage 1000
```

### High-Speed Trading (Priority Fees)

```bash
# Use custom priority fee for faster execution
paw swap trading-bot \
  --from SOL \
  --to <MEME_MINT_ADDRESS> \
  --amount 0.5 \
  --slippage 1000 \
  --priority-fee 100000

# Priority fee guide:
# - 10,000 lamports: Normal speed
# - 50,000 lamports: Fast
# - 100,000 lamports: Very fast (meme launches)
# - 500,000+ lamports: Ultra fast (competitive sniping)
```

### Slippage Settings

```bash
# Conservative (stable tokens)
--slippage 50    # 0.5%

# Normal trading
--slippage 100   # 1%

# Meme coins (volatile)
--slippage 500   # 5%

# High volatility / low liquidity
--slippage 1000  # 10%

# Extreme (new launches, very low liquidity)
--slippage 5000  # 50%
```

## AI Agent Trading Strategies

### 1. Sniper Bot (New Launches)

```bash
#!/bin/bash
# Snipe new token launches

AGENT="sniper-bot"
TARGET_TOKEN="<NEW_MEME_MINT>"
BUY_AMOUNT="0.5"

# Fast execution with high priority
paw swap $AGENT \
  --from SOL \
  --to $TARGET_TOKEN \
  --amount $BUY_AMOUNT \
  --slippage 2000 \
  --priority-fee 500000

# Check if successful
paw tokens $AGENT | grep $TARGET_TOKEN
```

### 2. Take Profit Bot

```bash
#!/bin/bash
# Sell when profit target hit

AGENT="profit-bot"
MEME_TOKEN="<MEME_MINT>"

# Check current holdings
BALANCE=$(paw tokens $AGENT | grep $MEME_TOKEN)

# Sell 50% at 2x
paw swap $AGENT \
  --from $MEME_TOKEN \
  --to SOL \
  --amount 500000 \
  --slippage 1000 \
  --priority-fee 100000
```

### 3. DCA (Dollar Cost Averaging)

```bash
#!/bin/bash
# Buy fixed amount regularly

AGENT="dca-bot"
TARGET="DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" # BONK

# Buy 0.1 SOL worth every hour
while true; do
  paw swap $AGENT \
    --from SOL \
    --to $TARGET \
    --amount 0.1 \
    --slippage 500
  
  sleep 3600  # 1 hour
done
```

### 4. Arbitrage Bot

```bash
#!/bin/bash
# Monitor price differences

AGENT="arb-bot"
TOKEN="<MEME_MINT>"

# Jupiter automatically finds best route across all DEXs
# Just execute the swap and Jupiter handles the rest
paw swap $AGENT \
  --from SOL \
  --to $TOKEN \
  --amount 1.0 \
  --slippage 300
```

### 5. Portfolio Rebalancer

```bash
#!/bin/bash
# Maintain target allocation

AGENT="rebalance-bot"

# Check total portfolio
PORTFOLIO=$(paw balance $AGENT)

# If SOL > 60%, swap some to stables
paw swap $AGENT \
  --from SOL \
  --to USDC \
  --amount 0.5 \
  --slippage 100
```

## Finding Meme Coin Addresses

### Method 1: Jupiter Token List

```bash
# PAW can search Jupiter's token list
# Use token symbol or mint address
paw swap bot --from SOL --to BONK --amount 0.1
```

### Method 2: Solana Explorer

1. Go to https://explorer.solana.com
2. Search for token name
3. Copy mint address
4. Use in PAW commands

### Method 3: DexScreener

1. Go to https://dexscreener.com/solana
2. Find your meme coin
3. Copy contract address
4. Use as mint address

## Risk Management

### Position Sizing

```bash
# Never risk more than you can afford to lose
# Example: 1% of portfolio per trade

PORTFOLIO=$(paw balance $AGENT | grep "SOL" | awk '{print $2}')
RISK_AMOUNT=$(echo "$PORTFOLIO * 0.01" | bc)

paw swap $AGENT \
  --from SOL \
  --to <MEME> \
  --amount $RISK_AMOUNT \
  --slippage 1000
```

### Stop Loss

```bash
#!/bin/bash
# Sell if down 50%

AGENT="trader-bot"
ENTRY_PRICE=100  # Track your entry
STOP_LOSS=50     # 50% down

# Check current value (implement price checking)
# If current < stop_loss, sell
paw swap $AGENT \
  --from <MEME> \
  --to SOL \
  --amount <FULL_BALANCE> \
  --slippage 1000 \
  --priority-fee 200000  # Fast exit
```

## Performance Optimization

### 1. Use Mainnet

```bash
# Always use mainnet for real trading
paw config $AGENT --network mainnet-beta
```

### 2. Monitor Gas Fees

```bash
# During high congestion, increase priority fees
# Check Solana network status: https://status.solana.com
```

### 3. Batch Operations

```bash
# Check balance once, make multiple decisions
BALANCE=$(paw balance $AGENT)
TOKENS=$(paw tokens $AGENT)

# Then execute trades based on data
```

### 4. Error Handling

```bash
#!/bin/bash
# Retry failed swaps

MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if paw swap $AGENT --from SOL --to <MEME> --amount 0.5 --slippage 1000; then
    echo "Swap successful!"
    break
  else
    echo "Swap failed, retrying..."
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 2
  fi
done
```

## Common Meme Coins

```bash
# Popular meme coins on Solana (mainnet)
BONK: DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
WIF: EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm
POPCAT: 7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr
MEW: MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5

# Use in commands
paw swap bot --from SOL --to BONK --amount 0.5 --slippage 500
```

## Monitoring & Analytics

### Check Performance

```bash
# View recent trades
paw history $AGENT --limit 20

# Check current holdings
paw tokens $AGENT

# Check total portfolio value
paw balance $AGENT
```

### Transaction Verification

```bash
# After swap, verify on explorer
# PAW outputs: https://explorer.solana.com/tx/<signature>

# Or check balance
paw tokens $AGENT | grep <TOKEN_SYMBOL>
```

## Advanced: Multi-Agent Trading

```bash
# Create multiple specialized agents
paw init sniper-bot-001    # For new launches
paw init swing-bot-001     # For swing trades
paw init scalp-bot-001     # For quick scalps

# Each agent has independent wallet and strategy
# Distribute risk across multiple agents
```

## Safety Tips

1. **Start Small**: Test with small amounts first
2. **Use Devnet**: Practice on devnet before mainnet
3. **Set Limits**: Never trade more than you can afford to lose
4. **Monitor Slippage**: High slippage = high price impact
5. **Check Liquidity**: Low liquidity = higher risk
6. **Verify Tokens**: Always verify mint address before trading
7. **Priority Fees**: Higher fees = faster execution but more cost
8. **Network Status**: Check Solana network health before trading

## Troubleshooting

### Swap Failed

```bash
# Common issues:
# 1. Insufficient balance
paw balance $AGENT

# 2. Slippage too low
# Increase --slippage value

# 3. Network congestion
# Increase --priority-fee value

# 4. Invalid token address
# Verify mint address on explorer
```

### Slow Execution

```bash
# Increase priority fee
--priority-fee 500000

# Check network status
# https://status.solana.com
```

## Example: Complete Trading Bot

```bash
#!/bin/bash
# Full meme trading bot

AGENT="meme-trader-001"
TARGET_TOKEN="DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"  # BONK

# 1. Check balance
BALANCE=$(paw balance $AGENT | grep "SOL" | awk '{print $3}')
echo "Current balance: $BALANCE SOL"

# 2. Buy if balance > 1 SOL
if (( $(echo "$BALANCE > 1" | bc -l) )); then
  echo "Buying meme coin..."
  paw swap $AGENT \
    --from SOL \
    --to $TARGET_TOKEN \
    --amount 0.5 \
    --slippage 1000 \
    --priority-fee 100000
fi

# 3. Check holdings
echo "Current holdings:"
paw tokens $AGENT

# 4. Check recent transactions
echo "Recent trades:"
paw history $AGENT --limit 5
```

---

**Trade fast, trade smart, trade autonomous** 📟

Remember: Meme coins are highly volatile. Only trade what you can afford to lose!
