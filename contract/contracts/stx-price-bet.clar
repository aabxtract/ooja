(define-constant ERR-UNAUTHORIZED (err u100))
(define-constant ERR-LIST-FULL (err u102))
(define-constant CONTRACT-OWNER tx-sender)
(define-data-var bet-id-counter uint u0)
(define-data-var all-bet-ids (list 1000 uint) (list))
(define-map bets
  { id: uint }
  {
    creator: principal,
    opponent: (optional principal),
    stake-amount: uint,
    target-price: uint,
    expiry-block: uint,
    direction: uint,
    status: uint,
    winner: (optional principal)
  }
)
(define-map user-bets
  { owner: principal }
  { ids: (list 1000 uint) }
)
(define-private (append-bet-id (ids (list 1000 uint)) (bet-id uint))
  (ok (unwrap! (as-max-len? (append ids bet-id) u1000) ERR-LIST-FULL)))
(define-private (track-user-bet (owner principal) (bet-id uint))
  (let ((entry (default-to { ids: (list) } (map-get? user-bets { owner: owner }))))
    (begin
      (map-set user-bets { owner: owner } { ids: (unwrap-panic (as-max-len? (append (get ids entry) bet-id) u1000)) })
      true)))
(define-public (store-bet
  (bet-id uint)
  (creator principal)
  (opponent (optional principal))
  (stake-amount uint)
  (target-price uint)
  (expiry-block uint)
  (direction uint)
  (status uint)
  (winner (optional principal))
)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-UNAUTHORIZED)
    (if (is-none (map-get? bets { id: bet-id }))
      (begin
        (var-set all-bet-ids (try! (append-bet-id (var-get all-bet-ids) bet-id)))
        (track-user-bet creator bet-id)
        (match opponent opp (track-user-bet opp bet-id) true))
      true)
    (map-set bets
      { id: bet-id }
      {
        creator: creator,
        opponent: opponent,
        stake-amount: stake-amount,
        target-price: target-price,
        expiry-block: expiry-block,
        direction: direction,
        status: status,
        winner: winner
      })
    (ok true)))
(define-read-only (get-bet (bet-id uint))
  (map-get? bets { id: bet-id }))
(define-read-only (get-active-bets)
  (ok (var-get all-bet-ids)))
(define-read-only (get-user-bets (owner principal))
  (ok (get ids (default-to { ids: (list) } (map-get? user-bets { owner: owner })))))
