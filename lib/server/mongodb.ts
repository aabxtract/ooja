import { MongoClient, type Db } from "mongodb";
import type {
  ActivityDocument,
  AuthNonceDocument,
  MarketDocument,
  OrderDocument,
  UserSessionDocument,
} from "./types";

let clientPromise: Promise<MongoClient> | null = null;
let indexPromise: Promise<void> | null = null;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required for backend API routes.");
  }

  return uri;
}

export async function getMongoClient() {
  if (!clientPromise) {
    const client = new MongoClient(getMongoUri());
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "ooja");
}

export async function getCollections() {
  const db = await getDb();

  return {
    markets: db.collection<MarketDocument>("markets"),
    orders: db.collection<OrderDocument>("orders"),
    activity: db.collection<ActivityDocument>("activity"),
    authNonces: db.collection<AuthNonceDocument>("auth_nonces"),
    userSessions: db.collection<UserSessionDocument>("user_sessions"),
  };
}

export async function ensureBackendIndexes() {
  if (!indexPromise) {
    indexPromise = createIndexes();
  }

  return indexPromise;
}

async function createIndexes() {
  const collections = await getCollections();

  await Promise.all([
    collections.markets.createIndex({ status: 1, closeAt: 1 }),
    collections.markets.createIndex({ category: 1 }),
    collections.orders.createIndex({ walletAddress: 1, createdAt: -1 }),
    collections.orders.createIndex({ marketId: 1, outcomeId: 1 }),
    collections.activity.createIndex({ createdAt: -1 }),
    collections.authNonces.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    collections.authNonces.createIndex({ walletAddress: 1, nonce: 1 }),
    collections.userSessions.createIndex({ tokenHash: 1 }, { unique: true }),
    collections.userSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
}
