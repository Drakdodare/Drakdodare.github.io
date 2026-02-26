/* global Dos */

(() => {
  // ---- CONFIG: edit your game list here ----
  const GAMES = [
    {
      id: "digger",
      name: "Digger (demo)",
      // You can also download/copy this bundle into /games and point to "./games/digger.jsdos"
      url: "https://v8.js-dos.com/bundles/digger.jsdos",
    },
    { id: "keen1", name: "Commander Keen 1 (your bundle)", url: "./games/keen1.jsdos" },
    { id: "doom1", name: "DOOM Shareware (your bundle)", url: "./games/doom1.jsdos" },
  ];

  // ---- DOM ----
  const dosEl = document.getElementById("dos");
  const gameSelect = document.getElementById("gameSelect");
  const statusLine = document.getElementById("statusLine");
  const btnPlay = document.getElementById("btnPlay");
  const btnStop = document.getElementById("btnStop");
  const btnFull = document.getElementById("btnFull");
  const btnPixel = document.getElementById("btnPixel");
  const vol = document.getElementById("vol");
  const localBundle = document.getElementById("localBundle");

  // ---- js-dos player instance ----
  /** @type {ReturnType<typeof Dos> | null} */
  let props = null;

  let pixelMode = true;
  let currentGameId = null;

  const setStatus = (msg) => { statusLine.textContent = msg; };

  const getGameById = (id) => GAMES.find(g => g.id === id) || null;

  // hash routing: #keen1
  const readHashGame = () => {
    const h = (location.hash || "").replace("#", "").trim();
    return h || null;
  };

  const writeHashGame = (id) => {
    if (!id) return;
    if (location.hash.replace("#", "") !== id) location.hash = id;
  };

  const safeStop = async () => {
    if (!props) return;
    try {
      setStatus("STOPPING…");
      await props.stop(); // fully disposes the player
    } catch (e) {
      // ignore; we'll still reset DOM
    } finally {
      props = null;
      dosEl.innerHTML = "";
      setStatus("READY");
    }
  };

  const boot = async (url, label = "BOOTING…") => {
    if (!url) return;

    setStatus(label);

    // Dispose previous instance
    if (props) await safeStop();

    // Create fresh instance
    dosEl.innerHTML = "";

    props = Dos(dosEl, {
      url,
      autoStart: true,
      theme: "retro",
      noCloud: true,
      noNetworking: true,
      renderAspect: "Fit",
      imageRendering: pixelMode ? "pixelated" : "smooth",
      volume: Number(vol.value || 0.85),
      onEvent: (event, arg) => {
        if (event === "emu-ready") setStatus("EMULATOR READY");
        if (event === "ci-ready") setStatus("RUNNING");
        if (event === "fullscreen-changed") setStatus(`FULLSCREEN: ${arg ? "ON" : "OFF"}`);
      },
    });
  };

  // ---- UI wiring ----
  const populateGames = () => {
    gameSelect.innerHTML = "";
    for (const g of GAMES) {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.name;
      gameSelect.appendChild(opt);
    }
  };

  const selectGame = async (id) => {
    const g = getGameById(id);
    if (!g) {
      setStatus("UNKNOWN GAME ID");
      return;
    }
    currentGameId = g.id;
    gameSelect.value = g.id;
    writeHashGame(g.id);
    await boot(g.url, `LOADING: ${g.name}`);
  };

  btnPlay.addEventListener("click", async () => {
    const id = gameSelect.value;
    await selectGame(id);
  });

  btnStop.addEventListener("click", async () => {
    await safeStop();
  });

  btnFull.addEventListener("click", async () => {
    if (!props) {
      setStatus("NO GAME RUNNING");
      return;
    }
    try {
      props.setFullScreen(true);
    } catch {
      setStatus("FULLSCREEN FAILED (BROWSER POLICY?)");
    }
  });

  btnPixel.addEventListener("click", async () => {
    pixelMode = !pixelMode;
    btnPixel.setAttribute("aria-pressed", String(pixelMode));
    btnPixel.textContent = `PIXEL MODE: ${pixelMode ? "ON" : "OFF"}`;

    // Apply live if running
    if (props) {
      try {
        props.setImageRendering(pixelMode ? "pixelated" : "smooth");
        setStatus(`RENDER: ${pixelMode ? "PIXELATED" : "SMOOTH"}`);
      } catch {
        setStatus("RENDER MODE CHANGE FAILED");
      }
    }
  });

  vol.addEventListener("input", () => {
    if (!props) return;
    try {
      props.setVolume(Number(vol.value));
    } catch {
      // ignore
    }
  });

  localBundle.addEventListener("change", async () => {
    const f = localBundle.files && localBundle.files[0];
    if (!f) return;

    // Create a blob URL so js-dos can fetch it
    const blobUrl = URL.createObjectURL(f);
    currentGameId = null;
    setStatus(`LOADING LOCAL: ${f.name}`);
    await boot(blobUrl, `LOADING LOCAL: ${f.name}`);
  });

  window.addEventListener("hashchange", async () => {
    const id = readHashGame();
    if (!id) return;
    if (id === currentGameId) return;
    if (getGameById(id)) await selectGame(id);
  });

  // ---- Starfield background ----
  const startStarfield = () => {
    const canvas = document.getElementById("starfield");
    const ctx = canvas.getContext("2d", { alpha: true });

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0, h = 0;

    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      v: 0.2 + Math.random() * 0.8
    }));

    const resize = () => {
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // Subtle gradient fog
      const g = ctx.createRadialGradient(w * 0.6, h * 0.15, 0, w * 0.6, h * 0.15, Math.max(w, h));
      g.addColorStop(0, "rgba(255,43,214,0.08)");
      g.addColorStop(0.5, "rgba(32,227,255,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.y += (0.0015 * s.v);
        if (s.y > 1) { s.y = 0; s.x = Math.random(); }

        const px = s.x * w;
        const py = s.y * h;
        const r = 1 + s.z * 1.5;

        ctx.globalAlpha = 0.25 + s.z * 0.55;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    };

    window.addEventListener("resize", resize);
    resize();
    tick();
  };

  // ---- init ----
  const init = async () => {
    populateGames();

    // default selection: hash > first game
    const fromHash = readHashGame();
    const initial = (fromHash && getGameById(fromHash)) ? fromHash : GAMES[0]?.id;

    if (initial) {
      gameSelect.value = initial;
      await selectGame(initial);
    } else {
      setStatus("NO GAMES CONFIGURED");
    }

    startStarfield();
  };

  init().catch(() => setStatus("INIT FAILED"));
})();
