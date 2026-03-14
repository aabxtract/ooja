;; stx-price-bet.clar
;; Simple STX price betting contract for Stacks mainnet

;; -----------------------------
;; DATA TYPES & CONSTANTS
;; -----------------------------

;; Bet status enum
(define-constant STATUS-OPEN u0)
(define-constant STATUS-ACTIVE u1)
(define-constant STATUS-SETTLED u2)
(define-constant STATUS-CANCELLED u3)

;; Direction: up (1) / down (0)
(define-constant DIRECTION-DOWN u0)
(define-constant DIRECTION-UP u1)

;; Error codes
(define-constant ERR-BET-NOT-FOUND u100)
(define-constant ERR-BET-NOT-OPEN u101)
(define-constant ERR-BET-NOT-EXPIRED u102)
(define-constant ERR-UNAUTHORIZED u103)
(define-constant ERR-INSUFFICIENT-FUNDS u104)
(define-constant ERR-ALREADY-ACCEPTED u105)
(define-constant ERR-SELF-BET u106)

;; Max number of bets tracked for listing functions (read-only)
(define-constant MAX-BETS u1000)

;; Auto-incrementing bet id counter
(define-data-var bet-id-counter uint u0)

;; Core bet storage:
;;  - bet-id (key)
;;  - creator / opponent principals
;;  - stake-amount (per side, in micro-STX)
;;  - target-price (in cents)
;;  - expiry-block (uint block height)
;;  - direction (up or down)
;;  - status (open/active/settled/cancelled)
;;  - locked balances per side
;;  - winner (optional principal)
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
    creator-locked: uint,
    opponent-locked: uint,
    winner: (optional principal)
  }
)

;; Track all bet-ids for read-only listing
(define-data-var all-bet-ids (list MAX-BETS uint) (list))

;; -----------------------------
;; INTERNAL HELPERS
;; -----------------------------

;; Helper: get next bet-id and increment counter
(define-private (next-bet-id)
  (let ((current (var-get bet-id-counter)))
    (let ((next-id (+ current u1)))
      (begin
        (var-set bet-id-counter next-id)
        next-id))))

;; Helper: fetch bet or return error
(define-private (fetch-bet (bet-id uint))
  (match (map-get? bets { id: bet-id })
    bet (ok bet)
    (err ERR-BET-NOT-FOUND)))

;; Helper: ensure caller is bet creator
(define-private (assert-creator (bet (tuple
                                       (creator principal)
                                       (opponent (optional principal))
                                       (stake-amount uint)
                                       (target-price uint)
                                       (expiry-block uint)
                                       (direction uint)
                                       (status uint)
                                       (creator-locked uint)
                                       (opponent-locked uint)
                                       (winner (optional principal)))))
  (if (is-eq (get creator bet) tx-sender)
      (ok true)
      (err ERR-UNAUTHORIZED)))

;; Helper: is bet open (no opponent yet and status open)
(define-private (is-open-bet (bet (tuple
                                    (creator principal)
                                    (opponent (optional principal))
                                    (stake-amount uint)
                                    (target-price uint)
                                    (expiry-block uint)
                                    (direction uint)
                                    (status uint)
                                    (creator-locked uint)
                                    (opponent-locked uint)
                                    (winner (optional principal)))))
  (and (is-eq (get status bet) STATUS-OPEN)
       (is-none (get opponent bet))))

;; Helper: transfer STX from caller to contract (lock funds)
(define-private (lock-stx (amount uint))
  (if (is-eq amount u0)
      (ok true)
      (match (stx-transfer? amount tx-sender (as-contract tx-sender))
        result (ok true)
        (err-code (err ERR-INSUFFICIENT-FUNDS)))))

;; Helper: transfer STX from contract to recipient (unlock funds)
(define-private (unlock-stx (amount uint) (recipient principal))
  (if (is-eq amount u0)
      (ok true)
      (as-contract
        (match (stx-transfer? amount tx-sender recipient)
          result (ok true)
          (err-code (err ERR-INSUFFICIENT-FUNDS))))))

;; Helper: append bet-id to all-bet-ids list (best-effort, ignore overflow)
(define-private (track-bet-id (bet-id uint))
  (let ((ids (var-get all-bet-ids)))
    (if (< (len ids) MAX-BETS)
        (var-set all-bet-ids (cons bet-id ids))
        ;; If we are at capacity, silently skip tracking; core logic still works.
        (ok false))))

;; -----------------------------
;; PUBLIC FUNCTIONS
;; -----------------------------

;; create-bet
;; - Creator sets target price (cents), expiry block, direction, stake amount (micro-STX)
;; - Locks creator's STX into the contract
;; - Stores bet and returns new bet-id
;; - Emits a print event with bet details
(define-public (create-bet
  (target-price uint)
  (expiry-block uint)
  (direction uint)     ;; DIRECTION-UP or DIRECTION-DOWN
  (stake-amount uint)  ;; micro-STX
)
  (begin
    ;; Require non-zero stake
    (if (is-eq stake-amount u0)
        (err ERR-INSUFFICIENT-FUNDS)
        (ok true))

    ;; Lock creator's stake into contract
    (try! (lock-stx stake-amount))

    ;; Create and persist bet
    (let ((bet-id (next-bet-id)))
      (begin
        (map-set bets
          { id: bet-id }
          {
            creator: tx-sender,
            opponent: none,
            stake-amount: stake-amount,
            target-price: target-price,
            expiry-block: expiry-block,
            direction: direction,
            status: STATUS-OPEN,
            creator-locked: stake-amount,
            opponent-locked: u0,
            winner: none
          })
        (track-bet-id bet-id)

        ;; Emit create-bet event
        (print
          (tuple
            (event "create-bet")
            (bet-id bet-id)
            (creator tx-sender)
            (stake-amount stake-amount)
            (target-price target-price)
            (expiry-block expiry-block)
            (direction direction)))

        (ok bet-id)))))

;; accept-bet
;; - Opponent accepts an open bet by bet-id
;; - Locks opponent's STX in contract
;; - Marks bet status as active
;; - Emits event confirming bet is live
(define-public (accept-bet (bet-id uint))
  (let ((bet (try! (fetch-bet bet-id))))
    (begin
      ;; Bet must be open and have no opponent
      (if (not (is-open-bet bet))
          (err ERR-BET-NOT-OPEN)
          (ok true))

      ;; Creator cannot accept own bet
      (if (is-eq (get creator bet) tx-sender)
          (err ERR-SELF-BET)
          (ok true))

      ;; Lock opponent's stake (same amount as creator)
      (let ((stake (get stake-amount bet)))
        (try! (lock-stx stake))

        ;; Update bet as active with opponent set
        (map-set bets
          { id: bet-id }
          {
            creator: (get creator bet),
            opponent: (some tx-sender),
            stake-amount: stake,
            target-price: (get target-price bet),
            expiry-block: (get expiry-block bet),
            direction: (get direction bet),
            status: STATUS-ACTIVE,
            creator-locked: (get creator-locked bet),
            opponent-locked: stake,
            winner: none
          })

        ;; Emit accept-bet event
        (print
          (tuple
            (event "accept-bet")
            (bet-id bet-id)
            (creator (get creator bet))
            (opponent tx-sender)
            (stake-amount stake)))

        (ok bet-id)))))

;; settle-bet
;; - Callable by anyone after expiry-block
;; - Accepts current STX price (in cents) from oracle
;; - For active bets:
;;     - If direction = up and current > target => creator wins
;;     - If direction = up and current < target => opponent wins
;;     - If direction = down and current < target => creator wins
;;     - If direction = down and current > target => opponent wins
;;     - Ties => both refunded original stakes
;; - For expired, still-open bets (no opponent) => creator refunded
;; - Updates status to settled and records winner
;; - Emits event with winner and amounts
(define-public (settle-bet (bet-id uint) (current-price uint))
  (let ((bet (try! (fetch-bet bet-id))))
    (begin
      ;; Must be expired
      (if (< (block-height) (get expiry-block bet))
          (err ERR-BET-NOT-EXPIRED)
          (ok true))

      ;; Already settled or cancelled cannot be settled again
      (if (or (is-eq (get status bet) STATUS-SETTLED)
              (is-eq (get status bet) STATUS-CANCELLED))
          (err ERR-BET-NOT-OPEN)
          (ok true))

      (let (
            (creator (get creator bet))
            (maybe-opponent (get opponent bet))
            (stake (get stake-amount bet))
            (total-pot (+ (get creator-locked bet) (get opponent-locked bet)))
           )

        ;; Case 1: bet never accepted, refund creator
        (if (and (is-open-bet bet) (is-none maybe-opponent))
            (begin
              (try! (unlock-stx (get creator-locked bet) creator))

              (map-set bets
                { id: bet-id }
                {
                  creator: creator,
                  opponent: none,
                  stake-amount: stake,
                  target-price: (get target-price bet),
                  expiry-block: (get expiry-block bet),
                  direction: (get direction bet),
                  status: STATUS-SETTLED,
                  creator-locked: u0,
                  opponent-locked: u0,
                  winner: none
                })

              (print
                (tuple
                  (event "settle-bet-expired-unclaimed")
                  (bet-id bet-id)
                  (refunded-to creator)
                  (amount (get creator-locked bet))))

              (ok bet-id))
            ;; Case 2: active bet with opponent, determine winner or tie
            (let (
                  (opponent (default tx-sender maybe-opponent))
                  (direction (get direction bet))
                  (target (get target-price bet))
                 )

              (if (and (is-some maybe-opponent)
                       (is-eq (get status bet) STATUS-ACTIVE))
                  (let (
                        (creator-wins
                          (if (is-eq direction DIRECTION-UP)
                              (> current-price target)
                              (< current-price target)))
                        (opponent-wins
                          (if (is-eq direction DIRECTION-UP)
                              (< current-price target)
                              (> current-price target)))
                       )

                    ;; Tie: refund both
                    (if (and (not creator-wins) (not opponent-wins))
                        (begin
                          (try! (unlock-stx (get creator-locked bet) creator))
                          (try! (unlock-stx (get opponent-locked bet) opponent))

                          (map-set bets
                            { id: bet-id }
                            {
                              creator: creator,
                              opponent: (some opponent),
                              stake-amount: stake,
                              target-price: target,
                              expiry-block: (get expiry-block bet),
                              direction: direction,
                              status: STATUS-SETTLED,
                              creator-locked: u0,
                              opponent-locked: u0,
                              winner: none
                            })

                          (print
                            (tuple
                              (event "settle-bet-tie")
                              (bet-id bet-id)
                              (creator creator)
                              (opponent opponent)
                              (refunded-creator (get creator-locked bet))
                              (refunded-opponent (get opponent-locked bet))))

                          (ok bet-id))
                        ;; Non-tie: pay full pot to winner
                        (let (
                              (winner
                                (if creator-wins creator opponent))
                             )
                          (try! (unlock-stx total-pot winner))

                          (map-set bets
                            { id: bet-id }
                            {
                              creator: creator,
                              opponent: (some opponent),
                              stake-amount: stake,
                              target-price: target,
                              expiry-block: (get expiry-block bet),
                              direction: direction,
                              status: STATUS-SETTLED,
                              creator-locked: u0,
                              opponent-locked: u0,
                              winner: (some winner)
                            })

                          (print
                            (tuple
                              (event "settle-bet")
                              (bet-id bet-id)
                              (creator creator)
                              (opponent opponent)
                              (winner winner)
                              (amount total-pot)
                              (current-price current-price)))

                          (ok bet-id))))
                  (err ERR-BET-NOT-OPEN))))))))

;; cancel-bet
;; - Only creator can cancel
;; - Bet must still be open (no opponent)
;; - Refunds creator's locked STX
;; - Marks bet as cancelled
(define-public (cancel-bet (bet-id uint))
  (let ((bet (try! (fetch-bet bet-id))))
    (begin
      ;; Ensure caller is creator
      (try! (assert-creator bet))

      ;; Only open bets with no opponent can be cancelled
      (if (not (is-open-bet bet))
          (err ERR-BET-NOT-OPEN)
          (ok true))

      ;; Refund creator
      (try! (unlock-stx (get creator-locked bet) (get creator bet)))

      ;; Mark cancelled
      (map-set bets
        { id: bet-id }
        {
          creator: (get creator bet),
          opponent: none,
          stake-amount: (get stake-amount bet),
          target-price: (get target-price bet),
          expiry-block: (get expiry-block bet),
          direction: (get direction bet),
          status: STATUS-CANCELLED,
          creator-locked: u0,
          opponent-locked: u0,
          winner: none
        })

      (print
        (tuple
          (event "cancel-bet")
          (bet-id bet-id)
          (creator (get creator bet))
          (refunded (get creator-locked bet))))

      (ok bet-id))))

;; -----------------------------
;; READ-ONLY FUNCTIONS
;; -----------------------------

;; get-bet
;; - Returns full bet details for a given bet-id
;; - On success: (ok bet-tuple)
;; - On missing bet: (err ERR-BET-NOT-FOUND)
(define-read-only (get-bet (bet-id uint))
  (fetch-bet bet-id))

;; get-active-bets
;; - Returns list of bet-ids for bets that are OPEN or ACTIVE
;; - Uses tracked bet-id list; bounded by MAX-BETS
(define-read-only (get-active-bets)
  (let ((ids (var-get all-bet-ids)))
    (ok
      (fold
        (lambda (id acc)
          (match (map-get? bets { id: id })
            bet (if (or (is-eq (get status bet) STATUS-OPEN)
                        (is-eq (get status bet) STATUS-ACTIVE))
                    (cons id acc)
                    acc)
            acc))
        (list)
        ids))))

;; get-user-bets
;; - Returns list of bet-ids where the given address is creator or opponent
;; - Uses tracked bet-id list; bounded by MAX-BETS
(define-read-only (get-user-bets (owner principal))
  (let ((ids (var-get all-bet-ids)))
    (ok
      (fold
        (lambda (id acc)
          (match (map-get? bets { id: id })
            bet (let (
                       (creator (get creator bet))
                       (maybe-opponent (get opponent bet))
                     )
                  (if (or (is-eq creator owner)
                          (and (is-some maybe-opponent)
                               (is-eq (default owner maybe-opponent) owner)))
                      (cons id acc)
                      acc))
            acc))
        (list)
        ids))))

