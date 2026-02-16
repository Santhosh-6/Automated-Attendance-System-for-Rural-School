import { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function AttendanceReport() {
  const navigate = useNavigate();
    const [records, setRecords] = useState([]);
  const [date, setDate] = useState("");
  const [className, setClassName] = useState("");

  const fetchReports = () => {
    let url = `http://localhost:7000/api/attendance/filter?`;

    if (date) url += `date=${date}&`;
    if (className) url += `className=${className}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setRecords(data));
  };

  useEffect(() => {
    fetchReports();
  }, []);

const downloadCSV = async () => {
  try {
    const token = localStorage.getItem("token");

    let url = "http://localhost:7000/api/attendance/download?";
    if (date) url += `date=${date}&`;
    if (className) url += `className=${className}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      alert("No records found");
      return;
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "attendance_report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("CSV download error:", err);
  }
};

  return (
    <div className="report-bg">
      <div className="report-container">
        <div className="report-header">
          🏠 Attendance Report
        </div>
        <div className="filter-section">
          <input type="date" onChange={e => setDate(e.target.value)} />
        <select onChange={e => setClassName(e.target.value)}>
          <option value="">All Classes</option>
          <option>Class 1</option>
          <option>Class 2</option>
          <option>Class 3</option>
        </select>
        <button onClick={fetchReports} className="fl-btn">Filter</button>
        </div>
        <table className="report-table">
                 <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.studentId}</td>
              <td>{r.name}</td>
              <td>{r.className}</td>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td className="present">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
        <button className="download-btn" onClick={downloadCSV}>
          ⬇ Download CSV
        </button>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </div>
    </div>
  );
}

export default AttendanceReport;
