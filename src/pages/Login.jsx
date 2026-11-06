import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Icon from "../components/Icon";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="card auth-card">
          <div className="auth-icon">
            <Icon name="lock" size={22} />
          </div>
          <h1>Welcome back</h1>
          <p className="sub">
            Log in to join events and manage the ones you host.
          </p>

          {error && (
            <div className="alert alert-error">
              <Icon name="alert" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={busy}
            >
              {busy ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            New to Kindred? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
