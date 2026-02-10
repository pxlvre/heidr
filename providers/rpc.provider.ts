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

  /**
   * Get fee history for calculating gas price estimates
   * @param blockCount - Number of blocks to analyze
   * @param rewardPercentiles - Percentiles to calculate (e.g., [25, 50, 75])
   * @returns Fee history data
   */
  async getFeeHistory(blockCount: number, rewardPercentiles: number[]) {
    return this.client.getFeeHistory({
      blockCount,
      blockTag: 'latest',
      rewardPercentiles,
    });
  }

  /**
   * Estimate fees per gas for EIP-1559 transactions
   * @returns Estimated max fee and max priority fee per gas
   */
  async estimateFeesPerGas() {
    return this.client.estimateFeesPerGas();
  }

  /**
   * Get block information
   * @param params - Block parameters (blockTag or blockNumber)
   * @returns The block data
   */
  async getBlock(params: { blockTag?: 'latest'; blockNumber?: bigint }) {
    return this.client.getBlock(params);
  }

  /**
   * Get transaction information
   * @param hash - The transaction hash
   * @returns The transaction data
   */
  async getTransaction(hash: `0x${string}`) {
    return this.client.getTransaction({ hash });
  }
}
