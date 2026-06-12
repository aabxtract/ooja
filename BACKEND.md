# Ooja Backend

The backend lives in Next.js App Router route handlers under `app/api`.

## Environment

```bash
MONGODB_URI="mongodb+srv://..."
MONGODB_DB="ooja"
OOJA_ADMIN_TOKEN="change-me"
```

`MONGODB_DB` is optional and defaults to `ooja`. `OOJA_ADMIN_TOKEN` is required for admin routes and must be sent as the `x-admin-token` header.

## Wallet Auth Flow

1. Request a nonce:

```http
POST /api/auth/nonce
Content-Type: application/json

{ "walletAddress": "SP..." }
```

2. Ask the Stacks wallet to sign the returned `message` using `stx_signMessage`.

3. Verify the signed challenge:

```http
POST /api/auth/verify
Content-Type: application/json

{
  "walletAddress": "SP...",
  "message": "Sign in to Ooja...",
  "signature": "0x...",
  "publicKey": "02..."
}
```

4. Send the returned session token on protected routes:

```http
Authorization: Bearer <token>
```

## Endpoints

- `GET /api/markets` lists markets. Supports `status`, `category`, and `limit`.
- `POST /api/markets` creates a market. Admin only.
- `GET /api/markets/:id` returns one market.
- `PATCH /api/markets/:id` updates a market. Admin only.
- `POST /api/orders` places a wallet order on an open market.
- `GET /api/orders` lists the signed-in wallet's orders. Optional `marketId`.
- `GET /api/portfolio/:walletAddress` returns wallet positions. Wallet owner or admin only.
- `GET /api/activity` returns latest activity. Supports `limit`.
- `POST /api/admin/markets/:id/resolve` resolves a market with `{ "outcomeId": "above" }`. Admin only.

## Current Model

Markets and orders are stored off-chain in MongoDB. Admins resolve markets manually. There is no smart contract dependency yet, so settlement/payout accounting can evolve after the product flow is proven.
