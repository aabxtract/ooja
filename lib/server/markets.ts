import type { Filter } from "mongodb";
import { ApiError, optionalString, parseDate, requireNumber, requireString } from "./http";
import type { MarketDocument, MarketOutcome, MarketStatus } from "./types";

const MARKET_STATUSES: MarketStatus[] = [
  "draft",
  "open",
  "closed",
  "resolved",
  "cancelled",
];

export function parseMarketCreateBody(body: unknown, createdBy: string): MarketDocument {
  const input = asRecord(body);
  const closeAt = parseDate(input.closeAt, "closeAt");

  if (closeAt.getTime() <= Date.now()) {
    throw new ApiError(400, "closeAt must be in the future.");
  }

  const status = parseStatus(input.status ?? "open");
  const now = new Date();

  return {
    question: requireString(input.question, "question", { max: 180 }),
    category: requireString(input.category, "category", { max: 48 }),
    description: optionalString(input.description, "description", { max: 1000 }),
    image: optionalString(input.image, "image", { max: 64 }),
    status,
    outcomes: parseOutcomes(input.outcomes),
    closeAt,
    createdBy,
    createdAt: now,
    updatedAt: now,
  };
}

export function buildMarketPatch(body: unknown) {
  const input = asRecord(body);
  const patch: Partial<MarketDocument> = { updatedAt: new Date() };

  if (input.question !== undefined) {
    patch.question = requireString(input.question, "question", { max: 180 });
  }

  if (input.category !== undefined) {
    patch.category = requireString(input.category, "category", { max: 48 });
  }

  if (input.description !== undefined) {
    patch.description = optionalString(input.description, "description", { max: 1000 });
  }

  if (input.image !== undefined) {
    patch.image = optionalString(input.image, "image", { max: 64 });
  }

  if (input.status !== undefined) {
    patch.status = parseStatus(input.status);
  }

  if (input.closeAt !== undefined) {
    patch.closeAt = parseDate(input.closeAt, "closeAt");
  }

  if (input.outcomes !== undefined) {
    patch.outcomes = parseOutcomes(input.outcomes);
  }

  return patch;
}

export function buildMarketFilter(searchParams: URLSearchParams): Filter<MarketDocument> {
  const filter: Filter<MarketDocument> = {};
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  if (status) filter.status = parseStatus(status);
  if (category) filter.category = category;

  return filter;
}

export function parseLimit(searchParams: URLSearchParams, fallback = 20, max = 100) {
  const raw = searchParams.get("limit");
  if (!raw) return fallback;

  const limit = Number(raw);

  if (!Number.isInteger(limit) || limit < 1 || limit > max) {
    throw new ApiError(400, `limit must be an integer between 1 and ${max}.`);
  }

  return limit;
}

export function recalculateOutcomePrices(outcomes: MarketOutcome[]) {
  const totalPool = outcomes.reduce((sum, outcome) => sum + outcome.poolStx, 0);

  if (totalPool <= 0) return outcomes;

  return outcomes.map((outcome) => ({
    ...outcome,
    priceCents: Math.min(
      99,
      Math.max(1, Math.round((outcome.poolStx / totalPool) * 100))
    ),
  }));
}

function parseStatus(value: unknown): MarketStatus {
  if (typeof value !== "string" || !MARKET_STATUSES.includes(value as MarketStatus)) {
    throw new ApiError(400, `status must be one of: ${MARKET_STATUSES.join(", ")}.`);
  }

  return value as MarketStatus;
}

function parseOutcomes(value: unknown): MarketOutcome[] {
  if (value === undefined) {
    return [
      { id: "above", label: "Above", priceCents: 50, poolStx: 0 },
      { id: "below", label: "Below", priceCents: 50, poolStx: 0 },
    ];
  }

  if (!Array.isArray(value) || value.length < 2) {
    throw new ApiError(400, "outcomes must include at least two outcomes.");
  }

  const seen = new Set<string>();

  return value.map((raw, index) => {
    const outcome = asRecord(raw);
    const id = requireString(outcome.id ?? `outcome-${index + 1}`, "outcomes.id", {
      max: 32,
    }).toLowerCase();

    if (!/^[a-z0-9-]+$/.test(id)) {
      throw new ApiError(400, "outcomes.id may only contain lowercase letters, numbers, and hyphens.");
    }

    if (seen.has(id)) {
      throw new ApiError(400, `Duplicate outcome id: ${id}.`);
    }

    seen.add(id);

    return {
      id,
      label: requireString(outcome.label, "outcomes.label", { max: 48 }),
      priceCents: Math.round(
        requireNumber(outcome.priceCents ?? 50, "outcomes.priceCents", {
          min: 1,
          max: 99,
        })
      ),
      poolStx: requireNumber(outcome.poolStx ?? 0, "outcomes.poolStx", { min: 0 }),
    };
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(400, "Request body must be a JSON object.");
  }

  return value as Record<string, unknown>;
}
