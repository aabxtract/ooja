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
  /** Implied probability expressed as cents (1–99) */
  priceCents: number;
  /** Total STX pooled on this outcome */
  poolStx: number;
}

export interface Market {
  id: string;
  question: string;
  category: string;
  description?: string;
  image?: string;
  status: MarketStatus;
  outcomes: MarketOutcome[];
  closeAt: string;
  resolvedOutcomeId?: string;
  resolvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  marketId: string;
  walletAddress: string;
  outcomeId: string;
  side: OrderSide;
  amountStx: number;
  priceCents: number;
  shares: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  walletAddress?: string;
  marketId?: string;
  orderId?: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
