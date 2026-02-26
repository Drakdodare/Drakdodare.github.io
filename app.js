// 1) Add your hosted games here (files must exist in /bundles/)
const HOSTED_GAMES = [
  // Example:
  // { title: "Digger", file: "digger.jsdos" },
  // { title: "My Cool Game", file: "my-cool-game.jsdos" },
];

const els = {
  dos: document.getElementById("dos"),
  status: document.getElementById("status"),
  hostedSelect: document.getElementById("hostedSelect"),
  playHosted: document.getElementById("playHosted"),
  fileInput: document.getElementById("fileInput"),
  fullscreen: document.getElementById("fullscreen"),
  stop: document.getElementById("stop"),
};

let player = null;             // DosProps
let lastBlobUrl = null;        // blob URL for local uploads
let isFullscreen = false;

function setStatus(msg) {
  els.status.textContent = msg;
}

function clearDosContainer() {
  // js-dos renders UI into this element; clearing helps when recreating the player
  els.dos.innerHTML = "";
}

function stopPlayer() {
  try {
    if (player) player.stop(); // Player API: stop() disposes the player :contentReference[oaicite:2]{index=2}
  } catch (e) {
    console.warn("stop() failed:", e);
  } finally {
    player = null;
    isFullscreen = false;
  }

  if (lastBlobUrl) {
    URL.revokeObjectURL(lastBlobUrl);
    lastBlobUrl = null;
  }

  clearDosContainer();
}

function bootBundle(url, label) {
  stopPlayer();
  setStatus(`Loading: ${label}`);

  // Create a new js-dos player instance
  // Player API: Dos(element, options) where options.url points to bundle :contentReference[oaicite:3]{index=3}
  player = Dos(els.dos, {
    url,
    autoStart: true,      // start immediately (otherwise user clicks Play in js-dos UI)
    noNetworking: true,
    noCloud: true,

    // If you hit browser/hosting limitations, you can experiment with this:
    // workerThread: false,
  });

  setStatus(`Running: ${label}`);
}

function populateHosted() {
  els.hostedSelect.innerHTML = "";

  if (!HOSTED_GAMES.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "— Add games in app.js (HOSTED_GAMES) —";
    els.hostedSelect.appendChild(opt);
    els.playHosted.disabled = true;
    return;
  }

  for (const g of HOSTED_GAMES) {
    const opt = document.createElement("option");
    opt.value = g.file;
    opt.textContent = g.title;
    els.hostedSelect.appendChild(opt);
  }

  els.playHosted.disabled = false;
}

els.playHosted.addEventListener("click", () => {
  const file = els.hostedSelect.value;
  if (!file) return;
  const url = `./bundles/${encodeURIComponent(file)}`;
  const label = HOSTED_GAMES.find(g => g.file === file)?.title ?? file;
  bootBundle(url, label);
});

els.fileInput.addEventListener("change", () => {
  const file = els.fileInput.files?.[0];
  if (!file) return;

  // Runs locally in-browser. This does NOT upload to GitHub Pages.
  lastBlobUrl = URL.createObjectURL(file);
  bootBundle(lastBlobUrl, file.name);

  // allow picking same file again later
  els.fileInput.value = "";
});

els.fullscreen.addEventListener("click", () => {
  if (!player) return;
  isFullscreen = !isFullscreen;

  try {
    // Player API: setFullScreen(boolean) :contentReference[oaicite:4]{index=4}
    player.setFullScreen(isFullscreen);
  } catch (e) {
    console.warn("setFullScreen failed:", e);
    isFullscreen = false;
  }
});

els.stop.addEventListener("click", () => {
  stopPlayer();
  setStatus("Stopped");
});

// Init
populateHosted();
setStatus("Ready — choose a hosted game or upload a .jsdos");
