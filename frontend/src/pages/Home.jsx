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
