import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadSettings, resetSettings as resetStoredSettings, saveSettings } from "./settings.storage";
import type { Settings } from "./settings.types";

interface SettingsContextValue {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const resetSettings = () => {
    const next = resetStoredSettings();
    setSettings(next);
  };

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      resetSettings,
    }),
    [settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
};
