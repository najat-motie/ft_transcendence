import soundsConfig from "../../../config/sounds.config.json";
import { useSettings } from "../../../state/settings/settings.context";
import { cn } from "../../../lib/cn";
import {
  optionCardClass,
  optionCardSelectedClass,
  optionGridClass,
  optionMetaClass,
  optionTitleClass,
  sliderRowClass,
  sliderValueClass,
  soundControlsClass,
  tabHeadingClass,
  tabShellClass,
  toggleActiveClass,
  toggleClass,
} from "../customizeUi";

export default function SoundTab() {
  const { settings, setSettings } = useSettings();

  const playPreview = (id: string) => {
    if (!settings.sound.enabled) {
      return;
    }

    const src = new URL(`../../../assets/sounds/${id}.wav`, import.meta.url).href;
    const audio = new Audio(src);
    audio.volume = settings.sound.volume;
    void audio.play();
  };

  const toggleSound = () => {
    setSettings((prev) => ({
      ...prev,
      sound: {
        ...prev.sound,
        enabled: !prev.sound.enabled,
      },
    }));
  };

  const updateVolume = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      sound: {
        ...prev.sound,
        volume: value,
      },
    }));
  };

  const selectSound = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      sound: {
        ...prev.sound,
        selected: id,
      },
    }));
    playPreview(id);
  };

  return (
    <div className={tabShellClass}>
      <div>
        <h2 className={tabHeadingClass}>Sound</h2>
        <div className={soundControlsClass}>
          <button
            type="button"
            className={cn(toggleClass, settings.sound.enabled && toggleActiveClass)}
            onClick={toggleSound}
          >
            {settings.sound.enabled ? "Sound On" : "Sound Off"}
          </button>
          <div className={optionGridClass}>
            {soundsConfig.sounds.map((sound) => (
              <button
                key={sound.id}
                type="button"
                className={cn(
                  optionCardClass,
                  settings.sound.selected === sound.id && optionCardSelectedClass,
                )}
                onClick={() => selectSound(sound.id)}
              >
                <span className={optionTitleClass}>{sound.label}</span>
                <span className={optionMetaClass}>Tap to preview</span>
              </button>
            ))}
          </div>

          <label className={sliderRowClass}>
            <span>Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              className="accent-[#5ae8ff]"
              value={settings.sound.volume}
              onChange={(event) => updateVolume(Number(event.target.value))}
              disabled={!settings.sound.enabled}
            />
            <span className={sliderValueClass}>{Math.round(settings.sound.volume * 100)}%</span>
          </label>
        </div>
      </div>
    </div>
  );
}
