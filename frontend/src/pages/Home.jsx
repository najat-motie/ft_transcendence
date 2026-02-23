import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <>
      <section className="intro">
        <div className="container intro-layout">
          <div className="intro-text">
            <h1>Play Tic-Tac-Toe Online</h1>
            <p>
              Challenge friends or players worldwide in quick, fun matches.
              Sharpen your strategy and enjoy every game!
            </p>

            <div className="intro-actions link">
              <Link to="/play">
                Play Now
              </Link>
            </div>
          </div>

          <div className="grid">
            <div className="cell">X</div>
            <div className="cell">O</div>
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell">X</div>
            <div className="cell"></div>
            <div className="cell">O</div>
            <div className="cell"></div>
            <div className="cell"></div>
          </div>

        </div>
      </section>

      <section className="features">
        <div className="container">
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
        <div className="container link">
          <h2>Ready to dominate the board?</h2>
          <p>Sign up now and start winning matches today.</p> 
          <Link to="/register">
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}
