export type MarketStatus = "Open" | "Live" | "Settled" | "Paused";
export type Direction = "Up" | "Down";
export type PositionStatus = "Open" | "Winning" | "Losing" | "Settled";

export interface Market {
  id: string;
  symbol: string;
  title: string;
  question: string;
  description: string;
  category: string;
  targetPrice: number;
  currentPrice: number;
  change24h: number;
  probabilityUp: number;
  liquidity: number;
  volume24h: number;
  openInterest: number;
  spread: number;
  expiry: string;
  status: MarketStatus;
  creator: string;
  chart: number[];
  recentTrades: Trade[];
  orderBook: OrderBookLevel[];
}

export interface Trade {
  id: string;
  side: Direction;
  price: number;
  size: number;
  trader: string;
  time: string;
}

export interface OrderBookLevel {
  price: number;
  upSize: number;
  downSize: number;
}

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  side: Direction;
  stake: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  status: PositionStatus;
  expiry: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  detail: string;
  time: string;
}

export const markets: Market[] = [
  {
    id: "stx-4-july",
    symbol: "STX/USD",
    title: "STX closes above $4.00 in July",
    question: "Will STX trade above $4.00 before July 31, 2026?",
    description:
      "A binary STX prediction market for traders who want directional exposure around the July close. The market resolves from a mock oracle price in this frontend build.",
    category: "Price",
    targetPrice: 4,
    currentPrice: 3.42,
    change24h: 4.8,
    probabilityUp: 64,
    liquidity: 84200,
    volume24h: 21840,
    openInterest: 126500,
    spread: 1.8,
    expiry: "Jul 31, 2026",
    status: "Live",
    creator: "SP2C...9QK4",
    chart: [38, 42, 40, 48, 55, 51, 59, 64, 62, 66, 64, 69],
    recentTrades: [
      { id: "t1", side: "Up", price: 0.64, size: 420, trader: "SP91...J72A", time: "12s ago" },
      { id: "t2", side: "Down", price: 0.37, size: 180, trader: "SP3F...0RKA", time: "1m ago" },
      { id: "t3", side: "Up", price: 0.63, size: 260, trader: "SP44...22NP", time: "4m ago" },
    ],
    orderBook: [
      { price: 0.66, upSize: 820, downSize: 310 },
      { price: 0.65, upSize: 620, downSize: 430 },
      { price: 0.64, upSize: 540, downSize: 520 },
      { price: 0.63, upSize: 390, downSize: 680 },
    ],
  },
  {
    id: "btc-120k-q3",
    symbol: "BTC/USD",
    title: "Bitcoin reaches $120k before Q3 ends",
    question: "Will BTC print $120,000 before September 30, 2026?",
    description:
      "A broad crypto momentum market for traders watching Bitcoin liquidity, ETF flows, and macro sentiment.",
    category: "Crypto",
    targetPrice: 120000,
    currentPrice: 108450,
    change24h: -1.6,
    probabilityUp: 48,
    liquidity: 156900,
    volume24h: 39720,
    openInterest: 294100,
    spread: 2.1,
    expiry: "Sep 30, 2026",
    status: "Open",
    creator: "SP8M...P2W1",
    chart: [58, 61, 57, 56, 51, 52, 49, 47, 50, 48, 46, 48],
    recentTrades: [
      { id: "t4", side: "Down", price: 0.52, size: 770, trader: "SP2V...91MT", time: "34s ago" },
      { id: "t5", side: "Up", price: 0.48, size: 310, trader: "SP7X...QJ20", time: "3m ago" },
      { id: "t6", side: "Down", price: 0.51, size: 520, trader: "SP11...M9FF", time: "8m ago" },
    ],
    orderBook: [
      { price: 0.5, upSize: 430, downSize: 600 },
      { price: 0.49, upSize: 670, downSize: 540 },
      { price: 0.48, upSize: 880, downSize: 410 },
      { price: 0.47, upSize: 530, downSize: 710 },
    ],
  },
  {
    id: "stx-activation-epoch",
    symbol: "STX",
    title: "Stacks network upgrade activates on schedule",
    question: "Will the next major Stacks upgrade activate before August 15, 2026?",
    description:
      "A protocol event market for upgrade watchers. This mock market shows how non-price outcomes can sit beside price markets.",
    category: "Protocol",
    targetPrice: 1,
    currentPrice: 1,
    change24h: 2.2,
    probabilityUp: 71,
    liquidity: 48200,
    volume24h: 9160,
    openInterest: 68200,
    spread: 1.2,
    expiry: "Aug 15, 2026",
    status: "Live",
    creator: "SP7B...1AA3",
    chart: [52, 54, 56, 61, 59, 63, 66, 65, 68, 70, 69, 71],
    recentTrades: [
      { id: "t7", side: "Up", price: 0.71, size: 150, trader: "SP6D...B20X", time: "45s ago" },
      { id: "t8", side: "Up", price: 0.7, size: 90, trader: "SP1Q...LA73", time: "6m ago" },
      { id: "t9", side: "Down", price: 0.29, size: 210, trader: "SP5H...909A", time: "12m ago" },
    ],
    orderBook: [
      { price: 0.72, upSize: 250, downSize: 170 },
      { price: 0.71, upSize: 440, downSize: 210 },
      { price: 0.7, upSize: 390, downSize: 280 },
      { price: 0.69, upSize: 310, downSize: 350 },
    ],
  },
  {
    id: "stx-2-50-week",
    symbol: "STX/USD",
    title: "STX dips below $2.50 this week",
    question: "Will STX trade below $2.50 before the weekly close?",
    description:
      "A short-term downside market for traders watching volatility and support levels.",
    category: "Price",
    targetPrice: 2.5,
    currentPrice: 3.42,
    change24h: -0.9,
    probabilityUp: 27,
    liquidity: 63500,
    volume24h: 14360,
    openInterest: 88100,
    spread: 2.4,
    expiry: "Jun 14, 2026",
    status: "Open",
    creator: "SP41...BC1R",
    chart: [35, 33, 31, 28, 30, 25, 26, 24, 27, 29, 28, 27],
    recentTrades: [
      { id: "t10", side: "Down", price: 0.73, size: 650, trader: "SPZ2...7K8D", time: "2m ago" },
      { id: "t11", side: "Down", price: 0.72, size: 240, trader: "SPM7...XG82", time: "5m ago" },
      { id: "t12", side: "Up", price: 0.28, size: 120, trader: "SP1T...MC55", time: "9m ago" },
    ],
    orderBook: [
      { price: 0.28, upSize: 160, downSize: 580 },
      { price: 0.27, upSize: 210, downSize: 490 },
      { price: 0.26, upSize: 180, downSize: 640 },
      { price: 0.25, upSize: 260, downSize: 520 },
    ],
  },
  {
    id: "defi-tvl-stacks",
    symbol: "STX DeFi",
    title: "Stacks DeFi TVL clears $1B",
    question: "Will Stacks ecosystem DeFi TVL exceed $1B before year end?",
    description:
      "A fundamentals market tracking ecosystem liquidity growth and app adoption.",
    category: "Ecosystem",
    targetPrice: 1000000000,
    currentPrice: 782000000,
    change24h: 1.1,
    probabilityUp: 57,
    liquidity: 40900,
    volume24h: 7850,
    openInterest: 57600,
    spread: 2.7,
    expiry: "Dec 31, 2026",
    status: "Open",
    creator: "SP9L...5ZA8",
    chart: [44, 46, 45, 47, 51, 53, 50, 52, 55, 56, 58, 57],
    recentTrades: [
      { id: "t13", side: "Up", price: 0.57, size: 300, trader: "SP2P...EU11", time: "1m ago" },
      { id: "t14", side: "Down", price: 0.44, size: 190, trader: "SP8N...T3R2", time: "7m ago" },
      { id: "t15", side: "Up", price: 0.56, size: 80, trader: "SP0A...KK32", time: "15m ago" },
    ],
    orderBook: [
      { price: 0.58, upSize: 300, downSize: 230 },
      { price: 0.57, upSize: 410, downSize: 290 },
      { price: 0.56, upSize: 500, downSize: 330 },
      { price: 0.55, upSize: 270, downSize: 420 },
    ],
  },
  {
    id: "settled-stx-3",
    symbol: "STX/USD",
    title: "STX traded above $3.00 before June",
    question: "Did STX trade above $3.00 before June 1, 2026?",
    description:
      "A resolved example market used to show settled state, historical trades, and profile accounting.",
    category: "Resolved",
    targetPrice: 3,
    currentPrice: 3.18,
    change24h: 0,
    probabilityUp: 100,
    liquidity: 0,
    volume24h: 0,
    openInterest: 0,
    spread: 0,
    expiry: "Jun 1, 2026",
    status: "Settled",
    creator: "SP0M...YJ73",
    chart: [42, 48, 51, 55, 60, 69, 76, 82, 88, 95, 99, 100],
    recentTrades: [
      { id: "t16", side: "Up", price: 0.99, size: 800, trader: "SP4R...NN80", time: "resolved" },
      { id: "t17", side: "Down", price: 0.02, size: 100, trader: "SP22...C001", time: "resolved" },
      { id: "t18", side: "Up", price: 0.96, size: 350, trader: "SP1S...X0N8", time: "resolved" },
    ],
    orderBook: [
      { price: 1, upSize: 0, downSize: 0 },
      { price: 0.99, upSize: 0, downSize: 0 },
      { price: 0.98, upSize: 0, downSize: 0 },
      { price: 0.97, upSize: 0, downSize: 0 },
    ],
  },
];

export const positions: Position[] = [
  {
    id: "pos-1",
    marketId: "stx-4-july",
    marketTitle: "STX closes above $4.00 in July",
    side: "Up",
    stake: 1250,
    entryPrice: 0.58,
    currentPrice: 0.64,
    pnl: 75,
    status: "Winning",
    expiry: "Jul 31, 2026",
  },
  {
    id: "pos-2",
    marketId: "btc-120k-q3",
    marketTitle: "Bitcoin reaches $120k before Q3 ends",
    side: "Down",
    stake: 740,
    entryPrice: 0.49,
    currentPrice: 0.52,
    pnl: 22.2,
    status: "Winning",
    expiry: "Sep 30, 2026",
  },
  {
    id: "pos-3",
    marketId: "defi-tvl-stacks",
    marketTitle: "Stacks DeFi TVL clears $1B",
    side: "Up",
    stake: 500,
    entryPrice: 0.61,
    currentPrice: 0.57,
    pnl: -20,
    status: "Losing",
    expiry: "Dec 31, 2026",
  },
  {
    id: "pos-4",
    marketId: "settled-stx-3",
    marketTitle: "STX traded above $3.00 before June",
    side: "Up",
    stake: 300,
    entryPrice: 0.72,
    currentPrice: 1,
    pnl: 84,
    status: "Settled",
    expiry: "Jun 1, 2026",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "a1",
    label: "Bought UP",
    detail: "STX closes above $4.00 in July at 64c",
    time: "2 minutes ago",
  },
  {
    id: "a2",
    label: "Order filled",
    detail: "Bitcoin reaches $120k before Q3 ends, DOWN side",
    time: "18 minutes ago",
  },
  {
    id: "a3",
    label: "Market watched",
    detail: "Stacks DeFi TVL clears $1B",
    time: "1 hour ago",
  },
  {
    id: "a4",
    label: "Resolved",
    detail: "STX traded above $3.00 before June paid out",
    time: "3 days ago",
  },
];

export const accountSummary = {
  wallet: "SP2C...9QK4",
  buyingPower: 4320,
  portfolioValue: 2895,
  totalPnl: 161.2,
  openPositions: 3,
  watchlist: ["stx-4-july", "btc-120k-q3", "stx-activation-epoch"],
};

export function getMarketById(id: string) {
  return markets.find((market) => market.id === id);
}
