import express from "express";
import fs from "fs";
import path from "path";
import Student from "../models/Student.js";

const router = express.Router();

router.post("/register-face", async (req, res) => {
  try {
    const { studentId, name, className, image } = req.body;
    
    console.log("Request body:", req.body);

    if (!studentId || !name || !className || !image) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await Student.findOne({ studentId });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const base64Data = image.split(";base64,").pop();
    const imgPath = path.resolve(
      "D:/projects/Rural_school_Attendance_system/python-face-service/known_faces",
      `${studentId}.jpg`
    );

    const dir = path.dirname(imgPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await fs.promises.writeFile(imgPath, base64Data, "base64");

    // ✅ Include faceImage in DB
    const student = await Student.create({
      studentId,
      name,
      className,
      faceImage: image
    });

    res.json({ message: "Student registered successfully", student });
    await fetch("http://localhost:8000/train-model"); // triggers retrain in python service
  } catch (err) {
    console.error("REGISTER FACE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
