import { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import { supabase }
from "../api/supabase";

import "../styles/login.css";

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

    <div className="login-container">

      <form onSubmit={handleUpdatePassword}>

        <div className="hugs">

          <h2 className="helo">
            Reset Password
          </h2>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="login-btn"
            type="submit"
          >
            UPDATE PASSWORD
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

export default ResetPassword;