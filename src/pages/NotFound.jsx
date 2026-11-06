import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="empty">
          <div className="empty-icon">
            <Icon name="search" size={26} />
          </div>
          <h1 className="not-found-title">404</h1>
          <h3>This page wandered off</h3>
          <p>The page you are looking for does not exist.</p>
          <div className="empty-action">
            <Link to="/" className="btn btn-primary">
              <Icon name="home" size={17} />
              Back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
