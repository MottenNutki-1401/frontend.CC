import "../styles/header.css";

function Header({ toggleSidebar }) {
  return (
    <div className="header">
  
      <button className="sidebar-btn" onClick={toggleSidebar}>
     ⇒
      </button>

      <div className="header-text">
      <h1>CopyCatch</h1>

    </div>
    </div>   
  );
}
export default Header;