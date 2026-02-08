import { createPublicClient, http, type PublicClient, type Chain } from 'viem';

/**
 * RPC Provider for interacting with EVM chains
 */
export class RpcProvider {
  private client: PublicClient;

  /**
   * Creates a new RPC provider instance
   * @param rpcUrl - The RPC endpoint URL
   * @param chain - The chain configuration
   */
  constructor(rpcUrl: string, chain: Chain) {
    this.client = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
  }

  /**
   * Get the underlying Viem public client
   * @returns The Viem PublicClient instance
   */
  getClient(): PublicClient {
    return this.client;
  }
}
