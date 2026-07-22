import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { forgotPassword } from "../store/authSlice";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { status, error, message } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot your password?</h2>
        <p className="auth-subtitle">
          Enter your email and we'll send you a link to reset it.
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={status === "loading"}
            style={{ marginTop: 8 }}
          >
            {status === "loading" ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="btn-link">
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
