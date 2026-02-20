# 📟 PAW Token Swap Guide

## Jupiter DEX Integration

PAW integrates with Jupiter Aggregator, the best DEX aggregator on Solana, to enable token swaps.

## Important Notes

⚠️ **Jupiter only works on mainnet-beta**
- Devnet does not support Jupiter DEX
- You need real SOL on mainnet to test swaps
- Minimum recommended: 0.01 SOL for testing

## How Token Swaps Work

1. **Get Quote**: PAW fetches the best swap route from Jupiter
2. **Create Transaction**: Jupiter creates the swap transaction
3. **Sign & Execute**: PAW signs and sends the transaction
4. **Confirm**: Transaction is confirmed on-chain

## Supported Tokens

PAW supports swapping between any tokens on Jupiter, including:

- **SOL** - Native Solana token
- **USDC** - USD Coin stablecoin
- **USDT** - Tether stablecoin
- **BONK** - Bonk meme token
- Any other SPL token (use mint address)

## Command Syntax

```bash
paw swap <agent-id> --from <token> --to <token> --amount <amount> [options]
```

### Options:
- `--from <token>` - Input token (SOL, USDC, USDT, BONK or mint address)
- `--to <token>` - Output token (SOL, USDC, USDT, BONK or mint address)
- `--amount <amount>` - Amount to swap
- `--slippage <bps>` - Slippage tolerance in basis points (default: 50)
- `--network <network>` - Must be mainnet-beta

## Examples

### Swap SOL for USDC

```bash
# Swap 0.1 SOL for USDC
paw swap my-agent --from SOL --to USDC --amount 0.1
```

### Swap USDC for SOL

```bash
# Swap 10 USDC for SOL
paw swap my-agent --from USDC --to SOL --amount 10
```

### Swap with Custom Slippage

```bash
# Swap with 1% slippage (100 basis points)
paw swap my-agent --from SOL --to USDC --amount 0.1 --slippage 100
```

### Swap Using Mint Addresses

```bash
# Swap using token mint addresses
paw swap my-agent \
  --from So11111111111111111111111111111111111111112 \
  --to EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v \
  --amount 0.1
```

## Step-by-Step Test Guide

### 1. Create Mainnet Wallet

```bash
paw init swap-test-agent --network mainnet-beta
```

### 2. Get Wallet Address

```bash
paw address swap-test-agent
```

### 3. Fund Wallet

Send at least 0.01 SOL to the address from step 2.

You can:
- Transfer from another wallet
- Buy SOL on an exchange and withdraw
- Use a faucet (if available)

### 4. Check Balance

```bash
paw balance swap-test-agent
```

Should show your SOL balance.

### 5. Execute Swap

```bash
# Swap 0.005 SOL for USDC (small test amount)
paw swap swap-test-agent --from SOL --to USDC --amount 0.005
```

### 6. Verify Tokens

```bash
# Check all tokens in wallet
paw tokens swap-test-agent
```

Should now show both SOL and USDC.

### 7. Check History

```bash
# View transaction history
paw history swap-test-agent --limit 5
```

Should show the swap transaction.

## Expected Output

When you run a swap, you'll see:

```
📟 PAW - Token Swap
Agent ID: swap-test-agent
From:     SOL
To:       USDC
Amount:   0.005
Network:  mainnet-beta

Fetching quote from Jupiter...

📊 Quote:
Input:   0.005 SOL
Output:  0.912345 USDC
Price Impact: 0.05 %
Slippage: 50 bps

Preparing swap transaction...
Executing swap...

✅ Swap completed!
Signature: 5KJh8F9Zf...
Explorer:  https://explorer.solana.com/tx/5KJh8F9Zf...
```

## Understanding Slippage

Slippage is the difference between expected and actual swap price.

- **50 bps** (0.5%) - Default, good for most swaps
- **100 bps** (1%) - More tolerance for volatile tokens
- **10 bps** (0.1%) - Tight slippage for stablecoins

Higher slippage = more likely to succeed but worse price.

## Common Tokens

| Token | Symbol | Mint Address |
|-------|--------|--------------|
| Solana | SOL | So11111111111111111111111111111111111111112 |
| USD Coin | USDC | EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v |
| Tether | USDT | Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB |
| Bonk | BONK | DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263 |

## Troubleshooting

### "Jupiter only works on mainnet-beta"

**Solution:** Add `--network mainnet-beta` or set it in config:
```bash
paw config my-agent --network mainnet-beta
```

### "Insufficient balance"

**Solution:** Fund your wallet with more SOL.

### "Slippage tolerance exceeded"

**Solution:** Increase slippage:
```bash
paw swap my-agent --from SOL --to USDC --amount 0.1 --slippage 100
```

### "Token account not found"

**Solution:** The token account will be created automatically during the swap.

## Why Jupiter?

Jupiter is the best DEX aggregator on Solana because:

- ✅ Best prices across all DEXs
- ✅ Lowest slippage
- ✅ Supports all tokens
- ✅ Fast execution
- ✅ Reliable API

## For AI Agents

AI agents can use swaps to:

- **Rebalance portfolios** - Maintain target allocations
- **Take profits** - Convert gains to stablecoins
- **Execute strategies** - Implement trading algorithms
- **Manage risk** - Hedge positions
- **Optimize yield** - Move between opportunities

## Example AI Agent Strategy

```bash
#!/bin/bash
# Simple rebalancing agent

AGENT_ID="rebalance-bot"

# Check SOL balance
SOL_BALANCE=$(paw balance $AGENT_ID | grep "Balance:" | awk '{print $2}')

# If SOL > 1, swap 50% to USDC
if (( $(echo "$SOL_BALANCE > 1" | bc -l) )); then
  SWAP_AMOUNT=$(echo "$SOL_BALANCE * 0.5" | bc)
  paw swap $AGENT_ID --from SOL --to USDC --amount $SWAP_AMOUNT
fi
```

## Security Notes

- ✅ Swaps are signed automatically by PAW
- ✅ Private keys never leave your machine
- ✅ Transactions are confirmed on-chain
- ⚠️ Always test with small amounts first
- ⚠️ Check slippage settings for large swaps

## Resources

- **Jupiter Website**: https://jup.ag
- **Jupiter Docs**: https://station.jup.ag/docs
- **Token List**: https://token.jup.ag/all
- **Solana Explorer**: https://explorer.solana.com

---

**Ready to swap? Fund your wallet and try it out!** 📟💱
