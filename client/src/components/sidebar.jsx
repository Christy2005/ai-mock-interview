import { Link } from "react-router-dom";
import "../layouts/navbar.css";

function Sidebar() {
  return (
    <div /*style={{
      width: "220px",
      height: "100vh",
      background: "#111827",
      color: "white",
      padding: "20px"
    }}*/ className="sidebar">
      <h2>AI Interview</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/setup">Start Interview</Link></li>
        <li><Link to="/history">Interview History</Link></li>
        <li><Link to="/feedback">Feedback Center</Link></li>
        <li><Link to="/practice">Practice Session</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;