import { useState, useRef } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function AddStudents() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const classRef = useRef(null);
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
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
        videoRef.current.play();
      };
    }, 300);

  } catch (err) {
    alert("Camera error: " + err.message);
  }
};

  // 🛑 STOP CAMERA
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
    setCameraOn(false);
  };

  // 📸 CAPTURE & SAVE
  const captureAndSave = async () => {
    const className = classRef.current.value;

    if (!studentId || !name || !className || className === "Select Class") {
      setMessage("All fields are required");
      return;
    }

    const video = videoRef.current;
if (!videoRef.current || videoRef.current.videoWidth === 0) {
  setMessage("Camera not ready. Please wait...");
  return;
}

    // Draw image
   const canvas = canvasRef.current;
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

const ctx = canvas.getContext("2d", { willReadFrequently: true });
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

// ALWAYS JPEG → face_recognition friendly
const image = canvas.toDataURL("image/jpeg", 0.95);

const imgPreview = new Image();
imgPreview.src = image;
imgPreview.onload = () => {
  console.log("Width:", imgPreview.width, "Height:", imgPreview.height);
};

    try {
      const res = await fetch("http://localhost:7000/api/students/register-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ studentId, name, className, image })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("✅ Student registered successfully");
      stopCamera();

      // Clear form
      setStudentId("");
      setName("");
      classRef.current.value = "Select Class";

    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="addstudent-bg">
      <div className="addstudent-container">
        <div className="addstudent-header">🏫 Add Student</div>

        {message && <p>{message}</p>}

        <form className="addstudent-form">
          <label htmlFor="studentId">Student ID:</label>
          <input
            id="studentId"
            name="studentId"
            type="text"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
          />

          <label htmlFor="studentName">Student Name:</label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label htmlFor="className">Class:</label>
          <select id="className" name="className" ref={classRef}>
            <option>Select Class</option>
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 3</option>
          </select>

          <p><strong>Capture Photo</strong></p>

{cameraOn && (
  <video
    ref={videoRef}
    autoPlay
    playsInline
    style={{ width: "320px", border: "2px solid" }}
  />
)}

          <canvas ref={canvasRef} hidden />

          {!cameraOn ? (
            <button type="button" onClick={startCamera} className="capture-btn">
              Start Camera
            </button>
          ) : (
            <button type="button" onClick={captureAndSave} className="capture-btn bt">
              Capture & Save
            </button>
          )}
          <button className="capture-btn" onClick={() => navigate("/dashboard")}>
          Back
        </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudents;
