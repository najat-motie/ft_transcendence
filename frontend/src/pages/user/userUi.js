import { cn } from "../../lib/cn";
import {
  blueButton,
  emptyState,
  frostedPanel,
  goldButton,
  goldPill,
  ghostButton,
  greenButton,
  inputSky,
  listItem,
  redButton,
  slabHeading,
} from "../../lib/ui";

export const friendsPageStyle = {
  background:
    "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 26%), radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.1), transparent 22%), linear-gradient(180deg, #0b1220 0%, #09111d 100%)",
};

export const profilePageStyle = {
  background:
    "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 26%), radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.1), transparent 20%), linear-gradient(180deg, #0b1220 0%, #09111d 100%)",
};

export const userPageShell = "min-h-screen px-[clamp(1rem,3vw,2rem)] py-[clamp(1rem,3vw,2rem)] text-slate-200";
export const userContainer = "mx-auto grid w-full max-w-[1180px] gap-[clamp(1rem,2.4vw,1.5rem)]";

export const topbarClass = `${frostedPanel} flex items-start justify-between gap-4 p-[clamp(1.2rem,2.6vw,1.8rem)] max-[720px]:flex-col`;
export const topbarHeadingClass = cn(slabHeading, "mt-[0.7rem] mb-[0.35rem] text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] text-slate-50");
export const kickerClass = goldPill;
export const mutedClass = "text-slate-400";

export const heroGridClass = "grid gap-[clamp(1rem,2.4vw,1.5rem)] min-[981px]:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]";
export const identityCardClass = `${frostedPanel} grid content-start gap-4 p-[clamp(1.2rem,2.6vw,1.8rem)]`;
export const statsPanelClass = `${frostedPanel} grid gap-4 p-[clamp(1.2rem,2.6vw,1.8rem)]`;
export const avatarClass = "h-[140px] w-[140px] rounded-[28px] border-2 border-white/10 object-cover shadow-[0_18px_34px_rgba(2,6,23,0.36)]";
export const chipClass = "rounded-full border border-slate-400/20 bg-slate-400/15 px-[0.8rem] py-[0.45rem] text-[0.78rem] text-slate-200";
export const subtleChipClass = "rounded-full border border-slate-400/20 bg-slate-400/10 px-[0.8rem] py-[0.45rem] text-[0.78rem] text-slate-300";
export const miniStatsGridClass = "grid gap-3 min-[721px]:grid-cols-3 max-[720px]:grid-cols-1";
export const miniStatClass = "grid gap-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-[0.95rem]";
export const buttonRowClass = "flex flex-wrap gap-3 max-[560px]:flex-col";
export const formLabelClass = "grid gap-[0.4rem] text-[0.82rem] uppercase tracking-[0.04em] text-slate-300";
export const formInputClass = inputSky;
export const formTextAreaClass = `${inputSky} min-h-[120px] resize-y`;
export const headlineGridClass = "grid gap-[0.85rem] [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]";
export const headlineCardClass = "rounded-[18px] border border-slate-400/15 bg-white/[0.04] px-[1.1rem] py-4";
export const detailGridClass = "grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]";
export const detailCardClass = "rounded-[18px] border border-slate-400/15 bg-white/[0.04] px-4 py-[0.95rem]";
export const errorBlockClass = `${frostedPanel} flex flex-col items-center gap-4 p-[clamp(1.5rem,4vw,2.5rem)] text-center`;

export const socialCardClass = cn(frostedPanel, "grid gap-4 p-[clamp(1rem,2.2vw,1.35rem)]");
export const socialCardHeadClass = "flex items-start justify-between gap-4";
export const socialEyebrowClass = goldPill;
export const socialCountClass = "inline-grid h-[38px] min-w-[38px] place-items-center rounded-full border border-sky-400/25 bg-sky-400/15 px-[0.7rem] font-bold text-sky-200";
export const searchBarClass = "grid gap-3 min-[641px]:grid-cols-[1fr_auto]";
export const searchInputClass = inputSky;
export const listClass = "grid gap-3";
export const socialItemClass = `${listItem} max-[640px]:flex-col max-[640px]:items-stretch`;
export const requestCopyClass = "grid gap-[0.18rem]";
export const primarySmallButtonClass = blueButton;
export const acceptButtonClass = greenButton;
export const rejectButtonClass = redButton;
export const cancelButtonClass = redButton;
export const pendingButtonClass = "inline-flex items-center justify-center rounded-xl bg-slate-400/20 px-[0.9rem] py-[0.7rem] font-bold text-slate-300";
export const removeButtonClass = redButton;
export const quickActionButtonClass = ghostButton;
export const mainActionButtonClass = goldButton;
export const requestActionsClass = "flex flex-wrap justify-end gap-[0.55rem] max-[640px]:justify-stretch";
export const emptyStateClass = emptyState;

export function statusDotClass(online) {
  return online
    ? "h-[14px] w-[14px] rounded-full bg-green-500 shadow-[0_0_0_5px_rgba(34,197,94,0.12),0_0_10px_rgba(34,197,94,0.45)]"
    : "h-[14px] w-[14px] rounded-full bg-slate-500 shadow-[0_0_0_5px_rgba(100,116,139,0.12)]";
}
