import { flip, hideMismatch, newGame, readBest } from "./game.js";
const board = document.querySelector("#board"), moves = document.querySelector("#moves"), bestLabel = document.querySelector("#best"), status = document.querySelector("#status");
const artwork = {
  LEMON: "M4 17C1 9 10 2 18 6L21 3L20 8C23 16 14 23 6 19L3 22Z M7 15C5 11 10 6 15 8",
  DISCO: "M12 1V4 M3 13A9 9 0 1 0 21 13A9 9 0 1 0 3 13 M12 4C7 8 7 18 12 22C17 18 17 8 12 4 M4 9H20 M3 14H21 M5 19H19",
  UFO: "M6 11C6 2 18 2 18 11 M2 13C2 8 22 8 22 13C22 18 2 18 2 13Z M6 19L4 22 M12 19V23 M18 19L20 22",
  SHROOM: "M2 12C2 -1 22 -1 22 12Z M9 12V21H15V12 M7 8H8 M15 6H16 M16 10H17",
  BEATS: "M4 14V10C4 -1 20 -1 20 10V14 M4 11H7V21H4C1 21 1 11 4 11Z M20 11H17V21H20C23 21 23 11 20 11Z",
  DINO: "M3 18L1 12L8 15L12 11V4H22V10H17V16L14 19V23H11V19H7V23H4V19Z M18 7H19 M17 13H20",
  CACTUS: "M10 22V5C10 1 15 1 15 5V22 M10 14H5C1 14 2 8 2 7C2 4 6 4 6 7V10H10 M15 17H19C23 17 22 11 22 10C22 7 18 7 18 10V13H15 M7 22H18",
  SOCK: "M10 2H20V15L11 22C3 25 -1 17 5 14L10 11Z M10 6H20 M5 14L11 19"
};
let state = newGame(), mismatchTimer, best = null;
try { best = readBest(localStorage.getItem("odd-pairs-best")); } catch { /* Scores are optional. */ }
function render() {
  moves.textContent = String(state.moves); bestLabel.textContent = best === null ? "—" : String(best);
  board.replaceChildren(...state.cards.map((symbol, index) => {
    const card = document.createElement("button"), visible = state.revealed.includes(index) || state.matched.includes(index);
    card.type = "button"; card.className = "card" + (visible ? " revealed" : "") + (state.matched.includes(index) ? " matched" : "");
    card.textContent = visible ? "" : "?";
    if (visible) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"), path = document.createElementNS("http://www.w3.org/2000/svg", "path"), caption = document.createElement("span");
      svg.setAttribute("viewBox", "0 0 24 26"); svg.setAttribute("aria-hidden", "true");
      path.setAttribute("d", artwork[symbol]); svg.append(path);
      caption.textContent = symbol; card.append(svg, caption);
    }
    card.setAttribute("aria-label", `Card ${index + 1}: ${visible ? symbol : "hidden"}`);
    card.disabled = state.phase !== "playing" || visible;
    card.addEventListener("click", () => {
      state = flip(state, index);
      if (state.phase === "waiting") mismatchTimer = setTimeout(() => { state = hideMismatch(state); render(); }, 850);
      if (state.phase === "won" && (best === null || state.moves < best)) {
        best = state.moves; try { localStorage.setItem("odd-pairs-best", String(best)); } catch { /* Play without persistence. */ }
      }
      render();
      // Rebuilding the board must not leave keyboard users without a focus target.
      const next = [...board.querySelectorAll("button")].find((button, i) => i > index && !button.disabled) ?? board.querySelector("button:not(:disabled)");
      next?.focus({ preventScroll: true });
    });
    return card;
  }));
  status.textContent = state.phase === "won" ? `All eight pairs found in ${state.moves} moves. Nice work!` : state.phase === "waiting" ? "Not quite. Remember those two." : `${state.matched.length / 2} of 8 pairs found. Pick a card.`;
}
document.querySelector("#restart").addEventListener("click", () => { clearTimeout(mismatchTimer); state = newGame(); render(); });
render();
