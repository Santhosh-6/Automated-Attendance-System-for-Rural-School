import "../APP.CSS";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:7000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          setStats({
            totalStudents: data.totalStudents || 0,
            presentToday: data.presentToday || 0,
            absentToday: data.absentToday || 0
          });
        } else {
          console.error("Dashboard API error:", data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    // Initial load
    fetchDashboardData();

    // Auto refresh every 5 sec
    const interval = setInterval(fetchDashboardData, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="dash-body">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div className="header-left">
            <span className="school-icon">🏫</span>
            <span className="header-title">
              Automated Attendance <br /> System for Rural Schools
            </span>
          </div>
        </div>

        <h3 className="welcome-text">Welcome, Admin!</h3>

        <div className="stats-container">
          <div className="stat-card blue">
            <p>Total Students</p>
            <h2>{stats.totalStudents}</h2>
          </div>

          <div className="stat-card green">
            <p>Present Today</p>
            <h2>{stats.presentToday}</h2>
          </div>

          <div className="stat-card red">
            <p>Absent Today</p>
            <h2>{stats.absentToday}</h2>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn red-btn" onClick={() => navigate("/add-students")}>
            ➕ Add Student
          </button>

          <button className="btn green-btn" onClick={() => navigate("/take-attendance")}>
            ✔ Take Attendance
          </button>

          <button className="btn blue-btn" onClick={() => navigate("/reports")}>
            📄 View Reports
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
