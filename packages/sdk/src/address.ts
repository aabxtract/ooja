// Stacks addresses use base58check encoding.
// Mainnet: SP (P2PKH) or SM (P2SH)
// Testnet: ST (P2PKH) or SN (P2SH)
// Length is typically 40–41 characters total.
const STACKS_ADDRESS_RE = /^S[PMTN][0-9A-HJKMNP-TV-Z]{37,39}$/;

/** Returns true if the string is a valid Stacks mainnet or testnet address. */
export function validateStacksAddress(address: string): boolean {
  return STACKS_ADDRESS_RE.test(address);
}
