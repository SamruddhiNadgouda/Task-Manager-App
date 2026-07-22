import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login, register } from "../store/authSlice";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const action = isRegister
      ? register({ name, email, password })
      : login({ email, password });

    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isRegister ? "Create an account" : "Welcome back"}</h2>
        <p className="auth-subtitle">
          {isRegister ? "Sign up to start tracking your tasks" : "Log in to your Task Manager"}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                className="input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
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
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={status === "loading"}
            style={{ marginTop: 8 }}
          >
            {status === "loading" ? "Please wait..." : isRegister ? "Register" : "Log in"}
          </button>
        </form>

        <div className="auth-links">
          <button type="button" className="btn-link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Already have an account? Log in" : "New here? Create an account"}
          </button>
          {!isRegister && (
            <Link to="/forgot-password" className="btn-link">
              Forgot password?
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
