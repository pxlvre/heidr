/**
 * Main entry point for heidr package
 * Exports public API for programmatic use
 */

// Export RPC services
export { BalanceService } from '@/services/rpc/balance.service';
export { BlockService } from '@/services/rpc/block.service';
export { GasService } from '@/services/rpc/gas.service';
export { TransactionService } from '@/services/rpc/transaction.service';

// Export opcode service
export { OpcodeService } from '@/services/opcode.service';

// Export providers
export { RpcProvider } from '@/providers/rpc.provider';
export { HttpProvider } from '@/providers/http.provider';
export { ConfigProvider } from '@/providers/config.provider';

// Export configuration utilities
export { getChain, listChains, getChainInfo, SUPPORTED_CHAINS } from '@/config/chains';

// Export types
export type { Chain } from 'viem';
export type { ChainInfo } from '@/config/chains';
export type { GasPrices } from '@/services/rpc/gas.service';
export type { BalanceResult } from '@/services/rpc/balance.service';
export type { Opcode } from '@/services/opcode.service';
export type { HttpMethod, HttpRequestOptions, HttpResponse } from '@/providers/http.provider';

// Export errors
export * from '@/errors';
