import express from "express";
import fetch from "node-fetch";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   MARK ATTENDANCE
=========================== */
router.post("/mark", auth, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }

    console.log("📸 Sending image to Python service");

    // 🔹 Call Python Face Service
    let pyData;
    try {
      const pyRes = await fetch("http://localhost:8000/match-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image })
      });

      if (!pyRes.ok) {
        console.error("❌ Python service HTTP error");
        return res.status(500).json({ message: "Face service error" });
      }

      pyData = await pyRes.json();
    } catch (err) {
      console.error("🔥 Face service fetch error:", err);
      return res.status(500).json({ message: "Face service error" });
    }

    // 🔹 No face matched
    if (!pyData.matched) {
      return res.status(200).json({ message: "No face matched" });
    }

    // 🔹 Find student
    const student = await Student.findOne({ studentId: pyData.studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🔹 Normalize today date
const today = new Date();
today.setHours(0, 0, 0, 0);

    const already = await Attendance.findOne({
      studentId: student.studentId,
      date: today
    });

    if (already) {
      return res.status(200).json({ message: "Already marked" });
    }

    // 🔹 Save attendance
await Attendance.create({
  studentId: student.studentId,
  name: student.name,
  className: student.className,
  date: today,
  status: "Present"
});

return res.json({
  studentId: student.studentId,
  name: student.name,
  status: "Present"
});

  } catch (err) {
    console.error("🔥 Attendance server error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   GET ALL ATTENDANCE
=========================== */
router.get("/all", auth, async (req, res) => {
  const data = await Attendance.find();
  res.json(data);
});

/* ===========================
   FILTER ATTENDANCE
=========================== */
router.get("/filter", async (req, res) => {
  const { date, className } = req.query;
  let query = {};

  if (className) query.className = className;

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59);

    query.date = { $gte: start, $lte: end };
  }

  const records = await Attendance.find(query);
  res.json(records);
});

/* ===========================
   DOWNLOAD CSV
=========================== */
router.get("/download", auth, async (req, res) => {
  try {
    const { date, className } = req.query;
    let query = {};

    if (className) query.className = className;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.date = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(query);

    if (!records.length) {
      return res.status(404).json({ message: "No records found" });
    }

    let csv = "Student ID,Name,Class,Date,Status\n";

records.forEach(r => {
  const formattedDate = r.date
    ? new Date(r.date).toLocaleDateString("en-CA")
    : "";

  csv += `${r.studentId},${r.name},${r.className},${formattedDate},${r.status}\n`;
});

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance_report.csv");
    res.send(csv);

  } catch (err) {
    console.error("CSV download error:", err);
    res.status(500).json({ message: "CSV generation failed" });
  }
});

export default router;
