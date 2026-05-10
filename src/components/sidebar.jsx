import { useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import File from "../components/file.jsx";

function Sidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      
      <div className="sidebar-header">
        <button className="closed-btn" onClick={closeSidebar}>
          ⇐
        </button>
      </div>

      <div className="sidebar-nav">
        <button className="file-btn" onClick={() => navigate("/File")}>
          Similarity Detection
        </button>

        <button className="spel-btn" onClick={() => navigate("/spelling")}>
          Spelling Checker
        </button>

        <button className="gram-btn" onClick={() => navigate("/grammar")}>
          Grammar Checker
        </button>

        <button className="rep-btn" onClick={() => navigate("/reports")}>
          Report
        </button>
      </div>

      <div className="logout-sidebar">
        <button className="logout-btn">Logout</button>
      </div>

    </div>
  );
}

export default Sidebar;