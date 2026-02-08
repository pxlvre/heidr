import { createPublicClient, http, type PublicClient, type Chain } from 'viem';

/**
 * RPC Provider for interacting with EVM chains
 */
export class RpcProvider {
  private client: PublicClient;

  constructor(rpcUrl: string, chain: Chain) {
    this.client = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
  }

  /**
   * Get the underlying Viem public client
   */
  getClient(): PublicClient {
    return this.client;
  }
}
