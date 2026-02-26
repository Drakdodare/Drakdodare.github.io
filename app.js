/* global Dos */

const DEFAULT_BUNDLE = "https://v8.js-dos.com/bundles/digger.jsdos"; // demo bundle from docs :contentReference[oaicite:2]{index=2}

let props = null;
let lastObjectUrl = null;

const elDos = document.getElementById("dos");
const elStatus = document.getElementById("status");
const elUrl = document.getElementById("bundleUrl");
const elFile = document.getElementById("bundleFile");

document.getElementById("btnDemo").addEventListener("click", () => runBundle(DEFAULT_BUNDLE));
document.getElementById("btnRunUrl").addEventListener("click", () => {
  const url = elUrl.value.trim();
  if (!url) return setStatus("Paste a .jsdos URL/path first.");
  runBundle(url);
});
document.getElementById("btnStop").addEventListener("click", stop);

elFile.addEventListener("change", () => {
  const file = elFile.files?.[0];
  if (!file) return;

  // .jsdos is a zip bundle; we can run it via an object URL
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
  lastObjectUrl = URL.createObjectURL(file);
  runBundle(lastObjectUrl);
});

function setStatus(msg) {
  elStatus.textContent = msg;
}

async function stop() {
  try {
    if (props) await props.stop(); // stop/dispose player :contentReference[oaicite:3]{index=3}
  } catch (_) {
    // ignore
  } finally {
    props = null;
    elDos.innerHTML = "";
    setStatus("Stopped.");
  }
}

async function runBundle(url) {
  await stop();

  setStatus(`Loading bundle: ${url}`);

  // Create a new player instance each run
  props = Dos(elDos, {
    url,
    autoStart: true, // auto-run (option listed in Player API) :contentReference[oaicite:4]{index=4}
    onEvent: (event) => {
      if (event === "emu-ready") setStatus("Emulator ready…");
      if (event === "ci-ready") setStatus("Running.");
      if (event === "fullscreen-changed") setStatus("Fullscreen toggled.");
    },
  });
}

// Auto-run via query string (?bundle=...)
(function bootFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const bundle = params.get("bundle");
  if (bundle) runBundle(bundle);
})();
