import { Link } from "react-router-dom";
import {
  FiShield,
  FiLock,
  FiGlobe,
  FiUserCheck,
  FiClock,
} from "react-icons/fi";
import "../styles/legal.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-shell">
        <header className="legal-hero">
          <p className="legal-eyebrow">Privacy first</p>
          <div className="legal-title">
            <h1>Privacy Policy</h1>
            <p className="legal-lead">
              We keep personal data lean, transparent, and under your control so
              you can focus on the fun parts of ft_transcendence.
            </p>
          </div>

          <div className="legal-meta">
            <span>Last updated: March 12, 2026</span>
            <span>Applies to: ft_transcendence web client & API</span>
          </div>

          <div className="legal-actions">
            <Link to="/" className="legal-btn primary">
              Back to Home
            </Link>
            <Link to="/terms-of-service" className="legal-btn ghost">
              View Terms of Service
            </Link>
          </div>
        </header>

        <div className="legal-grid">
          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiShield />
              </span>
              <div>
                <h2>What we collect</h2>
                <p>Only what we need to run the game and your account.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                <strong>Account basics:</strong> username, email, and hashed
                password for sign-in and recovery.
              </li>
              <li>
                <strong>Gameplay context:</strong> match settings, scores, and
                friends list so you can replay and reconnect.
              </li>
              <li>
                <strong>Device signals:</strong> standard logs (IP, browser,
                OS) to keep fraud out and performance stable.
              </li>
              <li>
                <strong>Cookies:</strong> session cookies that keep you logged
                in; no ad or tracking pixels.
              </li>
            </ul>
            <div className="legal-chip">No selling or sharing of personal data</div>
          </section>

          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiGlobe />
              </span>
              <div>
                <h2>How we use it</h2>
                <p>To deliver gameplay, support, and safety only.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                Run authentication, matchmaking, leaderboards, and cross-device
                sync.
              </li>
              <li>
                Detect abuse (spam, cheating) and secure accounts with anomaly
                checks.
              </li>
              <li>
                Improve stability through aggregated performance metrics; any
                analytics is de-identified.
              </li>
              <li>
                Respond to support requests and product feedback you share with
                us.
              </li>
            </ul>
          </section>

          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiUserCheck />
              </span>
              <div>
                <h2>Your controls</h2>
                <p>Manage, export, or delete your data when you need to.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                Update profile details or change your password any time in{" "}
                <Link to="/profile">Profile</Link> and{" "}
                <Link to="/change-password">Security</Link>.
              </li>
              <li>
                Request an export or deletion by emailing{" "}
                <a href="mailto:privacy@ft-transcendence.local">
                  privacy@ft-transcendence.local
                </a>
                . We confirm identity before actioning requests.
              </li>
              <li>
                Opt out of non-essential emails via in-app notifications or the
                unsubscribe link.
              </li>
            </ul>
          </section>

          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiLock />
              </span>
              <div>
                <h2>Security & retention</h2>
                <p>Modern safeguards, with data kept only while it is useful.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                Passwords are hashed; sensitive traffic is encrypted in transit;
                access is role-based.
              </li>
              <li>
                We keep server logs briefly for security investigations and then
                purge them.
              </li>
              <li>
                Backups are encrypted and rotated; we test restores regularly.
              </li>
            </ul>
            <div className="legal-subtle">
              If a breach ever impacts your data, we will notify you and outline
              steps we are taking to remedy it.
            </div>
          </section>

          <section className="legal-card">
            <div className="legal-card__header">
              <span className="legal-card__icon">
                <FiClock />
              </span>
              <div>
                <h2>Updates to this policy</h2>
                <p>We will always publish the effective date up top.</p>
              </div>
            </div>
            <ul className="legal-list">
              <li>
                Material changes will be highlighted in-app before they take
                effect.
              </li>
              <li>
                Continued use after an update means you accept the revised
                policy.
              </li>
              <li>
                We keep prior versions on file; request one if you need it.
              </li>
            </ul>
          </section>
        </div>

        <div className="legal-footnotes">
          Questions or concerns? Email{" "}
          <a href="mailto:privacy@ft-transcendence.local">
            privacy@ft-transcendence.local
          </a>{" "}
          and we will get back within a reasonable timeframe.
        </div>
      </div>
    </div>
  );
}
