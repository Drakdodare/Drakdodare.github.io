// Required when loading js-dos from CDN so it can find wasm/modules. :contentReference[oaicite:2]{index=2}
emulators.pathPrefix = "https://js-dos.com/v7/build/releases/latest/js-dos/";

const root = document.getElementById("jsdos");
const stopBtn = document.getElementById("stop");
const restartBtn = document.getElementById("restart");
const fileInput = document.getElementById("file");

const player = Dos(root); // :contentReference[oaicite:3]{index=3}
let ci = null;

async function stop() {
  if (!ci) return;
  try { await ci.exit(); } catch {}
  ci = null;
  stopBtn.disabled = true;
}

async function run(url) {
  await stop();
  stopBtn.disabled = false;

  // Run a js-dos bundle (.jsdos = zip with .jsdos/dosbox.conf). :contentReference[oaicite:4]{index=4}
  ci = await player.run(url);

  ci.events().onExit(() => {
    ci = null;
    stopBtn.disabled = true;
  });
}

// Auto-run hosted Doom bundle
run("bundles/doom.jsdos");

stopBtn.addEventListener("click", stop);
restartBtn.addEventListener("click", () => run("bundles/doom.jsdos"));

// Run local bundle (in-session only; doesn’t upload to GitHub)
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  fileInput.value = "";
  if (!file) return;

  const blobUrl = URL.createObjectURL(file);
  await run(blobUrl);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
});
