import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/sidebar.css";

import File from "./file.jsx";

import egg from "../assets/egg.svg";

import { supabase }
from "../api/supabase";

function Sidebar({ isOpen, closeSidebar }) {

  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    let isMounted = true;

    const setUsernameFromUser = (user) => {
      const email = user?.email;

      if (isMounted) {
        setUsername(email ? email.split("@")[0] : "");
      }
    };

    const getUsername = async () => {
      const { data } = await supabase.auth.getUser();

      setUsernameFromUser(data.user);
    };

    getUsername();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUsernameFromUser(session?.user),
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // LOGOUT
  const handleLogout = async () => {

    await supabase.auth.signOut();

        navigate("/", {
          replace: true
        });
      };

  const navigationItems = [
    { label: "Similarity Detection", path: "/File" },
    { label: "Grammar Checker", path: "/grammar" },
    { label: "Spelling Checker", path: "/spelling" },
    { label: "Automated Grading", path: "/grading" },
  ];

  return (

    <>

      {/* OVERLAY */}
      {isOpen && (

        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>

      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>

        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img className="sidebar-brand-egg" src={egg} alt="" aria-hidden="true" />
            <span>CopyCatch</span>
          </div>

          <div className="sidebar-user" aria-label="Signed-in user">
            <span className="sidebar-user-label">Signed in as</span>
            <span className="sidebar-username">{username}</span>
          </div>
        </div>

        <div className="sidebar-nav">

          {navigationItems.map(({ label, path }) => (
            <button
              className={`sidebar-nav-item ${location.pathname === path ? "active" : ""}`}
              key={path}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}

        </div>

        <div className="logout-sidebar">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </>
  );
}

export default Sidebar;
