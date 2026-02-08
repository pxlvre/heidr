import { describe, expect, test } from 'bun:test';
import { RpcProvider } from '../../providers/rpc.provider';
import { mainnet } from 'viem/chains';

describe('RpcProvider', () => {
  test('creates provider with chain and RPC URL', () => {
    const provider = new RpcProvider('https://eth.llamarpc.com', mainnet);
    expect(provider).toBeDefined();
  });

  test('returns viem client', () => {
    const provider = new RpcProvider('https://eth.llamarpc.com', mainnet);
    const client = provider.getClient();
    expect(client).toBeDefined();
    expect(client.chain).toBeDefined();
    expect(client.chain?.id).toBe(1);
  });

  test('client has correct chain configuration', () => {
    const provider = new RpcProvider('https://eth.llamarpc.com', mainnet);
    const client = provider.getClient();
    expect(client.chain?.name).toBe('Ethereum');
    expect(client.chain?.id).toBe(1);
  });
});
