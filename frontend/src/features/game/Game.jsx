import PreviewBoard from "../customize/preview/PreviewBoard";
import { useSettings } from "../../state/settings/settings.context";
import { frostedPanel, mutedText, slabHeading } from "../../lib/ui";
import { cn } from "../../lib/cn";

export default function Game() {
  const { settings } = useSettings();

  return (
    <section className="mt-5 grid gap-5">
      <div className={`${frostedPanel} px-5 py-4`}>
        <h2 className={cn(slabHeading, "mb-[10px] text-slate-50")}>Game Settings</h2>
        <div className={`grid gap-1.5 ${mutedText}`}>
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
