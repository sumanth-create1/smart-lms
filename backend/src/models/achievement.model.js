import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "🏆",
    },

    category: {
      type: String,
      enum: [
        "LEARNING",
        "COURSE",
        "STREAK",
        "TIME",
        "SPECIAL",
      ],
      default: "LEARNING",
    },

    requirement: {
      type: String,
      required: true,
    },

    requirementValue: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Achievement = mongoose.model(
  "Achievement",
  achievementSchema
);

export default Achievement;