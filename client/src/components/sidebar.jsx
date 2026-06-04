import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../layouts/sidebar.css";

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Hamburger */}
      <div>
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
     </div>
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <br />
        <br />
        <h2>AI Interview</h2>

        <nav>
          <p onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p onClick={() => navigate("/setup")}>Start Interview</p>
          <p onClick={() => navigate("/practice")}>Practice</p>
          <p onClick={() => navigate("/history")}>Interview History</p>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;