/**
 * Price fetching utilities
 */

export class PriceService {
  private static SOL_PRICE_CACHE: { price: number; timestamp: number } | null = null;
  private static CACHE_DURATION = 60000; // 1 minute cache

  /**
   * Fetch current SOL price from CoinGecko
   */
  static async getSolPrice(): Promise<number> {
    try {
      // Check cache first
      if (
        this.SOL_PRICE_CACHE &&
        Date.now() - this.SOL_PRICE_CACHE.timestamp < this.CACHE_DURATION
      ) {
        return this.SOL_PRICE_CACHE.price;
      }

      // Fetch from CoinGecko (free API, no key needed)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch SOL price');
      }

      const data = await response.json() as { solana?: { usd?: number } };
      const price = data.solana?.usd;

      if (!price) {
        throw new Error('Invalid price data');
      }

      // Update cache
      this.SOL_PRICE_CACHE = {
        price,
        timestamp: Date.now(),
      };

      return price;
    } catch (error) {
      // Fallback to approximate price if API fails
      console.warn('⚠️  Could not fetch live SOL price, using fallback');
      return 100; // Fallback price
    }
  }
}
