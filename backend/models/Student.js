import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  faceEncoding: {
    type: [Number],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  className: String,
  faceImage: { type: String, required: true }
});

export default mongoose.model("Student", studentSchema);
