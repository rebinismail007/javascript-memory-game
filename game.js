export const SYMBOLS = ["LEMON", "DISCO", "UFO", "SHROOM", "BEATS", "DINO", "CACTUS", "SOCK"];
export function shuffledDeck(random = Math.random) {
  const cards = [...SYMBOLS, ...SYMBOLS];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
export function newGame(cards = shuffledDeck()) {
  return { cards: [...cards], revealed: [], matched: [], moves: 0, phase: "playing" };
}
export function flip(state, index) {
  if (!Number.isInteger(index) || index < 0 || index >= state.cards.length || state.phase !== "playing" || state.revealed.includes(index) || state.matched.includes(index)) return state;
  const revealed = [...state.revealed, index];
  if (revealed.length === 1) return { ...state, revealed };
  const moves = state.moves + 1;
  if (state.cards[revealed[0]] !== state.cards[index]) return { ...state, revealed, moves, phase: "waiting" };
  const matched = [...state.matched, ...revealed];
  return { ...state, matched, revealed: [], moves, phase: matched.length === state.cards.length ? "won" : "playing" };
}
export function hideMismatch(state) { return state.phase === "waiting" ? { ...state, revealed: [], phase: "playing" } : state; }
export function readBest(raw) {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value >= SYMBOLS.length ? value : null;
}
