/* global Dos */

// A “works immediately” sample bundle from the official js-dos docs:
const DIGGER_SAMPLE = "https://v8.js-dos.com/bundles/digger.jsdos";

// Add your own bundles later like: "./bundles/mygame.jsdos"
const GAMES = [
  { name: "Digger (sample – proves setup works)", url: DIGGER_SAMPLE },

  // Examples (uncomment after you add files under /bundles):
  // { name: "My Game", url: "./bundles/mygame.jsdos" },
  // { name: "Another Game", url: "./bundles/another.jsdos" },
];

const els = {
  dos: document.getElementById("dos"),
  select: document.getElementById("gameSelect"),
  start: document.getElementById("btnStart"),
  stop: document.getElementById("btnStop"),
  fullscreen: document.getElementById("btnFullscreen"),
  status: document.getElementById("status"),
};

let player = null;
let isFullscreen = false;

function setStatus(text) {
  els.status.textContent = text;
}

function fillSelect() {
  for (const g of GAMES) {
    const opt = document.createElement("option");
    opt.value = g.url;
    opt.textContent = g.name;
    els.select.appendChild(opt);
  }
}

function stopPlayer() {
  if (player) {
    try {
      player.stop(); // frees resources (official Player API)
    } catch (e) {
      // ignore, but show minimal info
      console.warn("stop() failed:", e);
    }
  }
  player = null;
  isFullscreen = false;

  els.stop.disabled = true;
  els.fullscreen.disabled = true;
  els.start.disabled = false;

  // Clear container so re-create is clean
  els.dos.innerHTML = "";
  setStatus("Stopped");
}

function startPlayer(url) {
  stopPlayer();
  setStatus("Loading…");

  // Create the player; autoStart launches immediately.
  // Options list is from the official Player API.
  player = Dos(els.dos, {
    url,
    autoStart: true,
    noCloud: true,
    // Feel free to tweak:
    // kiosk: false,
    // renderAspect: "Fit",
    // imageRendering: "pixelated",
    onEvent: (event, arg) => {
      if (event === "emu-ready") setStatus("Emulator ready");
      if (event === "bnd-play") setStatus("Running");
      if (event === "fullscreen-changed") {
        isFullscreen = Boolean(arg);
        els.fullscreen.textContent = isFullscreen ? "Exit Fullscreen" : "Fullscreen";
      }
    },
  });

  els.stop.disabled = false;
  els.fullscreen.disabled = false;
  els.start.disabled = true;

  setStatus("Starting…");
}

function toggleFullscreen() {
  if (!player) return;
  player.setFullScreen(!isFullscreen);
}

fillSelect();

els.start.addEventListener("click", () => startPlayer(els.select.value));
els.stop.addEventListener("click", stopPlayer);
els.fullscreen.addEventListener("click", toggleFullscreen);

// Auto-start the first entry (so it “just works” when you publish)
startPlayer(GAMES[0].url);
