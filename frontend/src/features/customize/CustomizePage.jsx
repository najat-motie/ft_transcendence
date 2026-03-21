import { useMemo, useState } from "react";
import PreviewBoard from "./preview/PreviewBoard";
import SkinsTab from "./tabs/SkinsTab";
import SoundTab from "./tabs/SoundTab";
import EffectsTab from "./tabs/EffectsTab";
import { useSettings } from "../../state/settings/settings.context";
import { saveSettings } from "../../state/settings/settings.storage";
import { cn } from "../../lib/cn";
import {
  customizeActionsClass,
  customizeBodyClass,
  customizeContentClass,
  customizeEyebrowClass,
  customizeHeaderClass,
  customizeNavButtonActiveClass,
  customizeNavButtonClass,
  customizeNavClass,
  customizeOverlayClass,
  customizePageClass,
  customizePageStyle,
  customizePanelClass,
  customizeResetButtonClass,
  customizeSaveButtonClass,
  customizeSubtitleClass,
  customizeTitleClass,
} from "./customizeUi";

const TAB_DEFS = [
  { id: "skins", label: "Skins" },
  { id: "sound", label: "Sound" },
  { id: "effects", label: "Effects" },
];

const TAB_COMPONENTS = {
  skins: SkinsTab,
  sound: SoundTab,
  effects: EffectsTab,
};

export default function CustomizePage() {
  const [activeTab, setActiveTab] = useState("skins");
  const { resetSettings, settings } = useSettings();

  const ActiveTab = useMemo(() => TAB_COMPONENTS[activeTab], [activeTab]);

  return (
    <section className={customizePageClass} style={customizePageStyle}>
      <div className={customizeOverlayClass}></div>
      <header className={customizeHeaderClass}>
        <div>
          <p className={customizeEyebrowClass}>Personalize your game</p>
          <h1 className={customizeTitleClass}>Customize</h1>
          <p className={customizeSubtitleClass}>
            Dial in skins, effects, and sound. Changes apply instantly.
          </p>
        </div>
        <div className={customizeActionsClass}>
          <button
            className={customizeSaveButtonClass}
            type="button"
            onClick={() => {
              saveSettings(settings);
              console.log(JSON.stringify(settings, null, 2));
            }}
          >
            Save settings
          </button>
          <button className={customizeResetButtonClass} type="button" onClick={resetSettings}>
            Reset to defaults
          </button>
        </div>
      </header>

      <div className={customizeBodyClass}>
        <nav className={customizeNavClass}>
          {TAB_DEFS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cn(
                customizeNavButtonClass,
                activeTab === tab.id && customizeNavButtonActiveClass,
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={customizeContentClass}>
          <PreviewBoard />
          <div className={customizePanelClass}>
            <ActiveTab />
          </div>
        </div>
      </div>
    </section>
  );
}
