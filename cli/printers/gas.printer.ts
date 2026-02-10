import Table from 'cli-table3';
import chalk from 'chalk';
import { formatGwei } from '@/utils/formatter';
import type { GasPrices } from '@/services/rpc/gas.service';

/**
 * Print all gas price priorities in a table
 * @param gasPrices - Gas prices for all priority levels
 * @param chainName - Name of the chain
 */
export const printGasPricesTable = (gasPrices: GasPrices, chainName: string): void => {
  const table = new Table({
    head: [chalk.cyan('Priority'), chalk.cyan('Gas Price (Gwei)'), chalk.cyan('Gas Price (Wei)')],
    style: { head: ['cyan'] },
  });

  table.push(
    [chalk.green('Low'), formatGwei(gasPrices.low), gasPrices.low.toString()],
    [chalk.yellow('Average'), formatGwei(gasPrices.average), gasPrices.average.toString()],
    [chalk.red('High'), formatGwei(gasPrices.high), gasPrices.high.toString()]
  );

  console.log(`\n⛽ Gas Prices on ${chainName}`);
  console.log(chalk.gray(`Base Fee: ${formatGwei(gasPrices.baseFee)} gwei`));
  console.log(table.toString());
};

/**
 * Print a single gas price for a specific priority
 * @param gasPrice - Gas price in wei
 * @param priority - Priority level
 * @param chainName - Name of the chain
 */
export const printSingleGasPrice = (
  gasPrice: bigint,
  priority: string,
  chainName: string
): void => {
  console.log(`\n⛽ Gas Price on ${chainName} (${priority})`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(chalk.green(`${formatGwei(gasPrice)} gwei`));
  console.log(chalk.gray(`${gasPrice} wei\n`));
};

/**
 * Print all gas prices as JSON
 * @param gasPrices - Gas prices for all priority levels
 * @param chainName - Name of the chain
 * @param chainId - Chain ID
 */
export const printGasPricesJson = (
  gasPrices: GasPrices,
  chainName: string,
  chainId: number
): void => {
  const output = {
    chain: chainName,
    chainId,
    baseFee: {
      wei: gasPrices.baseFee.toString(),
      gwei: formatGwei(gasPrices.baseFee),
    },
    gasPrices: {
      low: {
        wei: gasPrices.low.toString(),
        gwei: formatGwei(gasPrices.low),
      },
      average: {
        wei: gasPrices.average.toString(),
        gwei: formatGwei(gasPrices.average),
      },
      high: {
        wei: gasPrices.high.toString(),
        gwei: formatGwei(gasPrices.high),
      },
    },
  };

  console.log(JSON.stringify(output, null, 2));
};

/**
 * Print a single gas price as JSON
 * @param gasPrice - Gas price in wei
 * @param baseFee - Base fee in wei
 * @param priority - Priority level
 * @param chainName - Name of the chain
 * @param chainId - Chain ID
 */
export const printSingleGasPriceJson = (
  gasPrice: bigint,
  baseFee: bigint,
  priority: string,
  chainName: string,
  chainId: number
): void => {
  const output = {
    chain: chainName,
    chainId,
    priority,
    gasPrice: {
      wei: gasPrice.toString(),
      gwei: formatGwei(gasPrice),
    },
    baseFee: {
      wei: baseFee.toString(),
      gwei: formatGwei(baseFee),
    },
  };

  console.log(JSON.stringify(output, null, 2));
};
