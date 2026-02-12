import PreviewBoard from "../customize/preview/PreviewBoard";
import { useSettings } from "../../state/settings/settings.context";
import "../../styles/game.css";

export default function Game() {
  const { settings } = useSettings();

  return (
    <section className="game-shell">
      <div className="game-card">
        <h2>Game Settings</h2>
        <div className="game-meta">
          <span>Board: {settings.board.theme}</span>
          <span>X Skin: {settings.skins.x}</span>
          <span>O Skin: {settings.skins.o}</span>
          <span>Sound: {settings.sound.enabled ? "On" : "Off"}</span>
          <span>Sound Preset: {settings.sound.selected}</span>
          <span>Effects: {settings.effects.enabled ? "On" : "Off"}</span>
        </div>
      </div>
      <PreviewBoard />
    </section>
  );
}
