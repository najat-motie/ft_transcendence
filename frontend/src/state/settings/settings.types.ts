export type SkinId = string;
export type BoardThemeId = string;
export type EffectId = string;

export interface SkinsSettings {
  x: SkinId;
  o: SkinId;
  custom: {
    x: string;
    o: string;
  };
}

export interface BoardSettings {
  theme: BoardThemeId;
}

export interface SoundSettings {
  enabled: boolean;
  volume: number;
  selected: string;
}

export interface EffectsSettings {
  enabled: boolean;
  active: EffectId[];
}

export interface Settings {
  skins: SkinsSettings;
  board: BoardSettings;
  sound: SoundSettings;
  effects: EffectsSettings;
}
