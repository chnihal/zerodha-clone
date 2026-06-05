import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/client";
import "./Signup.css";

const DASHBOARD_URL =
  process.env.REACT_APP_DASHBOARD_URL || "https://zerodha-dashboardclone.netlify.app/";

function Signup() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(
    searchParams.get("mode") === "login"
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [initialMargin, setInitialMargin] = useState("10000");

  useEffect(() => {
    setIsLogin(searchParams.get("mode") === "login");
  }, [searchParams]);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    resetMessages();
  };

  const validateForm = () => {
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return false;
    }

    if (!isLogin && !username.trim()) {
      setError("Username is required.");
      return false;
    }

    if (!isLogin) {
      const margin = Number(initialMargin);
      if (!Number.isFinite(margin) || margin <= 0) {
        setError("Initial margin is required and must be greater than zero.");
        return false;
      }
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/signup";
      let payload;
      if (isLogin) {
        payload = { email: email.trim(), password };
      } else {
        payload = {
          username: username.trim(),
          email: email.trim(),
          password,
          initialMargin: Number(initialMargin),
        };
      }

      const response = await api.post(endpoint, payload);

      if (!response.data.success) {
        setError(response.data.message || "Request failed. Please try again.");
        return;
      }

      setSuccess(
        isLogin
          ? "Logged in successfully. Redirecting to dashboard..."
          : "Account created successfully. Redirecting to dashboard..."
      );

      setTimeout(() => {
        window.location.href = DASHBOARD_URL;
      }, 800);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (isLogin ? "Login failed." : "Signup failed.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>{isLogin ? "Login" : "Sign up"}</h1>
        <p className="subtitle">
          {isLogin
            ? "Welcome back. Sign in to open your trading dashboard."
            : "Open your account and start investing with Zerodha Clone."}
        </p>

        {error && <div className="signup-error">{error}</div>}
        {success && <div className="signup-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Your display name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              <label htmlFor="initialMargin">Initial Margin</label>
              <input
                id="initialMargin"
                type="number"
                placeholder="10000"
                value={initialMargin}
                onChange={(e) => setInitialMargin(e.target.value)}
                min="1"
                step="1"
                required
              />
            </>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create account"}
          </button>
        </form>

        <p className="signup-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={() => switchMode(!isLogin)}>
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>

        <p className="signup-toggle" style={{ marginTop: "0.75rem" }}>
          <Link to="/" style={{ color: "#387ed1", textDecoration: "none" }}>
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
