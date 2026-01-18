import { Link, Outlet } from "react-router-dom";
import NavBar from ".//NavBar";
import Footer from ".//Footer";
import '../../styles/layout/BaseLayout.css'

export default function BaseLayout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="logo">
          <Link to="/" className="logo-link">
            Chess
          </Link>
        </div>
        <NavBar />
      </header>

      <main className="layout-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
