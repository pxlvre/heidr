#!/usr/bin/env bun
/**
 * Command to get transaction information
 * @example
 * heidr tx 0x123...
 * heidr tx 0x123... --chain arbitrum
 * heidr tx 0x123... --json
 */
import { Command } from 'commander';
import Table from 'cli-table3';
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

      if (options.json) {
        prettyPrint(tx);
      } else {
        // Pretty table format
        const table = new Table({
          style: { head: ['cyan'] },
        });

        table.push(
          ['Hash', tx.hash],
          ['From', tx.from],
          ['To', tx.to || 'Contract Creation'],
          ['Value', `${tx.value.toString()} wei`],
          ['Gas', tx.gas.toString()],
          ['Gas Price', tx.gasPrice?.toString() || 'N/A'],
          ['Nonce', tx.nonce.toString()],
          ['Block Number', tx.blockNumber?.toString() || 'Pending'],
          ['Block Hash', tx.blockHash || 'Pending'],
          ['Transaction Index', tx.transactionIndex?.toString() || 'Pending'],
          ['Type', tx.type]
        );

        console.log(table.toString());
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });
