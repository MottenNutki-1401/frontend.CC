import { useState } from "react";

import {
  Link
} from "react-router-dom";

import { supabase }
from "../api/supabase";

import "../styles/login.css";

import egg from "../assets/egg.svg";

import learn from "../assets/learn.svg";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  async function handleReset(e) {

    e.preventDefault();

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            "http://localhost:5173/reset-password",
        }
      );

    if (error) {

      alert(error.message);

      return;
    }

    alert("Password reset email sent!");
  }

  return (

    <div className="login-container">

      <form onSubmit={handleReset}>

        <div className="hugs">

          <h2 className="helo">
            Forgot Password
          </h2>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button
            className="login-btn"
            type="submit"
          >
            SEND RESET LINK
          </button>

          <Link to="/">
            Back to Login
          </Link>

          <p className="version">
            CopyCatch v1.
          </p>

        </div>

        <img
          className="egg1"
          src={egg}
          alt="Egg"
        />

        <img
          className="egg2"
          src={egg}
          alt="Egg"
        />

        <img
          className="learn"
          src={learn}
          alt="nerd"
        />

      </form>

    </div>
  );
}

export default ForgotPassword;