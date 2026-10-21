import test from "node:test";
import assert from "node:assert/strict";
import { flip, hideMismatch, newGame, readBest, shuffledDeck, SYMBOLS } from "../game.js";
test("shuffle preserves exactly two of each symbol", () => {
  const cards = shuffledDeck(() => 0.25);
  assert.equal(cards.length, 16);
  for (const symbol of SYMBOLS) assert.equal(cards.filter(c => c === symbol).length, 2);
});
test("the same card cannot match itself and a mismatch blocks a third flip", () => {
  let state = newGame(["a", "b", "a", "b"]);
  state = flip(state, 0); assert.equal(flip(state, 0), state);
  state = flip(state, 1); assert.equal(state.moves, 1); assert.equal(state.phase, "waiting");
  assert.equal(flip(state, 2), state);
  state = hideMismatch(state); assert.deepEqual(state.revealed, []); assert.equal(state.phase, "playing");
});
test("matched cards stay locked and the final pair wins", () => {
  let state = newGame(["a", "b", "a", "b"]);
  state = flip(flip(state, 0), 2); assert.equal(flip(state, 0), state);
  state = flip(flip(state, 1), 3); assert.equal(state.phase, "won"); assert.equal(state.moves, 2);
  assert.equal(flip(state, -1), state);
});
test("best score parsing ignores malformed or impossible stored values", () => {
  for (const value of [null, "NaN", "1", "-9", "9.5", "Infinity", "8abc"]) assert.equal(readBest(value), null);
  assert.equal(readBest("12"), 12);
});
