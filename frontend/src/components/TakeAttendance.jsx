import "../App.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TakeAttendance() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); 
  const [student, setStudent] = useState(null);
  const noFaceCountRef = useRef(0);
const MAX_NO_FACE = 5; // 5 × 3s = 15 seconds
const lastMarkedRef = useRef(null);

  const [message, setMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  // 🎥 START CAMERA
const startCamera = async () => {
  try {
    setCameraOn(true);

    setTimeout(async () => {
      if (!videoRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        intervalRef.current = setInterval(captureAndMark, 3000);
      };
    }, 300);

  } catch (err) {
    alert("Camera error: " + err.message);
  }
};

  // 🛑 STOP CAMERA
const stopCamera = () => {
  if (videoRef.current?.srcObject) {
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
  }
  clearInterval(intervalRef.current);
  setCameraOn(false);
};


  // 📸 CAPTURE & SEND IMAGE
const captureAndMark = async () => {
  if (!videoRef.current || videoRef.current.videoWidth === 0) return;

  setStatus("detecting");
  setMessage("🔍 Detecting face...");

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoRef.current, 0, 0);

  const image = canvas.toDataURL("image/jpeg", 0.9);

  try {
    const res = await fetch("http://localhost:7000/api/attendance/mark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ image })
    });

    const data = await res.json();
    console.log("Attendance API returned:", data);
    
    // ❌ No face matched
    if (data.message === "No face matched") {
      noFaceCountRef.current += 1;
        setStatus("detecting");
  setMessage("❓ Unknown face detected");

      // ⏳ Auto stop after long inactivity
      if (noFaceCountRef.current >= MAX_NO_FACE) {
        setMessage("📴 Camera stopped (no face detected)");
        stopCamera();
      }
      return;
    }

    // Reset counter when face found
    noFaceCountRef.current = 0;

    // ⚠️ Already marked
    if (data.message === "Already marked") {
      setStatus("detecting");
      setMessage("⚠️ Already marked, detecting next...");
      return;
    }

    // ✅ Newly marked
    if (data.studentId) {
      setStudent(data);
      setStatus("present");
      setMessage(`✅ Present: ${data.name} (${data.studentId})`);

      // ⏱ Show success briefly, then detect next
      setTimeout(() => {
        setStatus("detecting");
        setMessage("🔍 Detecting next student...");
      }, 2000);
    }

  } catch (err) {
    console.error("Attendance error:", err);
    setMessage("❌ Server error");
  }
};



  // 🧹 CLEANUP ON UNMOUNT
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="attendance-bg">
      <div className="attendance-container">
        <div className="attendance-header">📷 Take Attendance</div>

        <div className="face-section">
  {!cameraOn ? (
    <button className="capture-btn" onClick={startCamera}>
      Start Camera
    </button>
  ) : (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{ width: "400px", border: "2px solid" }}
    />
  )}
  <canvas ref={canvasRef} hidden />
</div>


<div className="attendance-status">
  {status === "detecting" && <p className="detecting">{message}</p>}

  {status === "present" && student && (
    <div className="success">
      <p>✅ Attendance Marked</p>
      <p><strong>ID:</strong> {student.studentId}</p>
      <p><strong>Name:</strong> {student.name}</p>
    </div>
  )}
</div>

        <button className="capture-btn" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </div>
    </div>
  );
}

export default TakeAttendance;
