import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {Link} from "react-router-dom";
import ChatBot from "../components/ChatBot";

function DashboardLayout({ children }) {
  return (
   <div className="app-container">
  <Sidebar />

  <div className="main-section">
    <Navbar />

    <div className="page-content">
      {children}
    </div>

    <ChatBot />
  </div>
</div>
  );
}

export default DashboardLayout;