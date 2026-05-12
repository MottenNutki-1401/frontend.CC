import { useNavigate } from "react-router-dom";

import "../styles/sidebar.css";

import File from "./file.jsx";

import { supabase }
from "../api/supabase";

function Sidebar({ isOpen, closeSidebar }) {

  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = async () => {

    await supabase.auth.signOut();

        navigate("/", {
          replace: true
        });
      };

  {/* for test */}
  const user = {

    name: "Hello",

    role: "Welcome to Copycatch",
  };

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

          {/* PROFILE SECTION */}
          <div className="sidebar-profile">

            <div className="avatar-circle">

              {user.name.charAt(0)}

            </div>

            <div className="profile-info">

              <p className="profile-name">
                {user.name}
              </p>

              <p className="profile-role">
                {user.role}
              </p>

            </div>

          </div>

        </div>

        <div className="sidebar-nav">

          <button
            className="file-btn"
            onClick={() => navigate("/File")}
          >
            Similarity Detection
          </button>

          <button
            className="spel-btn"
            onClick={() => navigate("/spelling")}
          >
            Spelling Checker
          </button>

          <button
            className="gram-btn"
            onClick={() => navigate("/grammar")}
          >
            Grammar Checker
          </button>

          <button
            className="rep-btn"
            onClick={() => navigate("/grading")}
          >
            Automated Grading
          </button>

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