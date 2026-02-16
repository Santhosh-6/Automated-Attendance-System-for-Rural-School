import express from "express";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    // ✅ Total students
    const totalStudents = await Student.countDocuments();

    // ✅ Today's date (YYYY-MM-DD)
const start = new Date();
start.setHours(0, 0, 0, 0);

const end = new Date();
end.setHours(23, 59, 59, 999);

const presentToday = await Attendance.countDocuments({
  date: { $gte: start, $lte: end }
});

    // ✅ Absent count
    const absentToday = totalStudents - presentToday;

    res.json({
      totalStudents,
      presentToday,
      absentToday
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Dashboard data error" });
  }
});

export default router;
