import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { ObjectId } from "mongodb";
import {
  publicKeyFromSignatureRsv,
  publicKeyFromSignatureVrs,
  publicKeyToAddress,
  validateStacksAddress,
} from "@stacks/transactions";
import { hashMessage } from "@stacks/encryption";
import { ApiError } from "./http";
import { ensureBackendIndexes, getCollections } from "./mongodb";

const SESSION_DAYS = 7;
const NONCE_MINUTES = 10;

export function normalizeWalletAddress(walletAddress: string) {
  return walletAddress.trim().toUpperCase();
}

export function assertWalletAddress(value: unknown) {
  if (typeof value !== "string") {
    throw new ApiError(400, "walletAddress must be a string.");
  }

  const walletAddress = normalizeWalletAddress(value);

  if (!validateStacksAddress(walletAddress)) {
    throw new ApiError(400, "walletAddress must be a valid Stacks address.");
  }

  return walletAddress;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createAuthMessage(walletAddress: string, nonce: string) {
  return [
    "Sign in to Ooja",
    "",
    `Wallet: ${walletAddress}`,
    `Nonce: ${nonce}`,
    "This signature only authenticates your wallet for Ooja off-chain APIs.",
  ].join("\n");
}

export async function createWalletNonce(walletAddress: string) {
  await ensureBackendIndexes();
  const collections = await getCollections();
  const nonce = randomBytes(24).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + NONCE_MINUTES * 60 * 1000);
  const message = createAuthMessage(walletAddress, nonce);

  await collections.authNonces.insertOne({
    walletAddress,
    nonce,
    message,
    expiresAt,
    createdAt: now,
  });

  return { nonce, message, expiresAt };
}

export async function verifyWalletNonce(args: {
  walletAddress: string;
  message: string;
  signature: string;
  publicKey?: string;
}) {
  await ensureBackendIndexes();
  const collections = await getCollections();
  const now = new Date();
  const nonce = extractNonce(args.message);

  if (!verifyStacksMessageSignature(args)) {
    throw new ApiError(401, "Wallet signature could not be verified.");
  }

  const claimedNonce = await collections.authNonces.findOneAndUpdate(
    {
      walletAddress: args.walletAddress,
      nonce,
      message: args.message,
      usedAt: { $exists: false },
      expiresAt: { $gt: now },
    },
    { $set: { usedAt: now } },
    { returnDocument: "after" }
  );

  if (!claimedNonce) {
    throw new ApiError(401, "Auth challenge is invalid, expired, or already used.");
  }

  return createSession(args.walletAddress);
}

export async function createSession(walletAddress: string) {
  const collections = await getCollections();
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await collections.userSessions.insertOne({
    walletAddress,
    tokenHash: hashToken(token),
    expiresAt,
    createdAt: now,
  });

  return { token, walletAddress, expiresAt };
}

export async function requireSession(request: Request) {
  await ensureBackendIndexes();
  const token = getBearerToken(request);

  if (!token) {
    throw new ApiError(401, "Authorization bearer token is required.");
  }

  const collections = await getCollections();
  const session = await collections.userSessions.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw new ApiError(401, "Session is invalid or expired.");
  }

  return session;
}

export function requireAdmin(request: Request) {
  const configuredToken = process.env.OOJA_ADMIN_TOKEN;

  if (!configuredToken) {
    throw new ApiError(500, "OOJA_ADMIN_TOKEN is required for admin routes.");
  }

  const providedToken = request.headers.get("x-admin-token");

  if (!providedToken || providedToken !== configuredToken) {
    throw new ApiError(403, "Admin token is invalid or missing.");
  }
}

export async function requireWalletOwnerOrAdmin(
  request: Request,
  walletAddress: string
) {
  const adminToken = request.headers.get("x-admin-token");

  if (adminToken && process.env.OOJA_ADMIN_TOKEN && adminToken === process.env.OOJA_ADMIN_TOKEN) {
    return { walletAddress, admin: true };
  }

  const session = await requireSession(request);

  if (session.walletAddress !== walletAddress) {
    throw new ApiError(403, "You can only access your own wallet data.");
  }

  return { walletAddress: session.walletAddress, admin: false };
}

export function objectIdFromParam(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "id must be a valid MongoDB ObjectId.");
  }

  return new ObjectId(id);
}

function getBearerToken(request: Request) {
  const auth = request.headers.get("authorization");
  const [scheme, token] = auth?.split(" ") ?? [];

  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

function extractNonce(message: string) {
  const match = message.match(/^Nonce: ([a-f0-9]{48})$/im);

  if (!match) {
    throw new ApiError(400, "message does not contain a valid nonce.");
  }

  return match[1];
}

function verifyStacksMessageSignature(args: {
  walletAddress: string;
  message: string;
  signature: string;
  publicKey?: string;
}) {
  const signature = stripHexPrefix(args.signature);
  const publicKey = args.publicKey ? stripHexPrefix(args.publicKey) : undefined;

  if (!/^[a-fA-F0-9]{130}$/.test(signature)) return false;
  if (publicKey && !/^[a-fA-F0-9]{66,130}$/.test(publicKey)) return false;

  const network = getStacksNetworkName(args.walletAddress);

  if (publicKey) {
    try {
      if (publicKeyToAddress(publicKey, network) !== args.walletAddress) {
        return false;
      }
    } catch {
      return false;
    }
  }

  const messageHash = Buffer.from(hashMessage(args.message)).toString("hex");

  for (const recover of [publicKeyFromSignatureRsv, publicKeyFromSignatureVrs]) {
    try {
      const recoveredPublicKey = recover(messageHash, signature);
      const recoveredAddress = publicKeyToAddress(recoveredPublicKey, network);

      if (recoveredAddress === args.walletAddress) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}

function getStacksNetworkName(walletAddress: string) {
  return walletAddress.startsWith("ST") || walletAddress.startsWith("SN")
    ? "testnet"
    : "mainnet";
}

function stripHexPrefix(value: string) {
  return value.startsWith("0x") || value.startsWith("0X") ? value.slice(2) : value;
}

const SCRYPT_KEYLEN = 64;
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION,
  });
  return { hash: derived.toString("hex"), salt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION,
  });
  const stored = Buffer.from(storedHash, "hex");
  if (derived.length !== stored.length) return false;
  return timingSafeEqual(derived, stored);
}

export async function createUser(args: {
  email: string;
  password: string;
  name?: string;
}) {
  await ensureBackendIndexes();
  const collections = await getCollections();

  const existing = await collections.users.findOne({ email: args.email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const { hash, salt } = hashPassword(args.password);
  const now = new Date();

  const result = await collections.users.insertOne({
    email: args.email.toLowerCase(),
    passwordHash: hash,
    passwordSalt: salt,
    name: args.name,
    createdAt: now,
    updatedAt: now,
  });

  return { id: result.insertedId, email: args.email.toLowerCase(), name: args.name };
}

export async function authenticateUser(args: { email: string; password: string }) {
  await ensureBackendIndexes();
  const collections = await getCollections();

  const user = await collections.users.findOne({ email: args.email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const valid = verifyPassword(args.password, user.passwordHash, user.passwordSalt);
  if (!valid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return createSession(user.email);
}
