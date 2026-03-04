import { DefiLlama } from '@defillama/api';
import { ConfigProvider } from '@/providers/config.provider';

/**
 * Provider wrapping the official @defillama/api SDK client.
 * Reads an optional API key from DEFILLAMA_API_KEY env var or config file key "defillama.apiKey".
 * Without a key the free public tier is used; with a key the pro tier is unlocked.
 */
export class DefiLlamaProvider {
  readonly client: DefiLlama;

  constructor() {
    const config = new ConfigProvider();
    const apiKey = process.env.DEFILLAMA_API_KEY ?? config.get('defillama.apiKey');

    this.client = new DefiLlama({ apiKey });
  }
}
