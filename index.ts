/**
 * Main entry point for heidr package
 * Exports public API for programmatic use
 */

// Export services for programmatic use
export { BalanceService } from '@/services/rpc/balance.service';
export { BlockService } from '@/services/rpc/block.service';
export { GasService } from '@/services/rpc/gas.service';
export { TransactionService } from '@/services/rpc/transaction.service';

// Export provider
export { RpcProvider } from '@/providers/rpc.provider';

// Export configuration utilities
export { getChain, listChains, getChainInfo, SUPPORTED_CHAINS } from '@/config/chains';

// Export types
export type { Chain } from 'viem';
export type { ChainInfo } from '@/config/chains';
export type { GasPrices } from '@/services/rpc/gas.service';
export type { BalanceResult } from '@/services/rpc/balance.service';

// Export errors
export * from '@/errors';
