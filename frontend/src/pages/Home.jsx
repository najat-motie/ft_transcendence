import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <>
      <section className="intro">
        <div className="container intro-layout">
          <div className="intro-text">
            <h1>Play Chess Online</h1>
            <p>
              Challenge players worldwide or sharpen your skills against
              powerful AI opponents.
            </p>

            <div className="intro-actions link">
              <Link to="/play">
                Play Now
              </Link>
            </div>
          </div>

          <div className="intro-visual" />
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Our Platform?</h2>

          <div className="features-layout">
            <div className="feature-card">
              <span className="icon">♖</span>
              <h3>Play Online</h3>
              <p>Compete with players from around the world in real time.</p>
            </div>

            <div className="feature-card">
              <span className="icon">🤖</span>
              <h3>AI Challenges</h3>
              <p>Train against AI opponents with adaptive difficulty.</p>
            </div>

            <div className="feature-card">
              <span className="icon">📈</span>
              <h3>Track Progress</h3>
              <p>Analyze your games and improve your strategy.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="join-section">
        <div className="container link">
          <h2>Ready to Make Your Move?</h2>
          <Link to="/register">
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}
