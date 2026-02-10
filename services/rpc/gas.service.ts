import type { RpcProvider } from '@/providers/rpc.provider';

export interface GasPrices {
  low: bigint;
  average: bigint;
  high: bigint;
  baseFee: bigint;
}

/**
 * Service for gas price calculations and analysis
 */
export class GasService {
  constructor(private provider: RpcProvider) {}

  /**
   * Calculate average of bigint array
   * @param values - Array of bigint values
   * @returns Average value
   */
  private calculateAverage(values: bigint[]): bigint {
    if (values.length === 0) return 0n;
    const sum = values.reduce((acc, val) => acc + val, 0n);
    return sum / BigInt(values.length);
  }

  /**
   * Get gas prices with low, average, and high priority estimates
   * @param blockCount - Number of historical blocks to analyze
   * @returns Gas prices for different priority levels
   */
  async getGasPrices(blockCount = 20): Promise<GasPrices> {
    // Get fee history for the specified blocks with percentiles (25th, 50th, 75th)
    const feeHistory = await this.provider.getFeeHistory(blockCount, [25, 50, 75]);

    // Extract current base fee (last entry)
    const baseFee = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1] || 0n;

    // Calculate average priority fees for each percentile
    const lowPriorityFee = this.calculateAverage(feeHistory.reward?.map((r) => r[0] || 0n) || []);
    const avgPriorityFee = this.calculateAverage(feeHistory.reward?.map((r) => r[1] || 0n) || []);
    const highPriorityFee = this.calculateAverage(feeHistory.reward?.map((r) => r[2] || 0n) || []);

    // Return total gas prices (base fee + priority fee)
    return {
      low: baseFee + lowPriorityFee,
      average: baseFee + avgPriorityFee,
      high: baseFee + highPriorityFee,
      baseFee,
    };
  }

  /**
   * Get gas price for a specific priority level
   * @param priority - Priority level (low, average, high)
   * @returns Gas price for the specified priority
   */
  async getGasPriceForPriority(
    priority: 'low' | 'average' | 'high'
  ): Promise<{ gasPrice: bigint; baseFee: bigint }> {
    const prices = await this.getGasPrices();
    return {
      gasPrice: prices[priority],
      baseFee: prices.baseFee,
    };
  }
}
