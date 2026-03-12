import skinsConfig from "../../config/skins.config.json";
import boardsConfig from "../../config/boards.config.json";
import effectsConfig from "../../config/effects.config.json";
import soundsConfig from "../../config/sounds.config.json";
import { defaultSettings } from "./settings.defaults";
import type { Settings } from "./settings.types";

const STORAGE_KEY = "ftt:settings";

const validXSkins = new Set(skinsConfig.xSkins.map((skin) => skin.id));
const validOSkins = new Set(skinsConfig.oSkins.map((skin) => skin.id));
const validBoards = new Set(boardsConfig.themes.map((theme) => theme.id));
const validEffects = new Set(effectsConfig.effects.map((effect) => effect.id));
const validSounds = new Set(soundsConfig.sounds.map((sound) => sound.id));

const isBrowser = typeof window !== "undefined";

const normalizeBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const normalizeNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const normalizeString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const normalizeDataUrl = (value: unknown) =>
  typeof value === "string" && value.startsWith("data:") ? value : "";

const normalizeEffectList = (value: unknown, fallback: string[]) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const filtered = value.filter((id) => typeof id === "string" && validEffects.has(id));
  return filtered.length ? filtered : fallback;
};

export const normalizeSettings = (raw: unknown): Settings => {
  if (!raw || typeof raw !== "object") {
    return { ...defaultSettings };
  }

  const input = raw as Partial<Settings>;
  const next = { ...defaultSettings };

  const xSkin = normalizeString(input.skins?.x, next.skins.x);
  const oSkin = normalizeString(input.skins?.o, next.skins.o);
  const customX = normalizeDataUrl(input.skins?.custom?.x);
  const customO = normalizeDataUrl(input.skins?.custom?.o);
  const resolvedX = xSkin === "custom" && customX ? "custom" : xSkin;
  const resolvedO = oSkin === "custom" && customO ? "custom" : oSkin;
  next.skins = {
    x: resolvedX === "custom" || validXSkins.has(resolvedX) ? resolvedX : next.skins.x,
    o: resolvedO === "custom" || validOSkins.has(resolvedO) ? resolvedO : next.skins.o,
    custom: {
      x: customX,
      o: customO,
    },
  };

  const theme = normalizeString(input.board?.theme, next.board.theme);
  next.board = {
    theme: validBoards.has(theme) ? theme : next.board.theme,
  };

  next.sound = {
    enabled: normalizeBoolean(input.sound?.enabled, next.sound.enabled),
    volume: Math.min(1, Math.max(0, normalizeNumber(input.sound?.volume, next.sound.volume))),
    selected: validSounds.has(input.sound?.selected ?? "")
      ? (input.sound?.selected as string)
      : next.sound.selected,
  };

  next.effects = {
    enabled: normalizeBoolean(input.effects?.enabled, next.effects.enabled),
    active: normalizeEffectList(input.effects?.active, next.effects.active),
  };

  return next;
};

export const loadSettings = (): Settings => {
  if (!isBrowser) {
    return { ...defaultSettings };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaultSettings };
    }

    return normalizeSettings(JSON.parse(raw));
  } catch {
    return { ...defaultSettings };
  }
};

export const saveSettings = (settings: Settings) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const exportSettings = (): string => {
  const settings = loadSettings();
  return JSON.stringify(settings, null, 2);
};

export const resetSettings = (): Settings => {
  if (!isBrowser) {
    return { ...defaultSettings };
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
  return { ...defaultSettings };
};
