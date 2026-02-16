import express from "express"
import Connectdb from "./db.js"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import studentRoutes from "./routes/students.js"
import attendanceRoutes from "./routes/attendance.js"
import dashboardRoutes from "./routes/dashboardRoutes.js";

Connectdb();
const app =express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true}));

app.use(express.json({ limit: "10mb" })); // ← add this
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth",authRoutes);
app.use("/api/students",studentRoutes);
app.use("/api/attendance",attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = 7000;
app.listen(PORT,()=>{
    console.log("server is run");
})