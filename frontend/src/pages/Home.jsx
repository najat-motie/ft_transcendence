import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../services/auth";
import { cn } from "../lib/cn";
import { slabHeading } from "../lib/ui";

const pageStyle = {
  background: "linear-gradient(180deg, #0b1220 0%, #080d17 100%)",
};

const introStyle = {
  background:
    "radial-gradient(circle at 12% 10%, rgba(56, 189, 248, 0.14), transparent 35%), radial-gradient(circle at 90% 2%, rgba(250, 204, 21, 0.13), transparent 30%), linear-gradient(180deg, #0b1220, #09101d)",
};

const featuresStyle = {
  background: "linear-gradient(180deg, #0c1424 0%, #101a2d 100%)",
};

const joinStyle = {
  background:
    "radial-gradient(circle at 50% 0%, rgba(250, 204, 21, 0.1), transparent 33%), linear-gradient(180deg, #101a2d, #090f1a)",
};

const primaryButtonClass = "inline-flex min-h-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#facc15,#f59e0b)] px-5 py-3 font-bold text-slate-900 shadow-[0_14px_28px_rgba(245,158,11,0.25)] transition duration-200 hover:-translate-y-px hover:shadow-[0_18px_34px_rgba(245,158,11,0.3)] hover:no-underline max-[680px]:flex-1 max-[680px]:basis-full";
const ghostButtonClass = "inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-400/30 bg-slate-900/50 px-5 py-3 font-bold text-slate-200 transition duration-200 hover:-translate-y-px hover:border-slate-400/50 hover:bg-slate-800/70 hover:no-underline max-[680px]:flex-1 max-[680px]:basis-full";
const statCardClass = "rounded-xl border border-slate-400/15 bg-slate-900/50 px-[0.9rem] py-[0.95rem]";
const cellBaseClass = "flex items-center justify-center rounded-[14px] border border-slate-400/25 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(12,19,33,0.95))] text-[clamp(2rem,5vw,2.5rem)] font-extrabold text-slate-200";
const featureCardClass = "rounded-[18px] border border-slate-400/15 bg-[linear-gradient(180deg,rgba(30,41,59,0.8),rgba(15,23,42,0.9))] p-[clamp(1rem,2.2vw,1.55rem)] text-left transition duration-200 hover:-translate-y-[5px] hover:border-sky-400/35 hover:shadow-[0_16px_32px_rgba(2,6,23,0.32)]";
const containerClass = "mx-auto w-full max-w-[1160px] px-[clamp(1rem,3vw,2rem)]";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = getUser();
    setIsLoggedIn(Boolean(session?.user?.userId && session?.accessToken));
  }, []);

  return (
    <div className="min-h-screen" style={pageStyle}>
      <section className="relative py-[clamp(2.5rem,7vw,5.5rem)]" style={introStyle}>
        <div className={cn(containerClass, "grid items-center gap-[clamp(1.5rem,4vw,3.5rem)] min-[981px]:grid-cols-[1.1fr_0.9fr]")}>
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/35 bg-yellow-400/12 px-[0.8rem] py-[0.4rem] text-[0.76rem] font-bold uppercase tracking-[0.08em] text-yellow-100">
              Live Multiplayer Arena
            </span>
            <h1 className={cn(slabHeading, "mb-4 text-[clamp(2rem,4.6vw,4rem)] leading-[1.05] tracking-[-0.03em] text-slate-50")}>
              Play Tic-Tac-Toe Online
            </h1>
            <p className="m-0 max-w-[58ch] text-[clamp(1rem,1.35vw,1.16rem)] leading-[1.75] text-slate-400">
              Challenge friends or players worldwide in quick, tactical matches.
              Jump into ranked games, train against AI, or run private room battles.
            </p>

            <div className="mt-[1.7rem] flex flex-wrap gap-[0.8rem]">
              <Link to="/play" className={primaryButtonClass}>Play Now</Link>
              {isLoggedIn ? (
                <Link to="/profile" className={ghostButtonClass}>My Profile</Link>
              ) : (
                <Link to="/register" className={ghostButtonClass}>Create Account</Link>
              )}
            </div>

            <div className="mt-[1.8rem] grid gap-[0.7rem] min-[681px]:grid-cols-3 max-[680px]:grid-cols-1" aria-label="Platform statistics">
              <div className={statCardClass}>
                <strong className="mb-[0.28rem] block text-[0.88rem] text-slate-50">5 Modes</strong>
                <span className="text-[0.76rem] leading-[1.4] text-slate-400">Online, local, AI and more</span>
              </div>
              <div className={statCardClass}>
                <strong className="mb-[0.28rem] block text-[0.88rem] text-slate-50">Real Time</strong>
                <span className="text-[0.76rem] leading-[1.4] text-slate-400">Low-latency live matches</span>
              </div>
              <div className={statCardClass}>
                <strong className="mb-[0.28rem] block text-[0.88rem] text-slate-50">Friends First</strong>
                <span className="text-[0.76rem] leading-[1.4] text-slate-400">Private rooms and invites</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[360px] rounded-[24px] border border-slate-400/15 bg-[linear-gradient(180deg,rgba(30,41,59,0.92),rgba(15,23,42,0.9))] p-[clamp(0.8rem,2vw,1.1rem)] shadow-[0_24px_54px_rgba(2,6,23,0.44)] min-[981px]:max-w-[360px] max-[980px]:max-w-[420px]" aria-hidden="true">
            <div className="grid aspect-square grid-cols-3 gap-2">
              <div className={`${cellBaseClass} text-sky-400 [text-shadow:0_0_12px_rgba(56,189,248,0.42)]`}>X</div>
              <div className={`${cellBaseClass} text-yellow-400 [text-shadow:0_0_12px_rgba(250,204,21,0.34)]`}>O</div>
              <div className={cellBaseClass}></div>
              <div className={cellBaseClass}></div>
              <div className={`${cellBaseClass} text-sky-400 [text-shadow:0_0_12px_rgba(56,189,248,0.42)]`}>X</div>
              <div className={cellBaseClass}></div>
              <div className={`${cellBaseClass} text-yellow-400 [text-shadow:0_0_12px_rgba(250,204,21,0.34)]`}>O</div>
              <div className={cellBaseClass}></div>
              <div className={cellBaseClass}></div>
            </div>
            <div className="absolute bottom-4 right-4 rounded-full border border-sky-400/25 bg-sky-400/15 px-[0.7rem] py-[0.42rem] text-[0.72rem] font-bold uppercase tracking-[0.06em] text-sky-300 max-[680px]:bottom-[0.8rem] max-[680px]:right-[0.8rem]">
              Your move
            </div>
          </div>
        </div>
      </section>

      <section className="py-[clamp(2.5rem,6vw,5rem)]" style={featuresStyle}>
        <div className={containerClass}>
          <h2 className={cn(slabHeading, "mb-[clamp(1.2rem,2.8vw,2.3rem)] text-center text-[clamp(1.55rem,3vw,2.3rem)] text-slate-50")}>
            Why Play Here?
          </h2>
          <div className="grid gap-[clamp(0.9rem,2vw,1.4rem)] min-[981px]:grid-cols-3 min-[681px]:grid-cols-2 max-[680px]:grid-cols-1">
            <article className={featureCardClass}>
              <span className="mb-[0.8rem] inline-flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-[10px] bg-sky-400/15 text-[1.2rem]">👥</span>
              <h3 className={cn(slabHeading, "mb-[0.4rem] text-[1.05rem] text-slate-50")}>Friends System</h3>
              <p className="m-0 text-[0.95rem] leading-[1.62] text-slate-400">Add friends, see who's online, and play together anytime.</p>
            </article>

            <article className={featureCardClass}>
              <span className="mb-[0.8rem] inline-flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-[10px] bg-sky-400/15 text-[1.2rem]">🌍</span>
              <h3 className={cn(slabHeading, "mb-[0.4rem] text-[1.05rem] text-slate-50")}>Play Worldwide</h3>
              <p className="m-0 text-[0.95rem] leading-[1.62] text-slate-400">Challenge players from anywhere in real time.</p>
            </article>

            <article className={featureCardClass}>
              <span className="mb-[0.8rem] inline-flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-[10px] bg-sky-400/15 text-[1.2rem]">🤖</span>
              <h3 className={cn(slabHeading, "mb-[0.4rem] text-[1.05rem] text-slate-50")}>Smart AI</h3>
              <p className="m-0 text-[0.95rem] leading-[1.62] text-slate-400">Train your strategy against human-like AI.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-[clamp(2.8rem,7vw,6rem)]" style={joinStyle}>
        <div className={cn(containerClass, "rounded-[24px] border border-slate-400/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(10,17,29,0.9))] px-[clamp(1.4rem,3vw,2.2rem)] py-[clamp(1.4rem,3vw,2.2rem)] text-center")}>
          <h2 className={cn(slabHeading, "mb-[0.7rem] text-[clamp(1.5rem,2.8vw,2.35rem)] text-slate-50")}>
            Ready to dominate the board?
          </h2>
          <p className="mb-[1.4rem] text-[clamp(0.98rem,1.4vw,1.08rem)] text-slate-400">
            Sign up now and start winning matches today.
          </p>
          <Link to="/register" className={primaryButtonClass}>Get Started</Link>
        </div>
      </section>
    </div>
  );
}
