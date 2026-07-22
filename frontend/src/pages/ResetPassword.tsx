import { useState, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetPassword } from "../store/authSlice";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, message } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const result = await dispatch(resetPassword({ token, newPassword }));
    if (result.meta.requestStatus === "fulfilled") {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Invalid reset link</h2>
          <p className="auth-subtitle">
            This password reset link is missing its token. Please request a new one.
          </p>
          <Link to="/forgot-password" className="btn-link">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Choose a new password</h2>
        <p className="auth-subtitle">Enter and confirm your new password below.</p>

        {(error || localError) && (
          <div className="alert alert-error">{localError || error}</div>
        )}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              className="input"
              placeholder="••••••••"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              className="input"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={status === "loading"}
            style={{ marginTop: 8 }}
          >
            {status === "loading" ? "Saving..." : "Reset password"}
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
