const boardImages = import.meta.glob("/src/assets/boards/*.svg", {
  eager: true,
  import: "default",
});

const skinImages = import.meta.glob("/src/assets/skins/*/*.svg", {
  eager: true,
  import: "default",
});

const getSkinSrc = (side, id, customDataUrl = "") => {
  if (id === "custom" && customDataUrl) return customDataUrl;
  return skinImages[`/src/assets/skins/${side}/${id}.svg`] || "";
};

const getBoardSrc = (id) => boardImages[`/src/assets/boards/${id}.svg`] || "";

export const resolveSkinAssets = (settings) => {
  const xSrc = getSkinSrc("x", settings.skins.x, settings.skins.custom.x);
  const oSrc = getSkinSrc("o", settings.skins.o, settings.skins.custom.o);
  const boardSrc = getBoardSrc(settings.board.theme);
  return { xSrc, oSrc, boardSrc };
};
