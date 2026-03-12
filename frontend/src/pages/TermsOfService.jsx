import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiActivity,
  FiAlertTriangle,
  FiServer,
  FiAward,
} from "react-icons/fi";
import "../styles/legal.css";

export default function TermsOfService() {
  return (
    <div className="legal-page">
      <div className="legal-shell">
        <header className="legal-hero">
          <p className="legal-eyebrow">Play fair</p>
          <div className="legal-title">
            <h1>Terms of Service</h1>
            <p className="legal-lead">
              These terms keep matches fair, accounts safe, and expectations
              clear while you play ft_transcendence.
            </p>
          </div>

          <div className="legal-meta">
            <span>Last updated: March 12, 2026</span>
            <span>Effective for: all players and visitors</span>
          </div>

          <div className="legal-actions">
            <Link to="/" className="legal-btn primary">
              Start Playing
            </Link>
            <Link to="/privacy-policy" className="legal-btn ghost">
              Read Privacy Policy
            </Link>
          </div>
        </header>

        <div className="legal-grid">
          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiBookOpen />
              </span>
              <div>
                <h2>Your agreement</h2>
                <p>Using the app means you accept these terms.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                You must be able to form a binding contract in your region.
              </li>
              <li>
                If you access via a third-party account (e.g., OAuth), their
                terms apply alongside ours.
              </li>
              <li>
                We may update the terms; continued use after notice means you
                agree to the changes.
              </li>
            </ul>
          </section>

          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiActivity />
              </span>
              <div>
                <h2>Accounts & conduct</h2>
                <p>Keep your credentials secure and play respectfully.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                You are responsible for all activity under your account; use a
                strong password and keep it private.
              </li>
              <li>
                No cheating, automation, harassment, hate speech, or attempts to
                disrupt other players or our servers.
              </li>
              <li>
                Report issues or bad behavior via{" "}
                <a href="mailto:support@ft-transcendence.local">
                  support@ft-transcendence.local
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiServer />
              </span>
              <div>
                <h2>Service availability</h2>
                <p>We strive for uptime but outages can happen.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                We may pause or limit the service for maintenance, security, or
                to protect the community.
              </li>
              <li>
                Matchmaking, stats, or cosmetic items may change as we iterate
                on the game.
              </li>
              <li>
                We may discontinue features with reasonable notice when
                possible.
              </li>
            </ul>
          </section>

          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiAlertTriangle />
              </span>
              <div>
                <h2>Disclaimers & liability</h2>
                <p>We provide the service \"as is\" within lawful limits.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                We do not guarantee uninterrupted play or error-free
                functionality.
              </li>
              <li>
                To the extent permitted by law, our liability is limited to the
                amount you paid us (if any) in the past 3 months.
              </li>
              <li>
                Some jurisdictions provide additional rights - those still apply.
              </li>
            </ul>
          </section>

          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiAward />
              </span>
              <div>
                <h2>Termination</h2>
                <p>We keep the community fair and safe.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                You may stop using the service at any time; deleting your
                account also deletes associated profile data.
              </li>
              <li>
                We may suspend or terminate accounts that violate these terms or
                harm the community.
              </li>
              <li>
                Appeals can be submitted to{" "}
                <a href="mailto:support@ft-transcendence.local">
                  support@ft-transcendence.local
                </a>
                .
              </li>
            </ul>
          </section>
        </div>

        <div className="legal-footnotes">
          Need a tailored agreement for your team event or tournament? Reach out
          at{" "}
          <a href="mailto:legal@ft-transcendence.local">
            legal@ft-transcendence.local
          </a>
          .
        </div>
      </div>
    </div>
  );
}
