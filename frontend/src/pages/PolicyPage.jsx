import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiShield,
  FiLock,
  FiGlobe,
  FiUserCheck,
  FiClock,
} from "react-icons/fi";
import { cn } from "../lib/cn";
import { slabHeading } from "../lib/ui";

const pageStyle = {
  background:
    "radial-gradient(1200px at 18% 18%, rgba(250, 204, 21, 0.08), transparent 45%), radial-gradient(900px at 82% 12%, rgba(37, 99, 235, 0.08), transparent 42%), #050915",
};

const heroClass = "relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(9,12,28,0.96))] px-8 py-9 shadow-[0_26px_48px_rgba(0,0,0,0.45)] max-[700px]:px-[22px] max-[700px]:py-[30px]";
const cardClass = "rounded-[18px] border border-white/10 bg-[linear-gradient(145deg,rgba(12,17,32,0.95),rgba(9,13,25,0.98))] px-[22px] pb-5 pt-[22px] shadow-[0_18px_38px_rgba(0,0,0,0.35)]";
const metaClass = "inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.04] px-3 py-1.5 text-[0.95rem] text-slate-400";
const primaryButtonClass = "inline-flex items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(120deg,#facc15,#eab308)] px-4 py-3 font-semibold text-slate-950 shadow-[0_14px_32px_rgba(250,204,21,0.28)] transition hover:-translate-y-0.5 hover:no-underline hover:shadow-[0_18px_42px_rgba(250,204,21,0.35)]";
const ghostButtonClass = "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:no-underline";
const listItemClass = "flex items-start gap-3 text-[0.96rem] leading-[1.55] text-slate-200";
const listDotClass = "mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400 shadow-[0_0_0_5px_rgba(250,204,21,0.12)]";

export default function PrivacyPolicy() {

  useEffect(() => {
    document.title = "ft_transcendence - Privacy Policy";
  }, []);

  return (
    <div className="min-h-screen text-slate-200" style={pageStyle}>
      <div className="mx-auto w-full max-w-[1100px] px-6 pb-[120px] pt-[88px] max-[700px]:px-4 max-[700px]:pb-24 max-[700px]:pt-[68px]">
        <header className={heroClass}>
          <div className="pointer-events-none absolute right-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.32)_0%,rgba(250,204,21,0)_65%)] opacity-80 blur-[18px]"></div>
          <p className="text-[0.85rem] font-bold uppercase tracking-[0.08em] text-yellow-400">Privacy first</p>
          <div className="my-[10px] flex flex-col gap-2">
            <h1 className={cn(slabHeading, "m-0 text-[clamp(2rem,3vw+1rem,2.6rem)] text-yellow-100")}>Privacy Policy</h1>
            <p className="max-w-[680px] text-base text-slate-300">
              We keep personal data lean, transparent, and under your control so
              you can focus on the fun parts of ft_transcendence.
            </p>
          </div>

          <div className="my-[18px] flex flex-wrap gap-[14px] text-[0.95rem]">
            <span className={metaClass}>Last updated: March 12, 2026</span>
            <span className={metaClass}>Applies to: ft_transcendence web client & API</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 max-[700px]:flex-col">
            <Link to="/" className={primaryButtonClass}>
              Go to Home
            </Link>
            <Link to="/terms-of-service" className={ghostButtonClass}>
              View Terms of Service
            </Link>
          </div>
        </header>

        <div className="mt-7 grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiShield />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>What we collect</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">Only what we need to run the game and your account.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span><strong>Account basics:</strong> username, email, and hashed password for sign-in and recovery.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span><strong>Gameplay context:</strong> match settings, scores, and friends list so you can replay and reconnect.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span><strong>Device signals:</strong> standard logs (IP, browser, OS) to keep fraud out and performance stable.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span><strong>Cookies:</strong> session cookies that keep you logged in; no ad or tracking pixels.</span></li>
            </ul>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-600/25 bg-blue-600/15 px-[10px] py-1.5 text-[0.85rem] font-semibold text-blue-200">
              No selling or sharing of personal data
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiGlobe />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>How we use it</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">To deliver gameplay, support, and safety only.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span>Run authentication, matchmaking, leaderboards, and cross-device sync.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Detect abuse (spam, cheating) and secure accounts with anomaly checks.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Improve stability through aggregated performance metrics; any analytics is de-identified.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Respond to support requests and product feedback you share with us.</span></li>
            </ul>
          </section>

          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiUserCheck />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>Your controls</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">Manage, export, or delete your data when you need to.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span>Update profile details or change your password any time in <Link to="/profile" className="text-yellow-400 hover:underline">Profile</Link> and <Link to="/change-password" className="text-yellow-400 hover:underline">Security</Link>.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Request an export or deletion by emailing <a href="mailto:privacy@ft-transcendence.local" className="text-yellow-400 hover:underline">privacy@ft-transcendence.local</a>. We confirm identity before actioning requests.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Opt out of non-essential emails via in-app notifications or the unsubscribe link.</span></li>
            </ul>
          </section>

          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiLock />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>Security & retention</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">Modern safeguards, with data kept only while it is useful.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span>Passwords are hashed; sensitive traffic is encrypted in transit; access is role-based.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>We keep server logs briefly for security investigations and then purge them.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Backups are encrypted and rotated; we test restores regularly.</span></li>
            </ul>
            <div className="mt-[10px] text-[0.94rem] text-slate-400">
              If a breach ever impacts your data, we will notify you and outline
              steps we are taking to remedy it.
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiClock />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>Updates to this policy</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">We will always publish the effective date up top.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span>Material changes will be highlighted in-app before they take effect.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Continued use after an update means you accept the revised policy.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>We keep prior versions on file; request one if you need it.</span></li>
            </ul>
          </section>
        </div>

        <div className="mt-7 text-[0.92rem] leading-[1.6] text-slate-400">
          Questions or concerns? Email{" "}
          <a href="mailto:privacy@ft-transcendence.local" className="text-yellow-400 hover:underline">
            privacy@ft-transcendence.local
          </a>{" "}
          and we will get back within a reasonable timeframe.
        </div>
      </div>
    </div>
  );
}
