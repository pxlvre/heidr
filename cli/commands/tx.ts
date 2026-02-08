#!/usr/bin/env bun
/**
 * Command to get transaction information
 * @example
 * heidr tx 0x123...
 * heidr tx 0x123... --chain arbitrum
 * heidr tx 0x123... --json
 */
import { Command } from 'commander';
import { createPublicClient, http } from 'viem';
import { getChain } from '../../config/chains.js';
import { prettyPrint, printError } from '../../utils/formatter.js';
import { ensureHex } from '../../utils/hex.js';

export const txCommand = new Command('tx')
  .description('Get transaction information')
  .argument('<hash>', 'Transaction hash')
  .option('-c, --chain <chain>', 'Chain name or ID', 'mainnet')
  .option('--json', 'Output as JSON')
  .action(async (hash: string, options) => {
    try {
      const chain = getChain(options.chain);

      const client = createPublicClient({
        chain,
        transport: http(),
      });

      const txHash = ensureHex(hash);
      const tx = await client.getTransaction({ hash: txHash });

      prettyPrint(tx);
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });
