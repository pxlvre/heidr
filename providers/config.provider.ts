import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

/**
 * Configuration data structure
 */
interface ConfigData {
  dune?: {
    apiKey?: string;
  };
  etherscan?: {
    apiKey?: string;
  };
  tenderly?: {
    apiKey?: string;
    account?: string;
    project?: string;
  };
  l2beat?: Record<string, never>;
}

/**
 * Configuration provider for managing API keys and secrets
 * Stores configuration in user's home directory following XDG Base Directory specification
 */
export class ConfigProvider {
  private config: ConfigData;
  private configDir: string;
  private configFile: string;

  constructor() {
    this.configDir = this.getConfigDir();
    this.configFile = join(this.configDir, 'config.json');
    this.config = this.loadConfig();
  }

  /**
   * Get the configuration directory path
   * - Linux/macOS: ~/.config/heidr/
   * - Windows: %APPDATA%/heidr/
   */
  private getConfigDir(): string {
    const home = homedir();

    // Check if XDG_CONFIG_HOME is set (Linux/Unix standard)
    if (process.env.XDG_CONFIG_HOME) {
      return join(process.env.XDG_CONFIG_HOME, 'heidr');
    }

    // Windows uses APPDATA
    if (process.platform === 'win32' && process.env.APPDATA) {
      return join(process.env.APPDATA, 'heidr');
    }

    // Default to ~/.config/heidr on Unix-like systems
    return join(home, '.config', 'heidr');
  }

  /**
   * Load configuration from file
   */
  private loadConfig(): ConfigData {
    try {
      // Ensure config directory exists
      if (!existsSync(this.configDir)) {
        mkdirSync(this.configDir, { recursive: true });
      }

      // Load existing config or create empty one
      if (existsSync(this.configFile)) {
        const data = readFileSync(this.configFile, 'utf-8');
        return JSON.parse(data);
      }

      return {};
    } catch {
      console.warn(`Warning: Could not load config from ${this.configFile}`);
      return {};
    }
  }

  /**
   * Save configuration to file
   */
  private saveConfig(): void {
    try {
      // Ensure directory exists
      if (!existsSync(this.configDir)) {
        mkdirSync(this.configDir, { recursive: true });
      }

      // Write config file
      writeFileSync(this.configFile, JSON.stringify(this.config, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save config to ${this.configFile}: ${error}`);
    }
  }

  /**
   * Get a nested configuration value using dot notation
   * @param key - Configuration key in dot notation (e.g., 'dune.apiKey')
   */
  get(key: string): string | undefined {
    const parts = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = this.config;

    for (const part of parts) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[part];
    }

    return value;
  }

  /**
   * Get a required configuration value
   * @param key - Configuration key
   * @throws Error if key is not found
   */
  getRequired(key: string): string {
    const value = this.get(key);
    if (!value) {
      throw new Error(
        `Required configuration key not found: ${key}\n` +
          `Run "heidr config set ${key} <value>" to configure it.`
      );
    }
    return value;
  }

  /**
   * Check if a configuration key exists
   * @param key - Configuration key
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Set a configuration value using dot notation
   * @param key - Configuration key in dot notation (e.g., 'dune.apiKey')
   * @param value - Configuration value
   */
  set(key: string, value: string): void {
    const parts = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = this.config;

    // Navigate/create nested structure
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    // Set the final value
    current[parts[parts.length - 1]] = value;

    // Save to disk
    this.saveConfig();
  }

  /**
   * Remove a configuration value
   * @param key - Configuration key in dot notation
   */
  remove(key: string): void {
    const parts = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = this.config;

    // Navigate to parent
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) {
        return; // Key doesn't exist, nothing to remove
      }
      current = current[parts[i]];
    }

    // Delete the key
    delete current[parts[parts.length - 1]];

    // Save to disk
    this.saveConfig();
  }

  /**
   * Get all configuration
   */
  getAll(): ConfigData {
    return { ...this.config };
  }

  /**
   * Get the configuration file path
   */
  getConfigPath(): string {
    return this.configFile;
  }

  /**
   * Get Dune API key
   */
  getDuneApiKey(): string | undefined {
    return this.get('dune.apiKey');
  }

  /**
   * Get Etherscan API key
   */
  getEtherscanApiKey(): string | undefined {
    return this.get('etherscan.apiKey');
  }

  /**
   * Get Tenderly API key
   */
  getTenderlyApiKey(): string | undefined {
    return this.get('tenderly.apiKey');
  }

  /**
   * Get Tenderly account
   */
  getTenderlyAccount(): string | undefined {
    return this.get('tenderly.account');
  }

  /**
   * Get Tenderly project
   */
  getTenderlyProject(): string | undefined {
    return this.get('tenderly.project');
  }
}
