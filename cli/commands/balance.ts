import { Command } from 'commander';
import { formatEther } from 'viem';
import { RpcProvider } from '../../providers/rpc.provider.js';
import { getChain } from '../../config/chains.js';
import Table from 'cli-table3';
import chalk from 'chalk';

/**
 * Command to get balance of an address
 * @example
 * heidr balance 0x123...
 * heidr balance vitalik.eth
 * heidr balance 0x123... --chain arbitrum
 */
export const balanceCommand = new Command('balance')
  .description('Get balance of an address')
  .argument('<address>', 'Address to check balance for')
  .option('-c, --chain <chain>', 'Chain to query (default: mainnet)', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (addressOrEns: string, options: { chain: string; json?: boolean }) => {
    try {
      const chain = getChain(options.chain);
      const rpcUrl = chain.rpcUrls.default.http[0];
      if (!rpcUrl) {
        throw new Error(`No RPC URL available for chain: ${chain.name}`);
      }
      const provider = new RpcProvider(rpcUrl, chain);

      // Resolve ENS name to address if needed (ENS only works on mainnet)
      let address: `0x${string}`;
      if (addressOrEns.endsWith('.eth')) {
        const mainnetChain = getChain('mainnet');
        const mainnetProvider = new RpcProvider(
          mainnetChain.rpcUrls.default.http[0]!,
          mainnetChain
        );
        const resolved = await mainnetProvider.getClient().getEnsAddress({ name: addressOrEns });
        if (!resolved) {
          throw new Error(`Could not resolve ENS name: ${addressOrEns}`);
        }
        address = resolved;
      } else {
        address = addressOrEns as `0x${string}`;
      }

      // Get balance
      const balance = await provider.getBalance(address);

      if (options.json) {
        // JSON output
        console.log(
          JSON.stringify(
            {
              address,
              ...(addressOrEns.endsWith('.eth') && { ens: addressOrEns }),
              chain: chain.name,
              chainId: chain.id,
              balance: balance.toString(),
              balanceFormatted: `${formatEther(balance)} ${chain.nativeCurrency.symbol}`,
            },
            null,
            2
          )
        );
      } else {
        // Table output
        const table = new Table({
          style: { head: ['cyan'] },
          wordWrap: true,
        });

        table.push(
          ...(addressOrEns.endsWith('.eth') ? [[chalk.bold('ENS Name'), addressOrEns]] : []),
          [chalk.bold('Address'), address],
          [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
          [
            chalk.bold('Balance'),
            chalk.green(`${formatEther(balance)} ${chain.nativeCurrency.symbol}`),
          ],
          [chalk.bold('Balance (wei)'), balance.toString()]
        );

        console.log(table.toString());
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      } else {
        console.error(chalk.red('An unknown error occurred'));
      }
      process.exit(1);
    }
  });
