import { useState } from "react";
import {useNavigate, Link} from "react-router-dom";
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
      <form onSubmit={handleLogin}>
        <div className="hugs">
          <h1 className="helo">Welcome!</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button className="login-btn" type="submit">
            LOGIN
          </button>

          <Link to="/forgot-password">
            Forgot Password?
          </Link>

          <p className="version">CopyCatch v1.</p>
        </div>

        <img className="egg1" src={egg} alt="Egg" />
        <img className="egg2" src={egg} alt="Egg" />
        <img className="learn" src={learn} alt="nerd" />
      </form>
    </div>
  );
}

export default Login;