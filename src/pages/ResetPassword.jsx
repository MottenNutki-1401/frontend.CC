import { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import { supabase }
from "../api/supabase";

import "../styles/login.css";
import "../styles/passwordRecovery.css";

import egg from "../assets/egg.svg";

import learn from "../assets/learn.svg";

function ResetPassword() {

  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  async function handleUpdatePassword(e) {

    e.preventDefault();

    const { error } =
      await supabase.auth.updateUser({

        password: password,
      });

    if (error) {

      alert(error.message);

      return;
    }

    alert("Password updated!");

    // redirect to login
    navigate("/");
  }

  return (

    <div className="password-recovery-page">

      <form className="password-recovery-form" onSubmit={handleUpdatePassword}>

        <div className="password-recovery-card">

          <h2 className="password-recovery-heading">
            Reset Password
          </h2>

          <input
            className="password-recovery-input"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="password-recovery-button"
            type="submit"
          >
            UPDATE PASSWORD
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

export default ResetPassword;