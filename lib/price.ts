import axios from "axios";

const COINGECKO_API_URL =
  process.env.NEXT_PUBLIC_COINGECKO_API_URL ||
  "https://api.coingecko.com/api/v3/simple/price";

const STX_ID = process.env.NEXT_PUBLIC_COINGECKO_STX_ID || "blockstack";

export async function fetchStxPriceUsd(): Promise<number> {
  const url = `${COINGECKO_API_URL}?ids=${STX_ID}&vs_currencies=usd`;

  const res = await axios.get(url);
  const price = res.data?.[STX_ID]?.usd;

  if (typeof price !== "number") {
    throw new Error("Failed to fetch STX price from CoinGecko");
  }

  return price;
}

