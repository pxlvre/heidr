import type { RpcProvider } from '@/providers/rpc.provider';
import { getChain } from '@/config/chains';

export interface BalanceResult {
  address: `0x${string}`;
  balance: bigint;
  ensName?: string;
}

/**
 * Service for balance-related operations
 */
export class BalanceService {
  constructor(private provider: RpcProvider) {}

  /**
   * Resolve ENS name to address
   * @param ensName - ENS name to resolve
   * @returns Resolved address
   */
  private async resolveEnsName(ensName: string): Promise<`0x${string}`> {
    const mainnetChain = getChain('mainnet');
    const mainnetProvider = new (await import('@/providers/rpc.provider')).RpcProvider(
      mainnetChain.rpcUrls.default.http[0]!,
      mainnetChain
    );

    const resolved = await mainnetProvider.getClient().getEnsAddress({ name: ensName });
    if (!resolved) {
      throw new Error(`Could not resolve ENS name: ${ensName}`);
    }

    return resolved;
  }

  /**
   * Get balance for an address or ENS name
   * @param addressOrEns - Address or ENS name
   * @returns Balance result with address and balance
   */
  async getBalance(addressOrEns: string): Promise<BalanceResult> {
    let address: `0x${string}`;
    let ensName: string | undefined;

    // Check if it's an ENS name
    if (addressOrEns.endsWith('.eth')) {
      address = await this.resolveEnsName(addressOrEns);
      ensName = addressOrEns;
    } else {
      address = addressOrEns as `0x${string}`;
    }

    // Get balance
    const balance = await this.provider.getBalance(address);

    return {
      address,
      balance,
      ensName,
    };
  }
}
