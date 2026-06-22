"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  fetchStxPriceUsd: () => fetchStxPriceUsd,
  formatStx: () => formatStx,
  microStxToStx: () => microStxToStx,
  stxToMicroStx: () => stxToMicroStx,
  validateStacksAddress: () => validateStacksAddress
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchStxPriceUsd,
  formatStx,
  microStxToStx,
  stxToMicroStx,
  validateStacksAddress
});
