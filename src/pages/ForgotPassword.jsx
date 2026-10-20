import { useState } from "react";

import {
  Link
} from "react-router-dom";

import { supabase }
from "../api/supabase";

import "../styles/login.css";
import "../styles/passwordRecovery.css";

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
            `${window.location.origin}/reset-password`,
        }
      );

    if (error) {

      alert(error.message);

      return;
    }

    alert("Password reset email sent!");
  }

  return (

    <div className="password-recovery-page">

      <form className="password-recovery-form" onSubmit={handleReset}>

        <div className="password-recovery-card">

          <h2 className="password-recovery-heading">
            Forgot Password
          </h2>

          <input
            className="password-recovery-input"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button
            className="password-recovery-button"
            type="submit"
          >
            SEND RESET LINK
          </button>

          <Link className="password-recovery-link" to="/">
            Back to Login
          </Link>

          <p className="password-recovery-footer">
            CopyCatch v1.
          </p>

        </div>

        <img
          className="password-recovery-egg-one"
          src={egg}
          alt="Egg"
        />

        <img
          className="password-recovery-egg-two"
          src={egg}
          alt="Egg"
        />

        <img
          className="password-recovery-illustration"
          src={learn}
          alt="nerd"
        />

      </form>

    </div>
  );
}

export default ForgotPassword;