import "../../styles/layout/footer.css";

export default function Footer() {
    return (
      <footer className="footer">
        <p>© {new Date().getFullYear()} ft_transcendence</p>
      </footer>
    );
}
