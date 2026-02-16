import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Present"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  className: String,
  name: String,
});

export default mongoose.model("Attendance", attendanceSchema);
