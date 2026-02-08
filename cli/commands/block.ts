#!/usr/bin/env bun
/**
 * Command to get block information
 * @example
 * heidr block latest
 * heidr block latest --chain arbitrum
 * heidr block 12345 --chain polygon
 */
import { Command } from 'commander';
import Table from 'cli-table3';
import { createPublicClient, http } from 'viem';
import { getChain } from '../../config/chains.js';
import { prettyPrint, printError } from '../../utils/formatter.js';

export const blockCommand = new Command('block')
  .description('Get block information')
  .argument('[block]', 'Block number or "latest"', 'latest')
  .option('-c, --chain <chain>', 'Chain name or ID', 'mainnet')
  .option('--json', 'Output as JSON')
  .action(async (blockArg: string, options) => {
    try {
      const chain = getChain(options.chain);

      const client = createPublicClient({
        chain,
        transport: http(),
      });

      const block = await client.getBlock({
        blockTag: blockArg === 'latest' ? 'latest' : undefined,
        blockNumber: blockArg !== 'latest' ? BigInt(blockArg) : undefined,
      });

      if (options.json) {
        prettyPrint(block);
      } else {
        // Pretty table format
        const table = new Table({
          style: { head: ['cyan'] },
        });

        table.push(
          ['Block Number', block.number?.toString() || 'N/A'],
          ['Block Hash', block.hash || 'N/A'],
          ['Timestamp', new Date(Number(block.timestamp) * 1000).toISOString()],
          ['Transactions', block.transactions.length.toString()],
          ['Gas Used', block.gasUsed.toString()],
          ['Gas Limit', block.gasLimit.toString()],
          ['Base Fee Per Gas', block.baseFeePerGas?.toString() || 'N/A'],
          ['Miner', block.miner]
        );

        console.log(table.toString());
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });
