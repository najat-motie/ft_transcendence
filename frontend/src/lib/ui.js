import { cn } from "./cn";

export const slabHeading = "font-['Roboto_Slab',serif]";
export const customizeFont = "font-['Space_Grotesk',sans-serif]";
export const customizeHeading = "font-['Fraunces',serif]";

export const frostedPanel = cn(
  "rounded-[28px] border border-slate-400/12",
  "[background:linear-gradient(180deg,rgba(15,23,42,0.8),rgba(15,23,42,0.94)),radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_44%)]",
  "shadow-[0_24px_60px_rgba(2,6,23,0.34)]",
);

export const frostedPanelStrong = cn(
  "rounded-[28px] border border-slate-400/12",
  "[background:linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.95)),radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_46%)]",
  "shadow-[0_24px_60px_rgba(2,6,23,0.44)]",
);

export const frostedCard = cn(
  "rounded-[24px] border border-white/10",
  "[background:linear-gradient(180deg,rgba(30,41,59,0.94),rgba(15,23,42,0.92))]",
);

export const goldPill = "inline-flex w-fit items-center justify-center rounded-full border border-yellow-400/25 bg-yellow-400/12 px-[0.85rem] py-[0.45rem] text-[0.76rem] font-bold uppercase tracking-[0.08em] text-amber-200";
export const bluePill = "inline-flex w-fit items-center justify-center rounded-full border border-sky-400/25 bg-sky-400/12 px-[0.85rem] py-[0.45rem] text-[0.76rem] font-bold uppercase tracking-[0.08em] text-sky-200";
export const mutedText = "text-slate-400";

export const alertError = "m-0 rounded-[14px] border border-red-500/25 bg-red-500/10 px-[0.95rem] py-3 text-sm leading-[1.5] text-red-200";
export const alertSuccess = "m-0 rounded-[14px] border border-green-500/25 bg-green-500/10 px-[0.95rem] py-3 text-sm leading-[1.5] text-green-100";
export const alertInfo = "m-0 rounded-[14px] border border-sky-400/25 bg-sky-400/10 px-[0.95rem] py-3 text-sm leading-[1.5] text-sky-100";
export const emptyState = "m-0 rounded-[14px] border border-dashed border-slate-400/20 bg-white/[0.03] px-[0.95rem] py-3 leading-[1.5] text-slate-400";

export const formLabel = "mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300";

export const inputSky = "w-full rounded-[14px] border border-slate-400/20 bg-slate-950/70 px-4 py-[0.85rem] text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/55 focus:bg-slate-950/90 focus:ring-[3px] focus:ring-sky-400/12";
export const inputGold = "w-full rounded-[14px] border border-slate-400/20 bg-slate-950/70 px-4 py-[0.85rem] text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400/55 focus:bg-slate-950/90 focus:ring-[3px] focus:ring-yellow-400/12";
export const textareaGold = `${inputGold} min-h-[110px] resize-y`;
export const textareaSky = `${inputSky} min-h-[120px] resize-y`;
export const fileInputGold = `${inputGold} px-[0.9rem] py-[0.7rem]`;

export const buttonBase = "inline-flex items-center justify-center rounded-[14px] font-bold transition duration-150 disabled:cursor-not-allowed disabled:opacity-65";
export const goldButton = `${buttonBase} bg-[linear-gradient(135deg,#facc15_0%,#eab308_100%)] px-4 py-[0.9rem] font-extrabold text-stone-900 shadow-[0_16px_26px_rgba(250,204,21,0.22)] hover:-translate-y-px hover:brightness-[1.03]`;
export const blueButton = `${buttonBase} bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_100%)] px-4 py-[0.85rem] text-sky-50 shadow-[0_12px_24px_rgba(37,99,235,0.22)] hover:-translate-y-px`;
export const greenButton = `${buttonBase} bg-[linear-gradient(135deg,#22c55e_0%,#16a34a_100%)] px-[0.9rem] py-[0.7rem] text-white shadow-[0_10px_22px_rgba(34,197,94,0.22)] hover:-translate-y-px`;
export const redButton = `${buttonBase} bg-[linear-gradient(135deg,#ef4444_0%,#b91c1c_100%)] px-[0.9rem] py-[0.7rem] text-white shadow-[0_10px_22px_rgba(239,68,68,0.22)] hover:-translate-y-px`;
export const ghostButton = `${buttonBase} border border-slate-400/20 bg-white/[0.04] px-4 py-3 text-slate-200 hover:-translate-y-px hover:brightness-[1.03]`;
export const subtleButton = `${buttonBase} border border-slate-200/12 bg-white/[0.06] px-4 py-[0.55rem] text-sm font-semibold text-slate-200 hover:-translate-y-px hover:bg-white/[0.12]`;
export const dangerGhostButton = `${buttonBase} border border-red-500/30 bg-transparent px-4 py-[0.55rem] text-sm font-semibold text-red-300 hover:-translate-y-px hover:border-red-500/50 hover:bg-red-500/10`;
export const disabledButton = `${buttonBase} bg-slate-400/20 px-[0.9rem] py-[0.7rem] text-slate-300`;

export const socialCard = cn(
  frostedPanel,
  "grid gap-4 p-[clamp(1rem,2.2vw,1.35rem)]",
);

export const listItem = "flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-[0.95rem] transition hover:border-slate-400/20 hover:bg-white/[0.07]";
