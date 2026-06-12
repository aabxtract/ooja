import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
  }
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function fail(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.status }
    );
  }

  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON.");
  }
}

export function requireString(
  value: unknown,
  field: string,
  options: { min?: number; max?: number } = {}
) {
  if (typeof value !== "string") {
    throw new ApiError(400, `${field} must be a string.`);
  }

  const trimmed = value.trim();
  const min = options.min ?? 1;

  if (trimmed.length < min) {
    throw new ApiError(400, `${field} is required.`);
  }

  if (options.max && trimmed.length > options.max) {
    throw new ApiError(400, `${field} must be ${options.max} characters or fewer.`);
  }

  return trimmed;
}

export function optionalString(
  value: unknown,
  field: string,
  options: { max?: number } = {}
) {
  if (value === undefined || value === null || value === "") return undefined;
  return requireString(value, field, { min: 0, max: options.max });
}

export function requireNumber(
  value: unknown,
  field: string,
  options: { min?: number; max?: number } = {}
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ApiError(400, `${field} must be a number.`);
  }

  if (options.min !== undefined && value < options.min) {
    throw new ApiError(400, `${field} must be at least ${options.min}.`);
  }

  if (options.max !== undefined && value > options.max) {
    throw new ApiError(400, `${field} must be at most ${options.max}.`);
  }

  return value;
}

export function parseDate(value: unknown, field: string) {
  const raw = requireString(value, field);
  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, `${field} must be a valid date string.`);
  }

  return date;
}
