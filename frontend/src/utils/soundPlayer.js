const soundImports = {
  place: () => import("../assets/sounds/place.wav"),
  win: () => import("../assets/sounds/win.wav"),
};

let cache = {};

export const playSound = async (id = "place", volume = 0.8) => {
  try {
    if (!soundImports[id]) return;
    if (!cache[id]) {
      const mod = await soundImports[id]();
      cache[id] = new Audio(mod.default ?? mod);
    }
    const audio = cache[id].cloneNode(true);
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.play().catch(() => {});
  } catch {
    // ignore playback errors (browser permission, etc.)
  }
};
