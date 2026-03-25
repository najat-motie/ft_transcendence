import { cn } from "../../lib/cn";
import {
  blueButton,
  dangerGhostButton,
  frostedPanel,
  frostedPanelStrong,
  ghostButton,
  goldPill,
  inputSky,
  redButton,
  slabHeading,
  subtleButton,
} from "../../lib/ui";

export const lobbyPageStyle = {
  background:
    "radial-gradient(circle at top left, rgba(56, 189, 248, 0.15), transparent 28%), radial-gradient(circle at top right, rgba(250, 204, 21, 0.12), transparent 24%), linear-gradient(180deg, #0b1220 0%, #09111d 100%)",
};

export const roomPageStyle = { background: "#0f172a" };
export const matchmakingPageStyle = {
  background:
    "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 28%), radial-gradient(circle at top right, rgba(250, 204, 21, 0.1), transparent 24%), linear-gradient(180deg, #0b1220 0%, #09111d 100%)",
};

export const playShellClass = `${frostedPanel} mx-auto w-full max-w-[1180px] px-[clamp(1.25rem,3vw,3rem)] py-[clamp(1.25rem,3vw,3rem)]`;
export const playCardClass = "flex min-h-full flex-col justify-between gap-6 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,41,59,0.94),rgba(15,23,42,0.92))] p-[clamp(1.1rem,2vw,1.6rem)] backdrop-blur-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-200 hover:-translate-y-1.5 hover:border-yellow-400/30 hover:shadow-[0_18px_35px_rgba(2,6,23,0.28)]";
export const playCardButtonClass = "inline-flex min-h-12 w-full items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#facc15,#f59e0b)] px-4 py-[0.85rem] text-[0.98rem] font-bold text-slate-900 transition duration-200 hover:brightness-105";

export const actionSectionClass = "flex min-h-screen items-start justify-center px-[clamp(1rem,4vw,3rem)] py-[clamp(1rem,4vw,3rem)] text-slate-200";
export const actionContainerClass = `${frostedPanelStrong} mt-[clamp(2rem,8vw,5rem)] w-full max-w-[480px] p-[clamp(1.5rem,5vw,2.5rem)] text-center`;
export const actionHeadingClass = cn(slabHeading, "mb-[0.3rem] text-[clamp(1.3rem,3vw,1.65rem)] text-slate-100");
export const actionLeadClass = "mb-6 text-[0.9rem] leading-[1.6] text-slate-400";
export const roomCodeClass = "inline-flex items-center justify-center rounded-[14px] border border-sky-400/25 bg-sky-400/10 px-7 py-[0.7rem] text-[clamp(1.5rem,4.5vw,2rem)] font-extrabold tracking-[0.3em] text-sky-400";
export const roomInputClass = `${inputSky} mx-auto mb-6 block max-w-[300px] text-center text-[1.15rem] font-bold tracking-[0.25em] [font-variant-numeric:tabular-nums] placeholder:tracking-[0.1em]`;
export const roomPlayerItemClass = "flex items-center gap-[0.6rem] rounded-xl border border-white/10 bg-white/[0.04] px-[0.9rem] py-[0.6rem] text-left text-[0.875rem] text-slate-200";
export const actionPrimaryClass = blueButton;
export const actionGhostClass = ghostButton;

export const roomSectionClass = "flex min-h-screen items-start justify-center px-[clamp(1rem,3vw,2rem)] py-[clamp(1rem,3vw,2rem)] text-slate-200";
export const roomContainerClass = `${frostedPanelStrong} mt-[clamp(1rem,4vw,2.5rem)] w-full max-w-[520px] p-[clamp(1.25rem,3vw,2rem)] text-center`;
export const roomTitleClass = cn(slabHeading, "mb-[0.3rem] text-[clamp(1.15rem,2.5vw,1.55rem)] text-slate-100");
export const statusTextClass = "flex items-center justify-center gap-2 text-[0.8rem] text-slate-400";
export const gameMessageClass = "my-[0.4rem] min-h-[1.2em] text-[0.875rem] text-slate-400";
export const playerCardClass = "my-[0.6rem] rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-[0.85rem]";
export const playerInfoClass = "flex items-center gap-3";
export const playerAvatarClass = "h-11 w-11 shrink-0 rounded-[10px] border border-white/10 object-cover";
export const turnIndicatorClass = "mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-[0.35rem] text-[0.875rem] font-semibold text-slate-100";
export const boardShellClass = "my-3";
export const boardToolbarClass = "mb-[0.65rem] flex flex-wrap items-center justify-between gap-3 max-[480px]:flex-col max-[480px]:items-start";
export const boardMetaClass = "flex items-center gap-2 text-[0.875rem] text-slate-200";
export const boardChipClass = "rounded-full border border-white/10 bg-white/[0.07] px-2 py-[3px] text-[0.7rem] uppercase tracking-[0.05em] text-slate-400";
export const boardActionsClass = "flex gap-2";
export const boardBaseClass = "mx-auto grid w-full max-w-[min(380px,88vw)] grid-cols-3 gap-[clamp(8px,1.8vw,14px)]";
export const boardFrameClass = "rounded-[18px] p-[10px]";
export const cellBaseClass = "flex aspect-square items-center justify-center rounded-[clamp(10px,1.8vw,16px)] border border-white/10 bg-[#0f1e30] text-[clamp(1.25rem,5.5vw,2.25rem)] font-extrabold text-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition duration-150 enabled:hover:scale-105 enabled:hover:bg-[#1a3049] disabled:cursor-default";
export const cellBackgroundClass = "bg-[rgba(8,15,28,0.72)]";
export const cellGlowClass = "shadow-[0_0_14px_rgba(59,130,246,0.45),0_4px_12px_rgba(0,0,0,0.35)]";
export const cellXClass = "text-sky-400 [text-shadow:0_0_16px_rgba(56,189,248,0.5)]";
export const cellOClass = "text-orange-400 [text-shadow:0_0_16px_rgba(251,146,60,0.5)]";
export const boardSkinClass = "block h-[58%] w-[58%] object-contain";

export const winnerBaseClass = "my-3 rounded-2xl px-6 py-3 text-center text-[clamp(0.95rem,2.5vw,1.15rem)] font-bold text-white shadow-[0_8px_24px_rgba(34,197,94,0.28)]";
export const winnerWinClass = `${winnerBaseClass} bg-[linear-gradient(135deg,#22c55e_0%,#16a34a_100%)]`;
export const winnerLoseClass = `${winnerBaseClass} bg-[linear-gradient(135deg,#ef4444_0%,#b91c1c_100%)] shadow-[0_8px_24px_rgba(239,68,68,0.28)]`;
export const winnerTieClass = `${winnerBaseClass} bg-[linear-gradient(135deg,#facc15_0%,#ca8a04_100%)] text-stone-900 shadow-[0_8px_24px_rgba(250,204,21,0.28)]`;

export const secondaryBoardButtonClass = subtleButton;
export const secondaryDangerBoardButtonClass = dangerGhostButton;
export const roomButtonsClass = "mt-6 flex flex-wrap justify-center gap-3";
export const primaryRoomButtonClass = blueButton;
export const dangerRoomButtonClass = redButton;

export const matchmakingContainerClass = `${frostedPanelStrong} mt-[clamp(1rem,5vw,3rem)] w-full max-w-[780px] p-[clamp(1.35rem,4vw,2.4rem)] text-center`;
export const matchmakingKickerClass = goldPill;
export const matchmakingStageClass = "grid items-center gap-[clamp(1rem,3vw,2rem)] min-[821px]:grid-cols-[minmax(220px,0.95fr)_minmax(0,1.05fr)]";
export const matchmakingStatusCardClass = "grid justify-items-start gap-[0.65rem] rounded-[22px] border border-white/10 bg-white/[0.04] p-[clamp(1rem,2.2vw,1.4rem)] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]";
export const matchmakingStepClass = "flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-[0.95rem] text-left";
export const matchmakingStepActiveClass = "border-sky-400/25 bg-sky-400/10";
export const matchmakingStepBadgeClass = "grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-slate-400/15 font-bold text-slate-300";
export const matchmakingStepBadgeActiveClass = "bg-sky-400 text-sky-950 shadow-[0_0_16px_rgba(56,189,248,0.35)]";
export const matchmakingMetaCardClass = "grid gap-1 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-[0.95rem] text-left";

export const modeBackButtonClass = actionGhostClass;
export const modePrimaryButtonClass = actionPrimaryClass;
export const roomRestartButtonClass = secondaryBoardButtonClass;
export const roomLeaveButtonClass = secondaryDangerBoardButtonClass;
export const roomBottomPrimaryClass = primaryRoomButtonClass;
export const roomBottomDangerClass = dangerRoomButtonClass;
