import type { ObjectId } from "mongodb";

export type MarketStatus = "draft" | "open" | "closed" | "resolved" | "cancelled";
export type OrderSide = "buy";
export type ActivityType =
  | "market_created"
  | "market_updated"
  | "market_resolved"
  | "order_created";

export interface MarketOutcome {
  id: string;
  label: string;
  priceCents: number;
  poolStx: number;
}

export interface MarketDocument {
  _id?: ObjectId;
  question: string;
  category: string;
  description?: string;
  image?: string;
  status: MarketStatus;
  outcomes: MarketOutcome[];
  closeAt: Date;
  resolvedOutcomeId?: string;
  resolvedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDocument {
  _id?: ObjectId;
  marketId: ObjectId;
  walletAddress: string;
  outcomeId: string;
  side: OrderSide;
  amountStx: number;
  priceCents: number;
  shares: number;
  createdAt: Date;
}

export interface ActivityDocument {
  _id?: ObjectId;
  type: ActivityType;
  walletAddress?: string;
  marketId?: ObjectId;
  orderId?: ObjectId;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface AuthNonceDocument {
  _id?: ObjectId;
  walletAddress: string;
  nonce: string;
  message: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

export interface UserSessionDocument {
  _id?: ObjectId;
  walletAddress: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}
