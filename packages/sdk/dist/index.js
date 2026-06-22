// src/format.ts
function formatStx(ustx) {
  const val = typeof ustx === "number" ? BigInt(Math.round(ustx)) : ustx;
  const whole = val / 1000000n;
  const fractional = String(val % 1000000n).padStart(6, "0");
  return `${whole}.${fractional} STX`;
}
function microStxToStx(ustx) {
  return (typeof ustx === "number" ? ustx : Number(ustx)) / 1e6;
}
function stxToMicroStx(stx) {
  return BigInt(Math.round(stx * 1e6));
}

// src/price.ts
var COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd";
async function fetchStxPriceUsd() {
  const res = await fetch(COINGECKO_URL);
  if (!res.ok) {
    throw new Error(`CoinGecko request failed with status ${res.status}`);
  }
  const data = await res.json();
  const price = data?.blockstack?.usd;
  if (typeof price !== "number") {
    throw new Error("Failed to parse STX price from CoinGecko response");
  }
  return price;
}

// src/address.ts
var STACKS_ADDRESS_RE = /^S[PMTN][0-9A-HJKMNP-TV-Z]{37,39}$/;
function validateStacksAddress(address) {
  return STACKS_ADDRESS_RE.test(address);
}
export {
  fetchStxPriceUsd,
  formatStx,
  microStxToStx,
  stxToMicroStx,
  validateStacksAddress
};
