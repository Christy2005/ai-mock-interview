import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";


function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);

   return (
    <DashboardLayout>
      <h1>Welcome to Dashboard</h1>
    </DashboardLayout>
  );
}

export default Dashboard;