const BLOCK_TIME_SECONDS = 600;

const GENESIS_TIMESTAMP = Number(
  process.env.NEXT_PUBLIC_STACKS_GENESIS_TIMESTAMP || 1594233000
);
const GENESIS_BLOCK_HEIGHT = Number(
  process.env.NEXT_PUBLIC_STACKS_GENESIS_BLOCK_HEIGHT || 0
);

export function timestampToBlockHeight(timestampSeconds: number): number {
  const deltaSeconds = Math.max(0, timestampSeconds - GENESIS_TIMESTAMP);
  const deltaBlocks = Math.floor(deltaSeconds / BLOCK_TIME_SECONDS);
  return GENESIS_BLOCK_HEIGHT + deltaBlocks;
}

export function futureExpiryBlocks(secondsFromNow: number): number {
  const nowSeconds = Math.floor(Date.now() / 1000);
  return timestampToBlockHeight(nowSeconds + secondsFromNow);
}

