import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/Dashboardlayout.jsx";
import { PieChart, Pie, Cell,Legend } from "recharts";
import "./styles/dashboard.css";
import API from "../api/auth";

function Dashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  fetchLatestReport();
}, []);
const fetchLatestReport = async () => {
  try {
    const interviewId = localStorage.getItem("latestInterviewId");

    const res = await API.get(`/evaluation/${interviewId}`);

    const report = res.data;

    const formatted = [
      { name: "Technical", value: report.technical_score || 0 },
      { name: "Communication", value: report.communication_score || 0 },
      { name: "Confidence", value: report.confidence_score || 0 }
    ];

    setChartData(formatted);
  } catch (err) {
    console.log(err);
  }
};


const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  

   return (
    <DashboardLayout>
      <h1>Welcome to Dashboard</h1>
      <div className="card-grid">

  <div className="card" onClick={() => navigate("/setup")}>
    🎤 <br />START INTERVIEW
  </div>

  <div className="card" onClick={() => navigate("/practice")}>
    📘 <br />PRACTICE QUESTIONS
  </div>
 <br />
  <div className="card" onClick={() => navigate("/history")}>
    📊 <br />INTERVIEW HISTORY
  </div>
 {chartData.length > 0 ? (
        <PieChart width={300} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      ) : (
        <p>No interview data found</p>
      )}
</div>

    </DashboardLayout>
  );
}

export default Dashboard;