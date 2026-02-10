import { Command } from 'commander';
import { ConfigProvider } from '@/providers/config.provider';
import { prompt } from '@/utils/prompt';
import chalk from 'chalk';
import Table from 'cli-table3';

// Etherscan setup command
const etherscanCommand = new Command('etherscan')
  .description('Configure Etherscan API')
  .action(async () => {
    try {
      console.log(chalk.cyan('\n🔧 Etherscan API Configuration\n'));
      console.log('Get your API key from: https://etherscan.io/myapikey\n');

      const apiKey = await prompt('Enter your Etherscan API key: ', true);

      if (!apiKey || apiKey.trim() === '') {
        console.log(chalk.yellow('No API key provided. Configuration cancelled.'));
        return;
      }

      const config = new ConfigProvider();
      config.set('etherscan.apiKey', apiKey.trim());

      console.log(chalk.green('\n✓ Etherscan API key saved successfully!'));
      console.log(chalk.gray(`Config file: ${config.getConfigPath()}\n`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

// Dune setup command
const duneCommand = new Command('dune')
  .description('Configure Dune Analytics API')
  .action(async () => {
    try {
      console.log(chalk.cyan('\n🔧 Dune Analytics API Configuration\n'));
      console.log('Get your API key from: https://dune.com/settings/api\n');

      const apiKey = await prompt('Enter your Dune API key: ', true);

      if (!apiKey || apiKey.trim() === '') {
        console.log(chalk.yellow('No API key provided. Configuration cancelled.'));
        return;
      }

      const config = new ConfigProvider();
      config.set('dune.apiKey', apiKey.trim());

      console.log(chalk.green('\n✓ Dune API key saved successfully!'));
      console.log(chalk.gray(`Config file: ${config.getConfigPath()}\n`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

// Tenderly setup command
const tenderlyCommand = new Command('tenderly')
  .description('Configure Tenderly API')
  .action(async () => {
    try {
      console.log(chalk.cyan('\n🔧 Tenderly API Configuration\n'));
      console.log(
        'Get your credentials from: https://dashboard.tenderly.co/account/authorization\n'
      );

      const apiKey = await prompt('Enter your Tenderly API key: ', true);

      if (!apiKey || apiKey.trim() === '') {
        console.log(chalk.yellow('No API key provided. Configuration cancelled.'));
        return;
      }

      const account = await prompt('Enter your Tenderly account name: ', false);

      if (!account || account.trim() === '') {
        console.log(chalk.yellow('No account name provided. Configuration cancelled.'));
        return;
      }

      const project = await prompt('Enter your Tenderly project name: ', false);

      if (!project || project.trim() === '') {
        console.log(chalk.yellow('No project name provided. Configuration cancelled.'));
        return;
      }

      const config = new ConfigProvider();
      config.set('tenderly.apiKey', apiKey.trim());
      config.set('tenderly.account', account.trim());
      config.set('tenderly.project', project.trim());

      console.log(chalk.green('\n✓ Tenderly configuration saved successfully!'));
      console.log(chalk.gray(`  - API key: saved`));
      console.log(chalk.gray(`  - Account: ${account.trim()}`));
      console.log(chalk.gray(`  - Project: ${project.trim()}`));
      console.log(chalk.gray(`\nConfig file: ${config.getConfigPath()}\n`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

// Set subcommand - set a config value
const setCommand = new Command('set')
  .description('Set a configuration value')
  .argument('<key>', 'Configuration key (e.g., dune.apiKey)')
  .argument('<value>', 'Configuration value')
  .action((key: string, value: string) => {
    try {
      const config = new ConfigProvider();
      config.set(key, value);
      console.log(chalk.green(`✓ Configuration saved: ${key}`));
      console.log(chalk.gray(`Config file: ${config.getConfigPath()}`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

// Get subcommand - get a config value
const getCommand = new Command('get')
  .description('Get a configuration value')
  .argument('<key>', 'Configuration key (e.g., dune.apiKey)')
  .action((key: string) => {
    try {
      const config = new ConfigProvider();
      const value = config.get(key);

      if (value === undefined) {
        console.log(chalk.yellow(`Configuration key not set: ${key}`));
        console.log(chalk.gray(`Run "heidr config set ${key} <value>" to configure it`));
      } else {
        // Mask API keys for security
        const displayValue =
          key.toLowerCase().includes('key') || key.toLowerCase().includes('secret')
            ? maskValue(value)
            : value;
        console.log(`${chalk.cyan(key)}: ${displayValue}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

// Remove subcommand - remove a config value
const removeCommand = new Command('remove')
  .description('Remove a configuration value')
  .argument('<key>', 'Configuration key (e.g., dune.apiKey)')
  .alias('rm')
  .action((key: string) => {
    try {
      const config = new ConfigProvider();
      config.remove(key);
      console.log(chalk.green(`✓ Configuration removed: ${key}`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

// List subcommand - list all config values
const listCommand = new Command('list')
  .description('List all configuration values')
  .alias('ls')
  .option('-s, --show-secrets', 'Show full API keys (default: masked)')
  .action((options) => {
    try {
      const config = new ConfigProvider();
      const allConfig = config.getAll();

      if (Object.keys(allConfig).length === 0) {
        console.log(chalk.yellow('No configuration set.'));
        console.log(
          chalk.gray('Run "heidr config <service>" to configure a service interactively')
        );
        console.log(chalk.gray('Or "heidr config set <key> <value>" to set values manually'));
        return;
      }

      const table = new Table({
        head: [chalk.cyan('Key'), chalk.cyan('Value')],
        colWidths: [30, 50],
      });

      // Flatten nested config
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const flattenConfig = (obj: any, prefix = ''): void => {
        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            flattenConfig(value, fullKey);
          } else if (value !== undefined) {
            const displayValue =
              options.showSecrets ||
              !(fullKey.toLowerCase().includes('key') || fullKey.toLowerCase().includes('secret'))
                ? String(value)
                : maskValue(String(value));
            table.push([fullKey, displayValue]);
          }
        }
      };

      flattenConfig(allConfig);

      console.log(chalk.bold('\n⚙️  Configuration\n'));
      console.log(table.toString());
      console.log(chalk.gray(`\nConfig file: ${config.getConfigPath()}`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

// Path subcommand - show config file path
const pathCommand = new Command('path').description('Show configuration file path').action(() => {
  try {
    const config = new ConfigProvider();
    console.log(config.getConfigPath());
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
    process.exit(1);
  }
});

/**
 * Mask sensitive values
 */
function maskValue(value: string): string {
  if (value.length <= 8) {
    return '****';
  }
  return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
}

// Main config command
export const configCommand = new Command('config')
  .description('Manage heidr configuration')
  .addCommand(etherscanCommand)
  .addCommand(duneCommand)
  .addCommand(tenderlyCommand)
  .addCommand(setCommand)
  .addCommand(getCommand)
  .addCommand(removeCommand)
  .addCommand(listCommand)
  .addCommand(pathCommand)
  .addHelpText(
    'after',
    `
Examples:
  Interactive setup (recommended):
    $ heidr config etherscan    Configure Etherscan API (prompts for key)
    $ heidr config dune         Configure Dune Analytics API
    $ heidr config tenderly     Configure Tenderly API (key, account, project)

  Manual configuration:
    $ heidr config set dune.apiKey YOUR_API_KEY
    $ heidr config get dune.apiKey
    $ heidr config list
    $ heidr config remove dune.apiKey
    $ heidr config path

Common Configuration Keys:
  dune.apiKey              - Dune Analytics API key
  etherscan.apiKey         - Etherscan API key
  tenderly.apiKey          - Tenderly API key
  tenderly.account         - Tenderly account name
  tenderly.project         - Tenderly project name
`
  );
