import type { RpcProvider } from '@/providers/rpc.provider';

/**
 * Service for block-related operations
 */
export class BlockService {
  constructor(private provider: RpcProvider) {}

  /**
   * Get block information
   * @param blockIdentifier - Block number or "latest"
   * @returns Block data
   */
  async getBlock(blockIdentifier: string) {
    const isLatest = blockIdentifier === 'latest';

    return this.provider.getBlock({
      blockTag: isLatest ? 'latest' : undefined,
      blockNumber: !isLatest ? BigInt(blockIdentifier) : undefined,
    });
  }
}
