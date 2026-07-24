import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../api/supabase";

import "../styles/login.css";
import egg from "../assets/egg.svg";
import learn from "../assets/learn.svg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    console.log(data);

    navigate("/home", {
      replace: true
    });
  }

  return (
    <div className="login-container">
      <form className="login-page-form" onSubmit={handleLogin}>
        <div className="hugs">
          <p className="login-product-name">CopyCatch</p>
          <h1 className="helo">Welcome back</h1>
          <p className="login-subtitle">
            Sign in to continue to your academic review workspace.
          </p>

          <div className="login-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Sign in
          </button>

          <p className="version">CopyCatch v1.</p>
        </div>

        <img className="login-egg-one" src={egg} alt="" aria-hidden="true" />
        <img className="login-egg-two" src={egg} alt="" aria-hidden="true" />
        <img
          className="login-learn-illustration"
          src={learn}
          alt="Student learning illustration"
        />
      </form>
    </div>
  );
}

export default Login;
