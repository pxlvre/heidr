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

  /**
   * Get balance of an address
   * @param address - The address to check balance for
   * @returns The balance in wei
   */
  async getBalance(address: `0x${string}`): Promise<bigint> {
    return this.client.getBalance({ address });
  }

  /**
   * Get current gas price
   * @returns The gas price in wei
   */
  async getGasPrice(): Promise<bigint> {
    return this.client.getGasPrice();
  }
}
