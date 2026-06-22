const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd";

/** Fetch the current STX/USD price from CoinGecko. */
export async function fetchStxPriceUsd(): Promise<number> {
  const res = await fetch(COINGECKO_URL);
  if (!res.ok) {
    throw new Error(`CoinGecko request failed with status ${res.status}`);
  }
  const data = (await res.json()) as Record<string, Record<string, unknown>>;
  const price = data?.blockstack?.usd;
  if (typeof price !== "number") {
    throw new Error("Failed to parse STX price from CoinGecko response");
  }
  return price;
}
