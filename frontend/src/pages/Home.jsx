import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../services/auth";
import "../styles/home.css";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = getUser();
    setIsLoggedIn(Boolean(session?.user?.userId && session?.accessToken));
  }, []);

  return (
    <div className="home-page">
      <section className="home-intro">
        <div className="home-container home-intro-layout">
          <div className="home-intro-text">
            <span className="home-kicker">Live Multiplayer Arena</span>
            <h1>Play Tic-Tac-Toe Online</h1>
            <p>
              Challenge friends or players worldwide in quick, tactical matches.
              Jump into ranked games, train against AI, or run private room battles.
            </p>

            <div className="home-intro-actions">
              <Link to="/play" className="home-btn home-btn-primary">Play Now</Link>
              {isLoggedIn ? (
                <Link to="/profile" className="home-btn home-btn-ghost">My Profile</Link>
              ) : (
                <Link to="/register" className="home-btn home-btn-ghost">Create Account</Link>
              )}
            </div>

            <div className="home-stats" aria-label="Platform statistics">
              <div className="home-stat">
                <strong>5 Modes</strong>
                <span>Online, local, AI and more</span>
              </div>
              <div className="home-stat">
                <strong>Real Time</strong>
                <span>Low-latency live matches</span>
              </div>
              <div className="home-stat">
                <strong>Friends First</strong>
                <span>Private rooms and invites</span>
              </div>
            </div>
          </div>

          <div className="home-board-wrap" aria-hidden="true">
            <div className="home-board-grid">
              <div className="home-cell home-cell-x">X</div>
              <div className="home-cell home-cell-o">O</div>
              <div className="home-cell"></div>
              <div className="home-cell"></div>
              <div className="home-cell home-cell-x">X</div>
              <div className="home-cell"></div>
              <div className="home-cell home-cell-o">O</div>
              <div className="home-cell"></div>
              <div className="home-cell"></div>
            </div>
            <div className="home-board-badge">Your move</div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="home-container">
          <h2>Why Play Here?</h2>
          <div className="home-features-layout">
            <article className="home-feature-card">
              <span className="home-icon">👥</span>
              <h3>Friends System</h3>
              <p>Add friends, see who's online, and play together anytime.</p>
            </article>

            <article className="home-feature-card">
              <span className="home-icon">🌍</span>
              <h3>Play Worldwide</h3>
              <p>Challenge players from anywhere in real time.</p>
            </article>

            <article className="home-feature-card">
              <span className="home-icon">🤖</span>
              <h3>Smart AI</h3>
              <p>Train your strategy against human-like AI.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-join-section">
        <div className="home-container home-join-shell">
          <h2>Ready to dominate the board?</h2>
          <p>Sign up now and start winning matches today.</p>
          <Link to="/register" className="home-btn home-btn-primary">Get Started</Link>
        </div>
      </section>
    </div>
  );
}
