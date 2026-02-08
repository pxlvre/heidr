/**
 * Ensures a string has the '0x' hex prefix
 * @param value - The string to convert to hex format
 * @returns The value with '0x' prefix
 */
export const ensureHex = (value: string): `0x${string}` => {
  if (value.startsWith('0x')) {
    return value as `0x${string}`;
  }
  return `0x${value}`;
};

/**
 * Removes the '0x' prefix if present
 * @param value - The hex string
 * @returns The value without '0x' prefix
 */
export const stripHex = (value: string): string => {
  return value.startsWith('0x') ? value.slice(2) : value;
};
