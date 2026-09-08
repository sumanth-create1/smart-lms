import mongoose from "mongoose";

const studentXPSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const StudentXP = mongoose.model("StudentXP", studentXPSchema);

export default StudentXP;