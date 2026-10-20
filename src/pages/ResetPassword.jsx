import { useEffect, useState } from "react";

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

const recoverySessionKey = "copycatch-password-recovery";

function readRecoveryCallback() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  new URLSearchParams(url.hash.slice(1)).forEach((value, key) => {
    params.set(key, value);
  });

  return params;
}

function getRecoveryLinkError(params) {
  const errorCode = params.get("error_code");
  const description = params.get("error_description");

  if (!errorCode && !description && !params.get("error")) {
    return "";
  }

  if (errorCode === "otp_expired" || /expired|invalid/i.test(description || "")) {
    return "This password reset link is invalid or has expired. Request a new reset link and open the latest email.";
  }

  return description || "This password reset link could not be verified. Request a new reset link.";
}

function ResetPassword() {

  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");
  const [recoveryStatus, setRecoveryStatus] = useState({
    state: "checking",
    message: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = readRecoveryCallback();
    const linkError = getRecoveryLinkError(params);

    if (linkError) {
      setRecoveryStatus({ state: "error", message: linkError });
      return undefined;
    }

    let mounted = true;
    let recoveryEventReceived = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event !== "PASSWORD_RECOVERY") {
          return;
        }

        recoveryEventReceived = true;

        if (session) {
          try {
            window.sessionStorage.setItem(recoverySessionKey, "true");
          } catch {
            // The current recovery event still authorizes this page if storage is unavailable.
          }

          setRecoveryStatus({ state: "ready", message: "" });
        } else {
          setRecoveryStatus({
            state: "error",
            message: "Supabase did not provide a recovery session. Request a new reset link.",
          });
        }
      }
    );

    async function establishRecoverySession() {
      try {
        const tokenHash = params.get("token_hash");

        if (tokenHash && params.get("type") === "recovery") {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });

          if (error) {
            throw error;
          }

          if (!data.session) {
            throw new Error("The reset link did not create a recovery session.");
          }

          if (mounted) {
            try {
              window.sessionStorage.setItem(recoverySessionKey, "true");
            } catch {
              // The verified session remains available for this page.
            }
            setRecoveryStatus({ state: "ready", message: "" });
          }
          return;
        }

        const { data, error } = await supabase.auth.getSession();

        // Supabase emits PASSWORD_RECOVERY just after URL session detection finishes.
        await new Promise((resolve) => setTimeout(resolve, 0));

        if (!mounted || recoveryEventReceived) {
          return;
        }

        if (error) {
          throw error;
        }

        let recoveryWasEstablishedInThisTab = false;
        try {
          recoveryWasEstablishedInThisTab =
            window.sessionStorage.getItem(recoverySessionKey) === "true";
        } catch {
          // Recovery can still be established from the callback URL below.
        }

        const isRecoveryCallback = params.get("type") === "recovery";

        if (data.session && (isRecoveryCallback || recoveryWasEstablishedInThisTab)) {
          try {
            window.sessionStorage.setItem(recoverySessionKey, "true");
          } catch {
            // The active session remains available for this page.
          }
          setRecoveryStatus({ state: "ready", message: "" });
          return;
        }

        setRecoveryStatus({
          state: "error",
          message: "A valid password recovery session was not found. The link may be expired or already used; request a new reset link.",
        });
      } catch (error) {
        if (mounted) {
          setRecoveryStatus({
            state: "error",
            message: error.message || "The password reset link could not be verified. Request a new reset link.",
          });
        }
      }
    }

    establishRecoverySession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleUpdatePassword(e) {

    e.preventDefault();

    if (recoveryStatus.state !== "ready" || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { error } = await supabase.auth.updateUser({

        password: password,
      });

      if (error) {
        setSubmitError(error.message);
        return;
      }

      try {
        window.sessionStorage.removeItem(recoverySessionKey);
      } catch {
        // A stale marker cannot authorize a password update without an active session.
      }

      alert("Password updated!");

      // redirect to login
      navigate("/");
    } catch (error) {
      setSubmitError(error.message || "The password could not be updated. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (

    <div className="password-recovery-page">

      <form className="password-recovery-form" onSubmit={handleUpdatePassword}>

        <div className="password-recovery-card">

          <h2 className="password-recovery-heading">
            Reset Password
          </h2>

          {recoveryStatus.state === "checking" && (
            <p className="password-recovery-message" role="status">
              Validating your password reset link…
            </p>
          )}

          {recoveryStatus.state === "error" && (
            <div className="password-recovery-error" role="alert">
              <p>{recoveryStatus.message}</p>
              <Link className="password-recovery-link" to="/forgot-password">
                Request a new reset link
              </Link>
            </div>
          )}

          {recoveryStatus.state === "ready" && (
            <>
              <input
                className="password-recovery-input"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {submitError && (
                <p className="password-recovery-error" role="alert">
                  {submitError}
                </p>
              )}

              <button
                className="password-recovery-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "UPDATING PASSWORD…" : "UPDATE PASSWORD"}
              </button>
            </>
          )}

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
