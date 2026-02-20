import { Connection, clusterApiUrl, Cluster } from '@solana/web3.js';

export class SolanaClient {
  private static connections: Map<string, Connection> = new Map();
  private static HELIUS_API_KEY = '2452c60f-ab21-4a80-b486-30f0aca63d2f';

  /**
   * Get RPC endpoint with Helius as primary and fallback to default
   */
  private static getEndpoint(network: Cluster): string {
    // Try Helius first for better performance and reliability
    if (this.HELIUS_API_KEY) {
      if (network === 'mainnet-beta') {
        return `https://mainnet.helius-rpc.com/?api-key=${this.HELIUS_API_KEY}`;
      } else if (network === 'devnet') {
        return `https://devnet.helius-rpc.com/?api-key=${this.HELIUS_API_KEY}`;
      }
    }

    // Fallback to default Solana RPC
    return clusterApiUrl(network);
  }

  /**
   * Get or create a connection to Solana
   */
  static getConnection(network: Cluster = 'mainnet-beta'): Connection {
    if (!SolanaClient.connections.has(network)) {
      const endpoint = this.getEndpoint(network);
      const connection = new Connection(endpoint, 'confirmed');
      SolanaClient.connections.set(network, connection);
    }

    return SolanaClient.connections.get(network)!;
  }

  /**
   * Clear cached connections (useful for switching RPC providers)
   */
  static clearConnections(): void {
    SolanaClient.connections.clear();
  }

  /**
   * Get SOL balance for an address
   */
  static async getBalance(
    address: string,
    network: Cluster = 'mainnet-beta'
  ): Promise<number> {
    const connection = SolanaClient.getConnection(network);
    const publicKey = new (await import('@solana/web3.js')).PublicKey(
      address
    );
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  }
}
