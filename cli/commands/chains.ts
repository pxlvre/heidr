#!/usr/bin/env bun
import { Command } from 'commander';
import Table from 'cli-table3';
import { listChains, getChainInfo } from '../../config/chains.js';
import { prettyPrint, printError, printInfo } from '../../utils/formatter.js';

/**
 * Command to list all supported chains or get info about a specific chain
 * @example
 * heidr chains --list
 * heidr chains --info mainnet
 * heidr chains --list --json
 */
export const chainsCommand = new Command('chains')
  .description('List all supported chains or get info about a specific chain')
  .option('-l, --list', 'List all supported chains')
  .option('-i, --info <chain>', 'Get detailed info about a specific chain')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      if (options.list) {
        const chainNames = listChains();

        if (options.json) {
          // Get full chain info for each chain name
          const chainsInfo = chainNames
            .map((name) => {
              try {
                return getChainInfo(name);
              } catch {
                return null;
              }
            })
            .filter(Boolean);
          prettyPrint(chainsInfo);
        } else {
          const table = new Table({
            head: ['Chain ID', 'Chain Name', 'Native Currency'],
            style: { head: ['cyan'] },
          });

          chainNames.forEach((chainName) => {
            try {
              const chainInfo = getChainInfo(chainName);
              table.push([
                chainInfo.id.toString(),
                chainInfo.name,
                chainInfo.nativeCurrency.symbol,
              ]);
            } catch {
              // Skip chains that fail to load
            }
          });

          console.log(table.toString());
          printInfo(`\nTotal: ${chainNames.length} chains supported`);
        }
      } else if (options.info) {
        const chainInfo = getChainInfo(options.info);

        if (options.json) {
          prettyPrint(chainInfo);
        } else {
          // Pretty table format
          const table = new Table({
            style: { head: ['cyan'] },
          });

          table.push(
            ['Name', chainInfo.name],
            ['Chain ID', chainInfo.id.toString()],
            [
              'Native Currency',
              `${chainInfo.nativeCurrency.name} (${chainInfo.nativeCurrency.symbol}) - ${chainInfo.nativeCurrency.decimals} decimals`,
            ],
            ['RPC URL', chainInfo.rpcUrls?.default.http[0] || 'N/A'],
            ['Block Explorer', chainInfo.blockExplorers?.default.url || 'N/A']
          );

          console.log(table.toString());
        }
      } else {
        printInfo('Use --list to see all supported chains or --info <chain> to get chain details');
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });
