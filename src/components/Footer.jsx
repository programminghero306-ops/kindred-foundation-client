import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark small">
            <Icon name="heart" size={15} />
          </span>
          <div>
            <strong>Kindred Foundation</strong>
            <span>Small acts. Stronger communities.</span>
          </div>
        </div>

        <div className="footer-links">
          <Link to="/events">Browse events</Link>
          <Link to="/create-event">Host an event</Link>
          <Link to="/register">Join Kindred</Link>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Kindred Foundation
        </p>
      </div>
    </footer>
  );
}
