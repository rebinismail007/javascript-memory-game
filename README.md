# Odd Pairs — JavaScript memory game

A deliberately silly browser game: pair a disco ball, a dinosaur, a sock and five other unrelated things. **New portfolio example.**

## Play

Requires Node.js 24+. No installation or build step.

```sh
npm start
```

Open http://127.0.0.1:4173. Flip two cards per move. A mismatch hides after 850 ms; all eight pairs end the game. Your best score stays in this browser when storage is available.

## Code worth reading

- `game.js`: Fisher–Yates shuffle and pure game-state transitions.
- `app.js`: DOM rendering, accessible card names, focus restoration and a cancellable mismatch timer.
- `style.css`: responsive CSS Grid board with no UI framework.
- `server.mjs`: localhost-only development server with a restricted file allowlist.

```sh
npm test
```

Four tests cover the shuffled deck, self-matching prevention, mismatch locking, victory and corrupted score storage. Randomness is for casual play; there is no online leaderboard, money or multiplayer.
