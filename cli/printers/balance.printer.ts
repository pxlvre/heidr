import Table from 'cli-table3';
import chalk from 'chalk';
import { formatEther } from '@/utils/formatter';
import type { BalanceResult, TokenBalanceResult } from '@/services/rpc/balance.service';
import type { Chain } from 'viem';

/**
 * Print balance in table format
 * @param result - Balance result
 * @param chain - Chain information
 */
export const printBalanceTable = (result: BalanceResult, chain: Chain): void => {
  const table = new Table({
    style: { head: ['cyan'] },
    wordWrap: true,
  });

  table.push(
    ...(result.ensName ? [[chalk.bold('ENS Name'), result.ensName]] : []),
    [chalk.bold('Address'), result.address],
    [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
    [
      chalk.bold('Balance'),
      chalk.green(`${formatEther(result.balance)} ${chain.nativeCurrency.symbol}`),
    ],
    [chalk.bold('Balance (wei)'), result.balance.toString()]
  );

  console.log(table.toString());
};

/**
 * Print balance in JSON format
 * @param result - Balance result
 * @param chain - Chain information
 */
export const printBalanceJson = (result: BalanceResult, chain: Chain): void => {
  const output = {
    address: result.address,
    ...(result.ensName && { ens: result.ensName }),
    chain: chain.name,
    chainId: chain.id,
    balance: result.balance.toString(),
    balanceFormatted: `${formatEther(result.balance)} ${chain.nativeCurrency.symbol}`,
  };

  console.log(JSON.stringify(output, null, 2));
};

export const printTokenBalanceTable = (result: TokenBalanceResult, chain: Chain): void => {
  const table = new Table({
    style: { head: ['cyan'] },
    wordWrap: true,
  });

  table.push(
    [chalk.bold('Wallet'), result.address],
    [chalk.bold('Token'), `${result.tokenName} (${result.tokenSymbol})`],
    [chalk.bold('Token Address'), result.tokenAddress],
    [chalk.bold('Chain'), `${chain.name} (${chain.id})`],
    [chalk.bold('Balance'), chalk.green(`${result.formattedBalance} ${result.tokenSymbol}`)],
    [chalk.bold('Raw Balance'), result.rawBalance.toString()],
    [chalk.bold('Decimals'), result.tokenDecimals.toString()]
  );

  console.log(table.toString());
};

export const printTokenBalanceJson = (result: TokenBalanceResult, chain: Chain): void => {
  const output = {
    address: result.address,
    tokenAddress: result.tokenAddress,
    tokenName: result.tokenName,
    tokenSymbol: result.tokenSymbol,
    tokenDecimals: result.tokenDecimals,
    chain: chain.name,
    chainId: chain.id,
    balance: result.rawBalance.toString(),
    balanceFormatted: `${result.formattedBalance} ${result.tokenSymbol}`,
  };

  console.log(JSON.stringify(output, null, 2));
};
