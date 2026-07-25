import { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { forgotPassword } from "../store/authSlice";
import { sendResetEmail } from "../lib/emailjs";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useAppDispatch();
  const { error, message } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (error || message) {
      setShowAlert(true);
      const timer = window.setTimeout(() => setShowAlert(false), 3000);
      return () => window.clearTimeout(timer);
    }
  }, [error, message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    const result = await dispatch(forgotPassword({ email }));

    if (result.meta.requestStatus === "fulfilled") {
      const payload = result.payload as {
        resetLink?: string;
        name?: string;
        email?: string;
      };
      if (payload.resetLink && payload.email) {
        try {
          await sendResetEmail(payload.email, payload.name || "there", payload.resetLink);
        } catch (err: any) {
          console.error("EmailJS send failed:", err?.status, err?.text);
        }
      }
    }
    setSending(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot your password?</h2>
        <p className="auth-subtitle">Enter your email and we'll send you a link to reset it.</p>

        {error && showAlert && <div className={`alert alert-error ${!showAlert ? "is-hiding" : ""}`}>{error}</div>}
        {message && showAlert && <div className={`alert alert-success ${!showAlert ? "is-hiding" : ""}`}>{message}</div>}

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
          <button type="submit" className="btn btn-primary btn-block" disabled={sending} style={{ marginTop: 8 }}>
            {sending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="btn-link">Back to log in</Link>
        </div>
      </div>
    </div>
  );
}