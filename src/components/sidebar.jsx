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
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);

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

  const confirmLogout = async () => {
    setIsLogoutConfirmationOpen(false);
    await handleLogout();
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
            onClick={() => setIsLogoutConfirmationOpen(true)}
          >
            Logout
          </button>

        </div>

      </div>

      {isLogoutConfirmationOpen && (
        <div
          className="logout-confirmation-backdrop"
          onClick={() => setIsLogoutConfirmationOpen(false)}
        >
          <section
            className="logout-confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirmation-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="logout-confirmation-title">Confirm logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="logout-confirmation-actions">
              <button
                className="logout-confirmation-cancel"
                type="button"
                onClick={() => setIsLogoutConfirmationOpen(false)}
              >
                Cancel
              </button>
              <button
                className="logout-confirmation-accept"
                type="button"
                onClick={confirmLogout}
              >
                Log out
              </button>
            </div>
          </section>
        </div>
      )}

    </>
  );
}

export default Sidebar;
