import { describe, it, expect, spyOn, beforeEach, afterEach } from 'bun:test';
import {
  printBytecodeTable,
  printBytecodeJson,
  printNonceTable,
  printNonceJson,
  printStorageTable,
  printStorageJson,
  printCallTable,
  printCallJson,
  printEstimateTable,
  printEstimateJson,
  printLogsTable,
  printLogsJson,
  printChainIdTable,
  printChainIdJson,
  printReceiptTable,
  printReceiptJson,
  printProofTable,
  printProofJson,
} from '@/cli/printers/rpc.printer';
import { printTokenBalanceTable, printTokenBalanceJson } from '@/cli/printers/balance.printer';
import { RpcService } from '@/services/rpc/rpc.service';
import type { TokenBalanceResult } from '@/services/rpc/balance.service';
import type { Chain, Log, TransactionReceipt } from 'viem';
import { mainnet } from 'viem/chains';

// ── Mock data ──────────────────────────────────────────────────────────────

const mockChain: Chain = mainnet;

const mockAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as `0x${string}`;
const mockBytecode =
  '0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea2646970667358221220' as `0x${string}`;
const mockSlot =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
const mockStorageValue =
  '0x0000000000000000000000000000000000000000000000000000000000000001' as `0x${string}`;
const mockTxHash =
  '0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1' as `0x${string}`;

const mockLog: Log = {
  address: mockAddress,
  topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' as `0x${string}`],
  data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000' as `0x${string}`,
  blockNumber: BigInt(18000000),
  transactionHash: mockTxHash,
  transactionIndex: 0,
  blockHash: '0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1' as `0x${string}`,
  logIndex: 0,
  removed: false,
};

const mockReceipt: TransactionReceipt = {
  transactionHash: mockTxHash,
  transactionIndex: 0,
  blockHash: '0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1' as `0x${string}`,
  blockNumber: BigInt(18000000),
  from: mockAddress,
  to: mockAddress,
  cumulativeGasUsed: BigInt(100000),
  gasUsed: BigInt(21000),
  effectiveGasPrice: BigInt(20000000000),
  contractAddress: null,
  logs: [],
  logsBloom: '0x0' as `0x${string}`,
  status: 'success',
  type: 'eip1559',
};

const mockProof = {
  address: mockAddress,
  nonce: BigInt(42),
  balance: BigInt(1000000000000000000n),
  storageHash:
    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as `0x${string}`,
  codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as `0x${string}`,
  accountProof: ['0xabc', '0xdef'],
  storageProof: [],
};

const mockTokenBalanceResult: TokenBalanceResult = {
  address: mockAddress,
  tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
  tokenName: 'USD Coin',
  tokenSymbol: 'USDC',
  tokenDecimals: 6,
  rawBalance: BigInt(1000000),
  formattedBalance: '1.0',
};

// ── Printer unit tests (no API calls) ─────────────────────────────────────

describe('RPC Printers', () => {
  let spy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    spy = spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('printBytecodeTable — does not throw', () => {
    expect(() => printBytecodeTable(mockAddress, mockBytecode, mockChain)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printBytecodeJson — valid JSON', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printBytecodeJson(mockAddress, mockBytecode, mockChain);
    const data = JSON.parse(logs.join('\n'));
    expect(data.address).toBe(mockAddress);
    expect(data.chainId).toBe(1);
  });

  it('printNonceTable — does not throw', () => {
    expect(() => printNonceTable(mockAddress, 42, mockChain)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printNonceJson — valid JSON', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printNonceJson(mockAddress, 42, mockChain);
    const data = JSON.parse(logs.join('\n'));
    expect(data.nonce).toBe(42);
  });

  it('printStorageTable — does not throw', () => {
    expect(() =>
      printStorageTable(mockAddress, mockSlot, mockStorageValue, mockChain)
    ).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printStorageJson — valid JSON', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printStorageJson(mockAddress, mockSlot, mockStorageValue, mockChain);
    const data = JSON.parse(logs.join('\n'));
    expect(data.slot).toBe(mockSlot);
    expect(data.value).toBe(mockStorageValue);
  });

  it('printCallTable — does not throw', () => {
    expect(() => printCallTable(mockAddress, '0x', { data: '0x01' }, mockChain)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printCallJson — valid JSON', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printCallJson(mockAddress, '0x', { data: '0x01' }, mockChain);
    const data = JSON.parse(logs.join('\n'));
    expect(data.to).toBe(mockAddress);
  });

  it('printEstimateTable — does not throw', () => {
    expect(() => printEstimateTable(BigInt(21000), mockChain)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printEstimateJson — valid JSON with string gas', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printEstimateJson(BigInt(21000), mockChain);
    const data = JSON.parse(logs.join('\n'));
    expect(data.estimatedGas).toBe('21000');
  });

  it('printLogsTable — empty logs', () => {
    expect(() => printLogsTable([], mockChain)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printLogsTable — with logs', () => {
    expect(() => printLogsTable([mockLog], mockChain)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printLogsJson — valid JSON', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printLogsJson([mockLog], mockChain);
    const data = JSON.parse(logs.join('\n'));
    expect(data.count).toBe(1);
    expect(data.logs[0].address).toBe(mockAddress);
  });

  it('printChainIdTable — does not throw', () => {
    expect(() => printChainIdTable(1, 'Ethereum')).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printChainIdJson — valid JSON', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printChainIdJson(1, 'Ethereum');
    const data = JSON.parse(logs.join('\n'));
    expect(data.chainId).toBe(1);
  });

  it('printReceiptTable — does not throw', () => {
    expect(() => printReceiptTable(mockReceipt, mockChain)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printReceiptJson — valid JSON', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printReceiptJson(mockReceipt, mockChain);
    const data = JSON.parse(logs.join('\n'));
    expect(data.transactionHash).toBe(mockTxHash);
    expect(data.status).toBe('success');
  });

  it('printProofTable — does not throw', () => {
    expect(() => printProofTable(mockProof, mockChain)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printProofJson — valid JSON', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printProofJson(mockProof, mockChain);
    const data = JSON.parse(logs.join('\n'));
    expect(data.address).toBe(mockAddress);
    expect(data.accountProofLength).toBe(2);
  });

  it('printTokenBalanceTable — does not throw', () => {
    expect(() => printTokenBalanceTable(mockTokenBalanceResult, mockChain)).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('printTokenBalanceJson — valid JSON', () => {
    const logs: string[] = [];
    spy.mockImplementation((...args: unknown[]) => logs.push(args.map(String).join(' ')));
    printTokenBalanceJson(mockTokenBalanceResult, mockChain);
    const data = JSON.parse(logs.join('\n'));
    expect(data.tokenSymbol).toBe('USDC');
    expect(data.tokenDecimals).toBe(6);
  });
});

// ── Service unit tests (no API calls) ─────────────────────────────────────

describe('RpcService', () => {
  it('should expose all methods', () => {
    const mockProvider = {
      getBytecode: async () => undefined,
      getTransactionCount: async () => 0,
      getStorageAt: async () => undefined,
      call: async () => ({ data: '0x' }),
      estimateGas: async () => BigInt(21000),
      getLogs: async () => [],
      getChainId: async () => 1,
      getTransactionReceipt: async () => mockReceipt,
      getProof: async () => mockProof,
      readContract: async () => undefined,
    } as unknown as import('@/providers/rpc.provider').RpcProvider;

    const service = new RpcService(mockProvider);
    expect(typeof service.getBytecode).toBe('function');
    expect(typeof service.getNonce).toBe('function');
    expect(typeof service.getStorageAt).toBe('function');
    expect(typeof service.call).toBe('function');
    expect(typeof service.estimateGas).toBe('function');
    expect(typeof service.getLogs).toBe('function');
    expect(typeof service.getChainId).toBe('function');
    expect(typeof service.getTransactionReceipt).toBe('function');
    expect(typeof service.getProof).toBe('function');
  });
});
