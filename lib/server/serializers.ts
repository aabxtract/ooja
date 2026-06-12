import type {
  ActivityDocument,
  MarketDocument,
  OrderDocument,
} from "./types";

export function serializeMarket(market: MarketDocument) {
  return {
    id: market._id?.toString(),
    question: market.question,
    category: market.category,
    description: market.description,
    image: market.image,
    status: market.status,
    outcomes: market.outcomes,
    closeAt: market.closeAt.toISOString(),
    resolvedOutcomeId: market.resolvedOutcomeId,
    resolvedAt: market.resolvedAt?.toISOString(),
    createdBy: market.createdBy,
    createdAt: market.createdAt.toISOString(),
    updatedAt: market.updatedAt.toISOString(),
  };
}

export function serializeOrder(order: OrderDocument) {
  return {
    id: order._id?.toString(),
    marketId: order.marketId.toString(),
    walletAddress: order.walletAddress,
    outcomeId: order.outcomeId,
    side: order.side,
    amountStx: order.amountStx,
    priceCents: order.priceCents,
    shares: order.shares,
    createdAt: order.createdAt.toISOString(),
  };
}

export function serializeActivity(activity: ActivityDocument) {
  return {
    id: activity._id?.toString(),
    type: activity.type,
    walletAddress: activity.walletAddress,
    marketId: activity.marketId?.toString(),
    orderId: activity.orderId?.toString(),
    message: activity.message,
    metadata: activity.metadata,
    createdAt: activity.createdAt.toISOString(),
  };
}
