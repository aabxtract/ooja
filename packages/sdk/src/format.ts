/**
 * Format a microstacks amount as a human-readable STX string.
 * e.g. formatStx(40000n) → "0.040000 STX"
 */
export function formatStx(ustx: bigint | number): string {
  const val = typeof ustx === "number" ? BigInt(Math.round(ustx)) : ustx;
  const whole = val / 1_000_000n;
  const fractional = String(val % 1_000_000n).padStart(6, "0");
  return `${whole}.${fractional} STX`;
}

/** Convert microstacks to STX as a plain number. */
export function microStxToStx(ustx: bigint | number): number {
  return (typeof ustx === "number" ? ustx : Number(ustx)) / 1_000_000;
}

/** Convert a STX amount to microstacks as a bigint. */
export function stxToMicroStx(stx: number): bigint {
  return BigInt(Math.round(stx * 1_000_000));
}
