import { cn } from "../../lib/cn";
import { customizeFont, customizeHeading } from "../../lib/ui";

export const customizePageStyle = {
  background: "#0f1629",
};

export const customizePageClass = cn(
  customizeFont,
  "relative min-h-[calc(100vh-14em)] overflow-hidden rounded-[24px] p-8 text-[#e6edf7] max-[900px]:min-h-[calc(100vh-32px)] max-[900px]:p-5",
);

export const customizeOverlayClass = "pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_20%_20%,rgba(90,232,255,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(134,255,185,0.08),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(90,232,255,0.05),transparent_40%)]";
export const customizeHeaderClass = "relative z-[1] flex items-start justify-between gap-6 max-[900px]:flex-col";
export const customizeTitleClass = `${customizeHeading} my-2 text-[40px]`;
export const customizeEyebrowClass = "m-0 text-xs uppercase tracking-[0.18em] text-[#9ba3b5]";
export const customizeSubtitleClass = "m-0 max-w-[520px] text-[#9ba3b5]";
export const customizeActionsClass = "flex flex-wrap gap-3";
export const customizeSaveButtonClass = "rounded-full bg-[#5ae8ff] px-[18px] py-3 font-semibold text-white shadow-[0_12px_24px_rgba(213,122,42,0.25)] transition hover:-translate-y-px hover:shadow-[0_16px_32px_rgba(213,122,42,0.3)]";
export const customizeResetButtonClass = "rounded-full border border-white/10 bg-white/[0.06] px-[18px] py-3 font-semibold text-[#e6edf7] transition hover:-translate-y-px hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]";
export const customizeBodyClass = "relative z-[1] mt-8 grid gap-6";
export const customizeNavClass = "flex flex-wrap gap-3";
export const customizeNavButtonClass = "rounded-full border border-white/10 bg-white/[0.04] px-[18px] py-[10px] font-semibold text-[#e6edf7] transition";
export const customizeNavButtonActiveClass = "border-transparent bg-[#5ae8ff] text-[#05101c] shadow-[0_10px_24px_rgba(90,232,255,0.25)]";
export const customizeContentClass = "grid gap-6 min-[901px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]";
export const frostedCustomizeCardClass = "rounded-[20px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)]";
export const previewHeaderClass = "flex items-baseline justify-between gap-4";
export const previewEyebrowClass = "mb-[6px] text-[11px] uppercase tracking-[0.18em] text-[#9ba3b5]";
export const previewHeadingClass = `${customizeHeading} text-2xl`;
export const previewMetaClass = "grid gap-1 text-xs text-[#9ba3b5]";
export const previewBoardClass = "relative grid grid-cols-3 gap-2 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#162034,#0f182b)] p-4";
export const previewBoardBgClass = "absolute inset-0 h-full w-full object-cover";
export const previewCellClass = "relative z-[1] grid h-[72px] place-items-center rounded-xl border border-white/10 bg-[rgba(15,22,41,0.75)] text-[28px] font-bold text-[#e6edf7]";
export const previewMarkClass = "h-11 w-11 object-contain";
export const previewXClass = "text-[#86ffb9]";
export const previewOClass = "text-[#2f5d86]";
export const customizePanelClass = `${frostedCustomizeCardClass} transition duration-300`;
export const tabShellClass = "grid gap-5";
export const tabHeadingClass = `${customizeHeading} mb-3 text-xl`;
export const optionGridClass = "grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]";
export const optionCardClass = "grid gap-1.5 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left text-[#e6edf7] transition hover:-translate-y-0.5 hover:border-[#5ae8ff]/40 hover:shadow-[0_12px_26px_rgba(0,0,0,0.25)]";
export const optionCardSelectedClass = "border-[#5ae8ff] shadow-[0_14px_28px_rgba(90,232,255,0.25)]";
export const optionCardCheckboxClass = "grid grid-cols-[auto_1fr] items-start gap-[10px]";
export const optionUploadClass = "mt-2.5 text-xs";
export const optionTitleClass = "font-semibold";
export const optionMetaClass = "block text-xs text-[#9ba3b5]";
export const toggleClass = "mb-4 rounded-full border border-white/10 bg-white/70 px-[18px] py-[10px] font-semibold text-slate-900";
export const toggleActiveClass = "border-transparent bg-[#5ae8ff] text-white";
export const soundControlsClass = "grid gap-4";
export const sliderRowClass = "grid items-center gap-3 font-medium min-[721px]:grid-cols-[120px_1fr_60px]";
export const sliderValueClass = "text-right text-[#9ba3b5]";
