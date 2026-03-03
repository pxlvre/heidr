import type { RpcProvider } from '@/providers/rpc.provider';

export class RpcService {
  constructor(private provider: RpcProvider) {}

  async getBytecode(address: `0x${string}`) {
    return this.provider.getBytecode(address);
  }

  async getNonce(address: `0x${string}`, blockTag: 'latest' | 'pending' = 'latest') {
    return this.provider.getTransactionCount(address, blockTag);
  }

  async getStorageAt(address: `0x${string}`, slot: `0x${string}`) {
    return this.provider.getStorageAt(address, slot);
  }

  async call(to: `0x${string}`, data: `0x${string}`) {
    return this.provider.call(to, data);
  }

  async estimateGas(params: { to?: `0x${string}`; data?: `0x${string}`; value?: bigint }) {
    return this.provider.estimateGas(params);
  }

  async getLogs(params: { address?: `0x${string}`; fromBlock?: bigint; toBlock?: bigint }) {
    return this.provider.getLogs(params);
  }

  async getChainId() {
    return this.provider.getChainId();
  }

  async getTransactionReceipt(hash: `0x${string}`) {
    return this.provider.getTransactionReceipt(hash);
  }

  async getProof(address: `0x${string}`, storageKeys: `0x${string}`[] = []) {
    return this.provider.getProof(address, storageKeys);
  }
}
