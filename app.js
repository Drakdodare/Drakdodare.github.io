// Tell js-dos where to load its wasm/modules from (since we're loading js-dos from js-dos.com).
// The docs recommend setting emulators.pathPrefix in this situation. :contentReference[oaicite:2]{index=2}
emulators.pathPrefix = "https://js-dos.com/v7/build/releases/latest/js-dos/";

const statusEl = document.getElementById("status");
const listEl = document.getElementById("gameList");
const fileInput = document.getElementById("fileInput");
const stopBtn = document.getElementById("stopBtn");

const jsdosRoot = document.getElementById("jsdos");

// Create player instance (UI mounts into jsdosRoot)
const player = Dos(jsdosRoot);

// Command Interface returned by .run() lets us exit/stop etc. :contentReference[oaicite:3]{index=3}
let ci = null;
let activeId = null;

function setStatus(msg) {
  statusEl.textContent = msg;
}

function setStopEnabled(enabled) {
  stopBtn.disabled = !enabled;
}

async function stopRunning() {
  if (!ci) return;
  try {
    setStatus("Stopping…");
    await ci.exit(); // :contentReference[oaicite:4]{index=4}
  } catch (e) {
    console.warn("Exit error:", e);
  } finally {
    ci = null;
    activeId = null;
    setStopEnabled(false);
    markActive(null);
    setStatus("Ready.");
  }
}

function markActive(id) {
  [...document.querySelectorAll(".game")].forEach((el) => {
    el.classList.toggle("game--active", el.dataset.id === id);
  });
}

async function runBundle(bundleUrl, { id = null, title = "Running…" } = {}) {
  // Stop prior instance first
  if (ci) await stopRunning();

  setStatus(`Loading: ${title}`);
  setStopEnabled(true);
  activeId = id;
  markActive(id);

  try {
    // v7: Dos(element).run("some.jsdos") :contentReference[oaicite:5]{index=5}
    ci = await player.run(bundleUrl);

    // Optional: hook exit event
    ci.events().onExit(() => {
      ci = null;
      activeId = null;
      setStopEnabled(false);
      markActive(null);
      setStatus("Exited.");
    });

    setStatus(`Running: ${title}`);
  } catch (e) {
    console.error(e);
    setStatus(`Failed to start: ${title}`);
    setStopEnabled(false);
    markActive(null);
    ci = null;
  }
}

// Hosted games manifest
async function loadManifest() {
  try {
    const url = new URL("./games/manifest.json", window.location.href);
    // Bust caching while editing
    url.searchParams.set("v", Date.now().toString());

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`manifest.json HTTP ${res.status}`);
    const games = await res.json();

    renderGameList(games);
    setStatus("Ready.");
  } catch (e) {
    console.error(e);
    setStatus("Could not load games/manifest.json");
    listEl.innerHTML = `
      <div class="game">
        <div class="game__title">Manifest missing</div>
        <div class="game__meta">Create /games/manifest.json to list hosted games.</div>
      </div>
    `;
  }
}

function renderGameList(games) {
  listEl.innerHTML = "";

  for (const g of games) {
    const card = document.createElement("div");
    card.className = "game";
    card.dataset.id = g.id;

    card.innerHTML = `
      <div class="game__title">${escapeHtml(g.title ?? g.id)}</div>
      <div class="game__meta">${escapeHtml(g.description ?? g.bundle)}</div>
    `;

    card.addEventListener("click", async () => {
      const bundleUrl = new URL(g.bundle, window.location.href).toString();
      await runBundle(bundleUrl, { id: g.id, title: g.title ?? g.id });
    });

    listEl.appendChild(card);
  }
}

// Local file run (does NOT upload to GitHub; runs from your browser session)
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  fileInput.value = ""; // let user pick same file again

  if (!file) return;

  const blobUrl = URL.createObjectURL(file);
  await runBundle(blobUrl, { id: null, title: file.name });

  // Clean up the blob URL later (after it started)
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
});

// Drag & drop anywhere
window.addEventListener("dragover", (e) => {
  e.preventDefault();
});
window.addEventListener("drop", async (e) => {
  e.preventDefault();
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  const blobUrl = URL.createObjectURL(file);
  await runBundle(blobUrl, { id: null, title: file.name });
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
});

stopBtn.addEventListener("click", stopRunning);

// Helpers
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadManifest();
