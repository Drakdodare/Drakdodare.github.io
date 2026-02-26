/* global Dos */
function wireUi() {
  populateGames();

  el("btnBoot").addEventListener("click", async () => {
    const url = el("gameSelect").value;
    await boot(url);
  });

  el("btnEject").addEventListener("click", stopPlayer);

  el("btnFullscreen").addEventListener("click", () => {
    if (!state.player) return;
    state.player.setFullScreen(!state.isFullScreen);
  });

  el("btnMouse").addEventListener("click", () => {
    if (!state.player) return;
    state.mouseLocked = !state.mouseLocked;
    state.player.setMouseCapture(state.mouseLocked);
    el("btnMouse").textContent = state.mouseLocked ? "MOUSE ON" : "MOUSE LOCK";
    setStatus(state.mouseLocked ? "Mouse capture enabled (Esc usually releases)." : "Mouse capture disabled.");
  });

  // Dropzone / file picker
  const dz = el("dropzone");
  const input = el("fileInput");

  dz.addEventListener("click", () => input.click());
  dz.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") input.click();
  });

  dz.addEventListener("dragover", (e) => {
    e.preventDefault();
    dz.classList.add("dragover");
  });

  dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));

  dz.addEventListener("drop", async (e) => {
    e.preventDefault();
    dz.classList.remove("dragover");
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    await bootLocalFile(file);
  });

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    await bootLocalFile(file);
  });
}

async function bootLocalFile(file) {
  if (!file.name.toLowerCase().endsWith(".jsdos")) {
    setStatus("That file is not a .jsdos bundle.");
    return;
  }

  if (state.objectUrl) {
    URL.revokeObjectURL(state.objectUrl);
    state.objectUrl = null;
  }

  state.objectUrl = URL.createObjectURL(file);

  // Add a temporary entry to the select so it’s visible
  const sel = el("gameSelect");
  const opt = document.createElement("option");
  opt.value = state.objectUrl;
  opt.textContent = `Local bundle: ${file.name}`;
  sel.insertBefore(opt, sel.firstChild);
  sel.value = state.objectUrl;

  await boot(state.objectUrl);
}

window.addEventListener("DOMContentLoaded", () => {
  setButtons(false);
  setStatus("Idle. Choose a game and hit BOOT.");
  wireUi();
});
