/**
 * Format a microstacks amount as a human-readable STX string.
 * e.g. formatStx(40000n) → "0.040000 STX"
 */
declare function formatStx(ustx: bigint | number): string;
/** Convert microstacks to STX as a plain number. */
declare function microStxToStx(ustx: bigint | number): number;
/** Convert a STX amount to microstacks as a bigint. */
declare function stxToMicroStx(stx: number): bigint;

/** Fetch the current STX/USD price from CoinGecko. */
declare function fetchStxPriceUsd(): Promise<number>;

/** Returns true if the string is a valid Stacks mainnet or testnet address. */
declare function validateStacksAddress(address: string): boolean;

type MarketStatus = "draft" | "open" | "closed" | "resolved" | "cancelled";
type OrderSide = "buy";
type ActivityType = "market_created" | "market_updated" | "market_resolved" | "order_created";
interface MarketOutcome {
    id: string;
    label: string;
    /** Implied probability expressed as cents (1–99) */
    priceCents: number;
    /** Total STX pooled on this outcome */
    poolStx: number;
}
interface Market {
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
interface Order {
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
interface Activity {
    id: string;
    type: ActivityType;
    walletAddress?: string;
    marketId?: string;
    orderId?: string;
    message: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

export { type Activity, type ActivityType, type Market, type MarketOutcome, type MarketStatus, type Order, type OrderSide, fetchStxPriceUsd, formatStx, microStxToStx, stxToMicroStx, validateStacksAddress };
