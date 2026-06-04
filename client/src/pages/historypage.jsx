import { useEffect, useState } from "react";
import API from "../api/auth";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import "./styles/history.css";

function HistoryPage() {

  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    try {

      const res = await API.get("/interview/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setHistory(res.data);

    } catch (err) {
      console.log(err);
    }
  };
  const deleteInterview=async(id)=>{
    try{
      await API.delete(`/interview/${id}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      });
      setHistory(history.filter(item => item.id !== id));
    }catch (err) {
    console.log(err);
  }
  };

  return (
    <DashboardLayout>
      <div className="hisory-card">

      <h1>Interview History</h1>
      

      {history.map((item) => (

        <div key={item.id}>

          <h3>{item.role} - {item.domain}</h3>

           <p>
            Scores:
            {item.technical_score ?? "Pending"} /
            {item.communication_score ?? "Pending"} /
            {item.confidence_score ?? "Pending"}
          </p>
        <div className="button-container">
          <button onClick={() =>
            navigate(`/evaluation/${item.id}`)
          }>
            View Report
          </button>
         
          <button onClick={()=>deleteInterview(item.id)}>
            Delete
          </button>
          </div>
          <hr />

        </div>
      ))}
      {history.length==0 &&(
        <p>No interview history found</p>
      )}
    </div>
    </DashboardLayout>
  );
}

export default HistoryPage;