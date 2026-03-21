import skinsConfig from "../../../config/skins.config.json";
import { useSettings } from "../../../state/settings/settings.context";
import { cn } from "../../../lib/cn";
import {
  optionCardClass,
  optionCardSelectedClass,
  optionGridClass,
  optionMetaClass,
  optionTitleClass,
  optionUploadClass,
  tabHeadingClass,
  tabShellClass,
} from "../customizeUi";

export default function SkinsTab() {
  const { settings, setSettings } = useSettings();

  const selectSkin = (side: "x" | "o", id: string) => {
    setSettings((prev) => ({
      ...prev,
      skins: {
        ...prev.skins,
        [side]: id,
      },
    }));
  };

  const handleUpload = (side: "x" | "o", file?: File) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setSettings((prev) => ({
        ...prev,
        skins: {
          ...prev.skins,
          [side]: "custom",
          custom: {
            ...prev.skins.custom,
            [side]: result,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={tabShellClass}>
      <div>
        <h2 className={tabHeadingClass}>X Skins</h2>
        <div className={optionGridClass}>
          {skinsConfig.xSkins.map((skin) => (
            <button
              key={skin.id}
              type="button"
              className={cn(
                optionCardClass,
                settings.skins.x === skin.id && optionCardSelectedClass,
              )}
              onClick={() => selectSkin("x", skin.id)}
            >
              <span className={optionTitleClass}>{skin.label}</span>
              <span className={optionMetaClass}>ID: {skin.id}</span>
            </button>
          ))}
          <label className={cn(optionCardClass, settings.skins.x === "custom" && optionCardSelectedClass)}>
            <span className={optionTitleClass}>Custom X</span>
            <span className={optionMetaClass}>Upload a PNG or SVG</span>
            <input
              className={optionUploadClass}
              type="file"
              accept="image/png,image/svg+xml"
              onChange={(event) => handleUpload("x", event.target.files?.[0])}
            />
          </label>
        </div>
      </div>

      <div>
        <h2 className={tabHeadingClass}>O Skins</h2>
        <div className={optionGridClass}>
          {skinsConfig.oSkins.map((skin) => (
            <button
              key={skin.id}
              type="button"
              className={cn(
                optionCardClass,
                settings.skins.o === skin.id && optionCardSelectedClass,
              )}
              onClick={() => selectSkin("o", skin.id)}
            >
              <span className={optionTitleClass}>{skin.label}</span>
              <span className={optionMetaClass}>ID: {skin.id}</span>
            </button>
          ))}
          <label className={cn(optionCardClass, settings.skins.o === "custom" && optionCardSelectedClass)}>
            <span className={optionTitleClass}>Custom O</span>
            <span className={optionMetaClass}>Upload a PNG or SVG</span>
            <input
              className={optionUploadClass}
              type="file"
              accept="image/png,image/svg+xml"
              onChange={(event) => handleUpload("o", event.target.files?.[0])}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
