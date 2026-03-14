"use client";

import {
  openContractCall,
  type ContractCallRegularOptions,
} from "@stacks/connect";
import {
  uintCV,
  callReadOnlyFunction,
  type ClarityValue,
} from "@stacks/transactions";
import type { StacksNetwork } from "@stacks/network";
import {
  NETWORK,
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  ERROR_MESSAGES,
} from "@/constants";
import { getUserSession, isUserSignedIn } from "@/lib/wallet";

export type BetId = bigint;

export interface CreateBetArgs {
  targetPrice: bigint; // price * 10^8
  stake: bigint; // microstacks
  expiryBlock: bigint; // block height
}

export interface Bet {
  id: BetId;
  creator: string;
  taker?: string;
  targetPrice: bigint;
  stake: bigint;
  expiryBlock: bigint;
  settled: boolean;
  cancelled: boolean;
  winner?: string;
}

function requireWallet() {
  if (!isUserSignedIn()) {
    throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
  }
}

function getNetwork(): StacksNetwork {
  return NETWORK;
}

async function runContractCall(
  opts: Omit<ContractCallRegularOptions, "network" | "appDetails">
) {
  const network = getNetwork();

  return openContractCall({
    ...opts,
    network,
    appDetails: {
      name: "ooja",
      icon: "/icon.png",
    },
    onFinish: (data) => {
      console.log("Tx finished", data);
    },
    onCancel: () => {
      console.log("Tx cancelled");
    },
  });
}

export async function createBet(args: CreateBetArgs) {
  requireWallet();
  const { targetPrice, stake, expiryBlock } = args;

  return runContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "create-bet",
    functionArgs: [uintCV(targetPrice), uintCV(stake), uintCV(expiryBlock)],
    postConditions: [],
  });
}

export async function acceptBet(betId: BetId) {
  requireWallet();

  return runContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "accept-bet",
    functionArgs: [uintCV(betId)],
    postConditions: [],
  });
}

export async function settleBet(betId: BetId) {
  requireWallet();

  return runContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "settle-bet",
    functionArgs: [uintCV(betId)],
    postConditions: [],
  });
}

export async function cancelBet(betId: BetId) {
  requireWallet();

  return runContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "cancel-bet",
    functionArgs: [uintCV(betId)],
    postConditions: [],
  });
}

export async function getBet(_betId: BetId): Promise<Bet | null> {
  const network = getNetwork();

  // NOTE: This is a placeholder until the Clarity struct is finalized.
  // It just performs the read-only call and logs the raw result.
  const result: ClarityValue = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-bet",
    functionArgs: [uintCV(_betId)],
    network,
    senderAddress: CONTRACT_ADDRESS,
  });

  console.log("Raw get-bet result:", result);
  return null;
}

