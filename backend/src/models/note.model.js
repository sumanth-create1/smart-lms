import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    // =========================
    // NOTE INFORMATION
    // =========================
    noteTitle: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
    },

    noteContent: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // UPLOADED FILE
    // =========================
    fileUrl: {
      type: String,
      default: "",
    },

    filePublicId: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    // Important for Cloudinary delete/download
    fileResourceType: {
      type: String,
      default: "raw",
    },

    // =========================
    // RELATIONSHIPS
    // =========================
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;