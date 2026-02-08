import chalk from 'chalk';

/**
 * Pretty prints JSON with syntax highlighting
 * @param data - Data to print
 * @param options - Formatting options
 */
export const prettyPrint = (
  data: unknown,
  options?: { indent?: number; colors?: boolean }
): void => {
  const indent = options?.indent ?? 2;
  const useColors = options?.colors ?? true;

  const json = JSON.stringify(
    data,
    (_, value) => (typeof value === 'bigint' ? value.toString() : value),
    indent
  );

  if (!useColors) {
    console.log(json);
    return;
  }

  // Syntax highlighting
  const highlighted = json
    .replace(/"([^"]+)":/g, (match, key) => `${chalk.cyan(`"${key}"`)}:`)
    .replace(/: "([^"]+)"/g, (match, value) => `: ${chalk.green(`"${value}"`)}`)
    .replace(/: (\d+)/g, (match, num) => `: ${chalk.yellow(num)}`)
    .replace(/: (true|false)/g, (match, bool) => `: ${chalk.magenta(bool)}`)
    .replace(/: null/g, `: ${chalk.gray('null')}`);

  console.log(highlighted);
};

/**
 * Prints an error message
 * @param message - Error message
 */
export const printError = (message: string): void => {
  console.error(chalk.red('✖'), chalk.red(message));
};

/**
 * Prints a success message
 * @param message - Success message
 */
export const printSuccess = (message: string): void => {
  console.log(chalk.green('✔'), message);
};

/**
 * Prints a warning message
 * @param message - Warning message
 */
export const printWarning = (message: string): void => {
  console.warn(chalk.yellow('⚠'), message);
};

/**
 * Prints an info message
 * @param message - Info message
 */
export const printInfo = (message: string): void => {
  console.log(chalk.blue('ℹ'), message);
};
