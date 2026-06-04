import "../layouts/navbar.css";
import {useNavigate} from "react-router-dom";
function Navbar() {
const navigate=useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};
  return (
    <div  className="navbar">
      <h3 className="navbar-title">Dashboard</h3>

      <button onClick={handleLogout} className="navbar-right">Logout</button>
    </div>
  );
}

export default Navbar;