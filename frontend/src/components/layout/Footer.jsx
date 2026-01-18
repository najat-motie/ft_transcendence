import { Link } from "react-router-dom";
import "../../styles/layout/footer.css";

export default function Footer() {
    return (
      <footer className="layout-footer">
        <p>© {new Date().getFullYear()} ft_transcendence</p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms-of-service">Terms</Link>
        </div>
      </footer>
    );
}
