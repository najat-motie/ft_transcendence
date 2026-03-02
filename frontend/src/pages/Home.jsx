import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <main>
      <section className="intro">
        <div className="home-container intro-layout">
          <div className="intro-text">
            <h1>Play Tic-Tac-Toe Online</h1>
            <p>
              Challenge friends or players worldwide in quick, fun matches.
              Sharpen your strategy and enjoy every game!
            </p>

            <div className="intro-actions">
              <Link to="/play">
                Play Now
              </Link>
            </div>
          </div>

          <div className="grid">
            <button className="cell">X</button>
            <button className="cell">O</button>
            <button className="cell"></button>
            <button className="cell"></button>
            <button className="cell">X</button>
            <button className="cell"></button>
            <button className="cell">O</button>
            <button className="cell"></button>
            <button className="cell"></button>
          </div>

        </div>
      </section>

      <section className="features">
        <div className="home-container">
          <h2>Why Play Here?</h2>
          <div className="features-layout">
            <div className="feature-card">
              <span className="icon">👥</span>
              <h3>Friends System</h3>
              <p>Add friends, see who's online, and play together anytime.</p>
            </div>

            <div className="feature-card">
              <span className="icon">🌍</span>
              <h3>Play Worldwide</h3>
              <p>Challenge players from anywhere in real time.</p>
            </div>

            <div className="feature-card">
              <span className="icon">🤖</span>
              <h3>Smart AI</h3>
              <p>Train your strategy against human-like AI.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="join-section">
        <div className="home-container">
          <h2>Ready to dominate the board?</h2>
          <p>Sign up now and start winning matches today.</p> 
          <Link to="/register">
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
