import effectsConfig from "../../../config/effects.config.json";
import { useSettings } from "../../../state/settings/settings.context";
import { cn } from "../../../lib/cn";
import {
  optionCardCheckboxClass,
  optionCardClass,
  optionGridClass,
  optionMetaClass,
  tabHeadingClass,
  tabShellClass,
  toggleActiveClass,
  toggleClass,
} from "../customizeUi";

export default function EffectsTab() {
  const { settings, setSettings } = useSettings();

  const toggleEffects = () => {
    setSettings((prev) => ({
      ...prev,
      effects: {
        ...prev.effects,
        enabled: !prev.effects.enabled,
      },
    }));
  };

  const toggleEffect = (id: string) => {
    setSettings((prev) => {
      const active = prev.effects.active.includes(id)
        ? prev.effects.active.filter((effectId) => effectId !== id)
        : [...prev.effects.active, id];

      return {
        ...prev,
        effects: {
          ...prev.effects,
          active,
        },
      };
    });
  };

  return (
    <div className={tabShellClass}>
      <div>
        <h2 className={tabHeadingClass}>Visual Effects</h2>
        <button
          type="button"
          className={cn(toggleClass, settings.effects.enabled && toggleActiveClass)}
          onClick={toggleEffects}
        >
          {settings.effects.enabled ? "Effects On" : "Effects Off"}
        </button>
        <div className={optionGridClass}>
          {effectsConfig.effects.map((effect) => (
            <label key={effect.id} className={cn(optionCardClass, optionCardCheckboxClass)}>
              <input
                type="checkbox"
                checked={settings.effects.active.includes(effect.id)}
                onChange={() => toggleEffect(effect.id)}
                disabled={!settings.effects.enabled}
              />
              <span>
                <strong>{effect.label}</strong>
                <span className={optionMetaClass}>{effect.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
