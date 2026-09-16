import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    moduleTitle: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model("Module", moduleSchema);

export default Module;