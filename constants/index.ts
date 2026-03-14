import { StacksMainnet, StacksTestnet } from "@stacks/network";

export const CONTRACT_NAME = "stx-price-bet";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "SP000000000000000000000000000000000000000";

export const STACKS_NETWORK_ENV =
  process.env.NEXT_PUBLIC_STACKS_NETWORK === "mainnet" ? "mainnet" : "testnet";

export const STACKS_API_URL =
  process.env.NEXT_PUBLIC_STACKS_API_URL ||
  (STACKS_NETWORK_ENV === "mainnet"
    ? "https://api.hiro.so"
    : "https://api.testnet.hiro.so");

export const NETWORK =
  STACKS_NETWORK_ENV === "mainnet"
    ? new StacksMainnet()
    : new StacksTestnet({ url: STACKS_API_URL });

export const APP_NAME = "ooja";
export const APP_ICON = "/icon.png";

export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: "Connect your Stacks wallet to continue.",
  TRANSACTION_FAILED: "The transaction failed. Please try again.",
  BET_NOT_FOUND: "Bet not found.",
  UNAUTHORIZED: "You are not allowed to perform this action.",
};

