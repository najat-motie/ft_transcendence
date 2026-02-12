import skinsConfig from "../../config/skins.config.json";
import boardsConfig from "../../config/boards.config.json";
import effectsConfig from "../../config/effects.config.json";
import soundsConfig from "../../config/sounds.config.json";
import type { Settings } from "./settings.types";

const firstX = skinsConfig.xSkins[0]?.id ?? "";
const firstO = skinsConfig.oSkins[0]?.id ?? "";
const firstBoard = boardsConfig.themes[0]?.id ?? "";
const firstSound = soundsConfig.sounds[0]?.id ?? "";
const defaultEffects = effectsConfig.effects
  .filter((effect) => effect.defaultEnabled)
  .map((effect) => effect.id);

export const defaultSettings: Settings = {
  skins: {
    x: firstX,
    o: firstO,
    custom: {
      x: "",
      o: "",
    },
  },
  board: {
    theme: firstBoard,
  },
  sound: {
    enabled: true,
    volume: 0.8,
    selected: firstSound,
  },
  effects: {
    enabled: true,
    active: defaultEffects,
  },
};
