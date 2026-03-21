import { useMemo } from "react";
import skinsConfig from "../../../config/skins.config.json";
import boardsConfig from "../../../config/boards.config.json";
import { useSettings } from "../../../state/settings/settings.context";
import { cn } from "../../../lib/cn";
import {
  frostedCustomizeCardClass,
  previewBoardBgClass,
  previewBoardClass,
  previewCellClass,
  previewEyebrowClass,
  previewHeaderClass,
  previewHeadingClass,
  previewMarkClass,
  previewMetaClass,
  previewOClass,
  previewXClass,
} from "../customizeUi";

const sampleGrid = ["x", "o", "", "", "x", "", "o", "", ""];

const findSkinLabel = (side: "x" | "o", id: string) => {
  const list = side === "x" ? skinsConfig.xSkins : skinsConfig.oSkins;
  return list.find((skin) => skin.id === id)?.label ?? id;
};

const findBoardLabel = (id: string) =>
  boardsConfig.themes.find((theme) => theme.id === id)?.label ?? id;

const boardImages = import.meta.glob("/src/assets/boards/*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const skinImages = import.meta.glob("/src/assets/skins/*/*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const getSkinSrc = (side: "x" | "o", id: string) =>
  skinImages[`/src/assets/skins/${side}/${id}.svg`] ?? "";

const getBoardSrc = (id: string) => boardImages[`/src/assets/boards/${id}.svg`] ?? "";

export default function PreviewBoard() {
  const { settings } = useSettings();

  const xLabel = useMemo(() => findSkinLabel("x", settings.skins.x), [settings.skins.x]);
  const oLabel = useMemo(() => findSkinLabel("o", settings.skins.o), [settings.skins.o]);
  const boardLabel = useMemo(() => findBoardLabel(settings.board.theme), [settings.board.theme]);
  const xSrc = useMemo(
    () => (settings.skins.x === "custom" ? settings.skins.custom.x : getSkinSrc("x", settings.skins.x)),
    [settings.skins.x, settings.skins.custom.x],
  );
  const oSrc = useMemo(
    () => (settings.skins.o === "custom" ? settings.skins.custom.o : getSkinSrc("o", settings.skins.o)),
    [settings.skins.o, settings.skins.custom.o],
  );
  const boardSrc = useMemo(() => getBoardSrc(settings.board.theme), [settings.board.theme]);

  const renderMark = (cell: string) => {
    if (cell === "x") {
      return xSrc ? <img className={previewMarkClass} src={xSrc} alt={xLabel} /> : "X";
    }

    if (cell === "o") {
      return oSrc ? <img className={previewMarkClass} src={oSrc} alt={oLabel} /> : "O";
    }

    return "";
  };

  return (
    <div className={cn(frostedCustomizeCardClass, "grid gap-5 content-start")}>
      <div className={previewHeaderClass}>
        <div>
          <p className={previewEyebrowClass}>Live Preview</p>
          <h2 className={previewHeadingClass}>{boardLabel}</h2>
        </div>
        <div className={previewMetaClass}>
          <span>X: {xLabel}</span>
          <span>O: {oLabel}</span>
        </div>
      </div>

      <div className={previewBoardClass}>
        {boardSrc ? (
          <img className={previewBoardBgClass} src={boardSrc} alt={boardLabel} />
        ) : null}
        {sampleGrid.map((cell, index) => (
          <div
            key={`${cell}-${index}`}
            className={cn(
              previewCellClass,
              cell === "x" && previewXClass,
              cell === "o" && previewOClass,
            )}
          >
            {renderMark(cell)}
          </div>
        ))}
      </div>
    </div>
  );
}
