import type { RpcProvider } from '@/providers/rpc.provider';
import { ensureHex } from '@/utils/hex';

/**
 * Service for transaction-related operations
 */
export class TransactionService {
  constructor(private provider: RpcProvider) {}

  /**
   * Get transaction information
   * @param hash - Transaction hash
   * @returns Transaction data
   */
  async getTransaction(hash: string) {
    const txHash = ensureHex(hash);
    return this.provider.getTransaction(txHash);
  }
}
