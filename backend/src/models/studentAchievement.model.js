import mongoose from "mongoose";

const studentAchievementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
      required: true,
    },

    unlockedAt: {
      type: Date,
      default: Date.now,
    },

    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

studentAchievementSchema.index(
  { student: 1, achievement: 1 },
  { unique: true }
);

const StudentAchievement = mongoose.model(
  "StudentAchievement",
  studentAchievementSchema
);

export default StudentAchievement;
