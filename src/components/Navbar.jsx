import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { initials } from "../utils";
import Icon from "./Icon";

function navClass({ isActive }) {
  return `nav-link${isActive ? " active" : ""}`;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link
          to="/"
          className="brand"
          aria-label="Kindred Foundation home"
          onClick={() => setOpen(false)}
        >
          <span className="brand-mark">
            <Icon name="heart" size={18} />
          </span>
          <span>
            Kindred <strong>Foundation</strong>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>

        <nav
          className={`nav-links${open ? " open" : ""}`}
          onClick={(event) => {
            if (event.target.closest("a")) setOpen(false);
          }}
        >
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/events" className={navClass}>
            Events
          </NavLink>

          {user ? (
            <>
              <NavLink to="/my-events" className={navClass}>
                My events
              </NavLink>
              <NavLink to="/joined-events" className={navClass}>
                Joined
              </NavLink>
              <Link to="/create-event" className="btn btn-primary btn-sm nav-cta">
                <Icon name="plus" size={16} />
                Create event
              </Link>
              <div className="nav-user">
                <span className="avatar" aria-hidden="true">
                  {initials(user.name)}
                </span>
                <span className="nav-user-name">{user.name}</span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={handleLogout}
                  title="Log out"
                  aria-label="Log out"
                >
                  <Icon name="logout" size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                Log in
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm nav-cta">
                Join Kindred
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
