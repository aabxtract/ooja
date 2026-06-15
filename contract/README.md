# Ooja Stake Contract

This folder contains the smart contract source for the Ooja STX staking flow.

The current contract is:

```text
contract/contracts/stx-price-bet.clar
```

It is a simple escrow-style stake contract for peer-to-peer STX price bets. A creator locks STX, another wallet accepts by locking the same stake, and the contract settles the pot after the expiry block.

## What It Does

- Creates a bet with a target price, direction, expiry block, and STX stake.
- Locks the creator stake in the contract.
- Lets one opponent accept by matching the stake.
- Settles after expiry using a supplied current price.
- Pays the full pot to the winner.
- Refunds both sides on a tie.
- Lets the creator cancel an open bet before anyone accepts.

## Contract Units

- Stake amounts are in micro-STX.
- Price values are integer cents.
- Expiry is a Stacks block height.
- Direction is `u1` for up and `u0` for down.

## Public Functions

### `create-bet`

Creates a new open bet and locks the creator's stake.

```clarity
(create-bet target-price expiry-block direction stake-amount)
```

### `accept-bet`

Accepts an open bet and locks the opponent's matching stake.

```clarity
(accept-bet bet-id)
```

### `settle-bet`

Settles an expired bet using the current price supplied by the caller.

```clarity
(settle-bet bet-id current-price)
```

### `cancel-bet`

Cancels an open bet and refunds the creator. Only the creator can cancel.

```clarity
(cancel-bet bet-id)
```

## Read-Only Functions

```clarity
(get-bet bet-id)
(get-active-bets)
(get-user-bets owner)
```

## Mainnet Readiness

Do not deploy this contract to mainnet until this checklist is complete:

- Add a `Clarinet.toml` project config for the contract.
- Add automated tests for create, accept, cancel, settle, refund, tie, and invalid caller paths.
- Run a local contract check.
- Deploy and test on Stacks testnet first.
- Confirm who is allowed to provide the settlement price.
- Confirm frontend environment variables point to the final contract principal and contract name.
- Review the contract with an independent Clarity reviewer before locking real funds.
- Keep the deployer wallet secure and funded only with the amount needed for deployment.

## Deployment Plan

1. Create or update the Clarinet project configuration for `stx-price-bet.clar`.
2. Run contract checks and tests locally.
3. Deploy the contract to testnet.
4. Connect the app to the testnet contract and run the full user flow.
5. Freeze the contract source that passed testing.
6. Deploy the exact same source to mainnet from the deployer wallet.
7. Record the mainnet contract principal in this README and in the app environment.

## Mainnet Deployment Record

Fill this section after deployment.

```text
Network: Stacks mainnet
Contract name: stx-price-bet
Contract principal: TBD
Deployer wallet: TBD
Source commit: TBD
Deployment transaction: TBD
Deployment date: TBD
```

## Notes

The current app backend still stores markets and orders off-chain. This contract should be treated as the on-chain escrow layer only after the app is wired to call it directly and settlement behavior is tested end to end.
