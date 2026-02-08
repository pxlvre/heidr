import { Command } from 'commander';
import { RpcProvider } from '../../providers/rpc.provider.js';
import { getChain } from '../../config/chains.js';
import { formatGwei } from 'viem';

export const gasCommand = new Command('gas')
  .description('Get current gas prices for a chain')
  .option('-c, --chain <name>', 'Chain name or ID', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const chain = getChain(options.chain);
      const rpcUrl = chain.rpcUrls.default.http[0];

      if (!rpcUrl) {
        throw new Error(`No RPC URL available for chain: ${options.chain}`);
      }

      const provider = new RpcProvider(rpcUrl, chain);
      const gasPriceWei = await provider.getGasPrice();
      const gasPriceGwei = formatGwei(gasPriceWei);

      if (options.json) {
        console.log(
          JSON.stringify(
            {
              chain: chain.name,
              chainId: chain.id,
              gasPrice: {
                wei: gasPriceWei.toString(),
                gwei: gasPriceGwei,
              },
            },
            null,
            2
          )
        );
      } else {
        console.log(`\n⛽ Gas Price on ${chain.name}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`${gasPriceGwei} gwei`);
        console.log(`${gasPriceWei} wei\n`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      }
      process.exit(1);
    }
  });
