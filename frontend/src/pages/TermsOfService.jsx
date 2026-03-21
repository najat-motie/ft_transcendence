import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiActivity,
  FiAlertTriangle,
  FiServer,
  FiAward,
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

export default function TermsOfService() {
  return (
    <div className="min-h-screen text-slate-200" style={pageStyle}>
      <div className="mx-auto w-full max-w-[1100px] px-6 pb-[120px] pt-[88px] max-[700px]:px-4 max-[700px]:pb-24 max-[700px]:pt-[68px]">
        <header className={heroClass}>
          <div className="pointer-events-none absolute right-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.32)_0%,rgba(250,204,21,0)_65%)] opacity-80 blur-[18px]"></div>
          <p className="text-[0.85rem] font-bold uppercase tracking-[0.08em] text-yellow-400">Play fair</p>
          <div className="my-[10px] flex flex-col gap-2">
            <h1 className={cn(slabHeading, "m-0 text-[clamp(2rem,3vw+1rem,2.6rem)] text-yellow-100")}>Terms of Service</h1>
            <p className="max-w-[680px] text-base text-slate-300">
              These terms keep matches fair, accounts safe, and expectations
              clear while you play ft_transcendence.
            </p>
          </div>

          <div className="my-[18px] flex flex-wrap gap-[14px] text-[0.95rem]">
            <span className={metaClass}>Last updated: March 12, 2026</span>
            <span className={metaClass}>Effective for: all players and visitors</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 max-[700px]:flex-col">
            <Link to="/" className={primaryButtonClass}>
              Start Playing
            </Link>
            <Link to="/privacy-policy" className={ghostButtonClass}>
              Read Privacy Policy
            </Link>
          </div>
        </header>

        <div className="mt-7 grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiBookOpen />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>Your agreement</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">Using the app means you accept these terms.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span>You must be able to form a binding contract in your region.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>If you access via a third-party account (e.g., OAuth), their terms apply alongside ours.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>We may update the terms; continued use after notice means you agree to the changes.</span></li>
            </ul>
          </section>

          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiActivity />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>Accounts & conduct</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">Keep your credentials secure and play respectfully.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span>You are responsible for all activity under your account; use a strong password and keep it private.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>No cheating, automation, harassment, hate speech, or attempts to disrupt other players or our servers.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Report issues or bad behavior via <a href="mailto:support@ft-transcendence.local" className="text-yellow-400 hover:underline">support@ft-transcendence.local</a>.</span></li>
            </ul>
          </section>

          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiServer />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>Service availability</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">We strive for uptime but outages can happen.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span>We may pause or limit the service for maintenance, security, or to protect the community.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Matchmaking, stats, or cosmetic items may change as we iterate on the game.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>We may discontinue features with reasonable notice when possible.</span></li>
            </ul>
          </section>

          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiAlertTriangle />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>Disclaimers & liability</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">We provide the service "as is" within lawful limits.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span>We do not guarantee uninterrupted play or error-free functionality.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>To the extent permitted by law, our liability is limited to the amount you paid us (if any) in the past 3 months.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Some jurisdictions provide additional rights - those still apply.</span></li>
            </ul>
          </section>

          <section className={cardClass}>
            <div className="mb-[10px] flex items-start gap-[14px]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-400/15 text-yellow-400">
                <FiAward />
              </span>
              <div>
                <h2 className={cn(slabHeading, "mb-0.5 text-[1.15rem] text-yellow-200")}>Termination</h2>
                <p className="mb-2 text-[0.97rem] text-slate-400">We keep the community fair and safe.</p>
              </div>
            </div>
            <ul className="mt-[10px] grid gap-[10px]">
              <li className={listItemClass}><span className={listDotClass}></span><span>You may stop using the service at any time; deleting your account also deletes associated profile data.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>We may suspend or terminate accounts that violate these terms or harm the community.</span></li>
              <li className={listItemClass}><span className={listDotClass}></span><span>Appeals can be submitted to <a href="mailto:support@ft-transcendence.local" className="text-yellow-400 hover:underline">support@ft-transcendence.local</a>.</span></li>
            </ul>
          </section>
        </div>

        <div className="mt-7 text-[0.92rem] leading-[1.6] text-slate-400">
          Need a tailored agreement for your team event or tournament? Reach out
          at{" "}
          <a href="mailto:legal@ft-transcendence.local" className="text-yellow-400 hover:underline">
            legal@ft-transcendence.local
          </a>
          .
        </div>
      </div>
    </div>
  );
}
