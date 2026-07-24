import "../styles/header.css";
import egg from "../assets/egg.svg";

function Header({ toggleSidebar, variant }) {
  const isDashboard = variant === "dashboard";

  return (
    <header className={`header ${isDashboard ? "dashboard-header" : ""}`}>
      <button
        className="sidebar-btns"
        type="button"
        onClick={toggleSidebar}
        aria-label="Open navigation menu"
      >
        <span aria-hidden="true">☰</span>
      </button>

      <div className="header-text">
        {isDashboard && (
          <img className="header-brand-egg" src={egg} alt="" aria-hidden="true" />
        )}
        <h1>CopyCatch</h1>
      </div>
    </header>
  );
}

export default Header;
