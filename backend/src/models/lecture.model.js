import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
    },

    lectureContent: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      required: true,
    },

    videoUrl: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },

    videoDuration: {
      type: Number,
      default: 0,
    },

    isPreviewFree: {
      type: Boolean,
      default: false,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
