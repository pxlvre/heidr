import opcodes from '@/data/opcodes.json';

export interface Opcode {
  name: string;
  minGas: number;
  input: string;
  output: string;
  description: string;
}

export interface OpcodeWithHex extends Opcode {
  hex: string;
}

/**
 * Service for EVM opcode lookups and information
 */
export class OpcodeService {
  private opcodes: Record<string, Opcode>;
  private opcodesByName: Record<string, { hex: string; data: Opcode }>;

  constructor() {
    this.opcodes = opcodes as Record<string, Opcode>;

    // Build reverse lookup by name
    this.opcodesByName = {};
    for (const [hex, data] of Object.entries(this.opcodes)) {
      this.opcodesByName[data.name.toUpperCase()] = { hex, data };
    }
  }

  /**
   * Get all opcodes
   * @returns All opcodes with their hex values
   */
  getAllOpcodes(): OpcodeWithHex[] {
    return Object.entries(this.opcodes).map(([hex, data]) => ({
      hex,
      ...data,
    }));
  }

  /**
   * Get opcode by hex value
   * @param hex - Hex value (e.g., "00", "01", "0x00")
   * @returns Opcode data with hex
   */
  getOpcodeByHex(hex: string): OpcodeWithHex | null {
    // Normalize hex (remove 0x prefix and ensure lowercase)
    const normalizedHex = hex.toLowerCase().replace(/^0x/, '');
    const data = this.opcodes[normalizedHex];

    if (!data) {
      return null;
    }

    return {
      hex: normalizedHex,
      ...data,
    };
  }

  /**
   * Get opcode by name
   * @param name - Opcode name (e.g., "STOP", "ADD", "stop", "add")
   * @returns Opcode data with hex
   */
  getOpcodeByName(name: string): OpcodeWithHex | null {
    const normalizedName = name.toUpperCase();
    const result = this.opcodesByName[normalizedName];

    if (!result) {
      return null;
    }

    return {
      hex: result.hex,
      ...result.data,
    };
  }

  /**
   * Get opcode by hex or name
   * @param identifier - Hex value or name
   * @returns Opcode data with hex
   */
  getOpcode(identifier: string): OpcodeWithHex | null {
    // Try hex first
    const byHex = this.getOpcodeByHex(identifier);
    if (byHex) {
      return byHex;
    }

    // Try name
    return this.getOpcodeByName(identifier);
  }
}
