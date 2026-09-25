import Note from "../models/note.model.js";
import Lecture from "../models/lecture.model.js";
import Course from "../models/course.model.js";

import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

// =====================================================
// HELPER — CHECK INSTRUCTOR OWNERSHIP
// =====================================================

const checkInstructorOwnership = async (lectureId, userId) => {
  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return {
      error: {
        status: 404,
        message: "Lecture not found",
      },
    };
  }

  const course = await Course.findById(lecture.course);

  if (!course) {
    return {
      error: {
        status: 404,
        message: "Course not found",
      },
    };
  }

  if (course.instructor.toString() !== userId.toString()) {
    return {
      error: {
        status: 403,
        message: "You are not authorized to manage notes for this lecture.",
      },
    };
  }

  return {
    lecture,
    course,
  };
};

// =====================================================
// HELPER — DETERMINE CLOUDINARY RESOURCE TYPE
// =====================================================

const getCloudinaryResourceType = (mimeType = "") => {
  // Images
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  // Videos
  if (mimeType.startsWith("video/")) {
    return "video";
  }

  // Audio
  if (mimeType.startsWith("audio/")) {
    return "video";
  }

  // PDF
  if (mimeType === "application/pdf") {
    return "image";
  }

  // DOCX, DOC, PPTX, PPT, XLSX, XLS,
  // ZIP, TXT, etc.
  return "raw";
};

// =====================================================
// HELPER — CREATE DOWNLOAD URL
// =====================================================

const createDownloadUrl = (note) => {
  if (!note?._id) {
    return "";
  }

  return `/api/v1/note/download/${note._id}`;
};

// =====================================================
// CREATE WRITTEN NOTE
// =====================================================

export const createNote = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const { noteTitle, noteContent } = req.body;

    // -------------------------------------------------
    // VALIDATE TITLE
    // -------------------------------------------------

    if (!noteTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note title is required",
      });
    }

    // -------------------------------------------------
    // VALIDATE CONTENT
    // -------------------------------------------------

    if (!noteContent?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }

    // -------------------------------------------------
    // CHECK OWNERSHIP
    // -------------------------------------------------

    const ownership = await checkInstructorOwnership(lectureId, req.user._id);

    if (ownership.error) {
      return res.status(ownership.error.status).json({
        success: false,
        message: ownership.error.message,
      });
    }

    // -------------------------------------------------
    // CREATE NOTE
    // -------------------------------------------------

    const note = await Note.create({
      noteTitle: noteTitle.trim(),

      noteContent: noteContent.trim(),

      lecture: lectureId,

      createdBy: req.user._id,

      fileUrl: "",
      filePublicId: "",
      fileName: "",
      fileType: "",
      fileSize: 0,
      fileResourceType: "raw",
    });

    return res.status(201).json({
      success: true,

      message: "Note created successfully",

      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================================
// DOWNLOAD NOTE FILE
// =====================================================

export const downloadNoteFile = async (req, res) => {
  try {
    const { noteId } = req.params;

    // -------------------------------------------------
    // FIND NOTE
    // -------------------------------------------------

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // -------------------------------------------------
    // CHECK FILE
    // -------------------------------------------------

    if (!note.fileUrl) {
      return res.status(404).json({
        success: false,
        message: "This note does not contain a file.",
      });
    }

    // -------------------------------------------------
    // FETCH FILE FROM CLOUDINARY
    // -------------------------------------------------

    const cloudinaryResponse = await fetch(note.fileUrl);

    if (!cloudinaryResponse.ok) {
      console.error(
        "Cloudinary download failed:",
        cloudinaryResponse.status,
        cloudinaryResponse.statusText,
      );

      return res.status(502).json({
        success: false,
        message: "Unable to download file from Cloudinary.",
      });
    }

    // -------------------------------------------------
    // FILE NAME
    // -------------------------------------------------

    const fileName = note.fileName || "lecture-note";

    const safeFileName = fileName
      .replace(/[^\w.\-() ]/g, "_")
      .replace(/\s+/g, "_");

    // -------------------------------------------------
    // CONTENT TYPE
    // -------------------------------------------------

    const contentType =
      cloudinaryResponse.headers.get("content-type") ||
      note.fileType ||
      "application/octet-stream";

    res.setHeader("Content-Type", contentType);

    // -------------------------------------------------
    // FORCE DOWNLOAD
    // -------------------------------------------------

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFileName}"`,
    );

    // -------------------------------------------------
    // CONTENT LENGTH
    // -------------------------------------------------

    const contentLength = cloudinaryResponse.headers.get("content-length");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    // -------------------------------------------------
    // SEND FILE
    // -------------------------------------------------

    const arrayBuffer = await cloudinaryResponse.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    return res.send(buffer);
  } catch (error) {
    console.error("Download note file error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download note file.",
    });
  }
};
// =====================================================
// UPLOAD FILE NOTE
// =====================================================

export const uploadNoteFile = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // -------------------------------------------------
    // CHECK FILE
    // -------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file to upload.",
      });
    }

    // -------------------------------------------------
    // CHECK INSTRUCTOR OWNERSHIP
    // -------------------------------------------------

    const ownership = await checkInstructorOwnership(lectureId, req.user._id);

    if (ownership.error) {
      return res.status(ownership.error.status).json({
        success: false,
        message: ownership.error.message,
      });
    }

    // -------------------------------------------------
    // NOTE DETAILS
    // -------------------------------------------------

    const noteTitle = req.body.noteTitle?.trim() || req.file.originalname;

    const noteContent = req.body.noteContent?.trim() || "";

    // -------------------------------------------------
    // DETERMINE RESOURCE TYPE
    // -------------------------------------------------

    const resourceType = getCloudinaryResourceType(req.file.mimetype);

    console.log("Uploading note:", {
      name: req.file.originalname,
      type: req.file.mimetype,
      resourceType,
    });

    // -------------------------------------------------
    // UPLOAD TO CLOUDINARY
    // -------------------------------------------------

    const result = await uploadToCloudinary(
      req.file.buffer,

      "smart-lms/lecture-notes",

      resourceType,

      {
        use_filename: true,

        unique_filename: true,
      },
    );

    // -------------------------------------------------
    // CREATE DATABASE NOTE
    // -------------------------------------------------

    const note = await Note.create({
      noteTitle,

      noteContent,

      lecture: lectureId,

      createdBy: req.user._id,

      fileUrl: result.secure_url,

      filePublicId: result.public_id,

      fileName: req.file.originalname,

      fileType: req.file.mimetype,

      fileSize: req.file.size,

      fileResourceType: result.resource_type || resourceType,
    });

    // -------------------------------------------------
    // CREATE DOWNLOAD URL
    // -------------------------------------------------

    const downloadUrl = createDownloadUrl(note);

    return res.status(201).json({
      success: true,

      message: "Note file uploaded successfully",

      note: {
        ...note.toObject(),

        downloadUrl,
      },
    });
  } catch (error) {
    console.error("Upload note file error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET NOTES FOR LECTURE
// =====================================================

export const getLectureNotes = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // -------------------------------------------------
    // CHECK LECTURE
    // -------------------------------------------------

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // -------------------------------------------------
    // GET NOTES
    // -------------------------------------------------

    const notes = await Note.find({
      lecture: lectureId,
    })
      .populate("createdBy", "name")
      .sort({
        createdAt: -1,
      });

    // -------------------------------------------------
    // FORMAT NOTES
    // -------------------------------------------------

    const formattedNotes = notes.map((note) => {
      const noteObject = note.toObject();

      return {
        ...noteObject,

        // NORMAL URL
        // Used by VIEW
        fileUrl: note.fileUrl || "",

        // ATTACHMENT URL
        // Used ONLY by DOWNLOAD
        downloadUrl: createDownloadUrl(note),
      };
    });

    return res.status(200).json({
      success: true,

      count: formattedNotes.length,

      notes: formattedNotes,
    });
  } catch (error) {
    console.error("Get lecture notes error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE NOTE
// =====================================================

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const { noteTitle, noteContent } = req.body;

    // -------------------------------------------------
    // FIND NOTE
    // -------------------------------------------------

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // -------------------------------------------------
    // CHECK OWNERSHIP
    // -------------------------------------------------

    const ownership = await checkInstructorOwnership(
      note.lecture,
      req.user._id,
    );

    if (ownership.error) {
      return res.status(ownership.error.status).json({
        success: false,
        message: ownership.error.message,
      });
    }

    // -------------------------------------------------
    // UPDATE TITLE
    // -------------------------------------------------

    if (typeof noteTitle === "string" && noteTitle.trim()) {
      note.noteTitle = noteTitle.trim();
    }

    // -------------------------------------------------
    // UPDATE CONTENT
    // -------------------------------------------------

    if (typeof noteContent === "string") {
      note.noteContent = noteContent.trim();
    }

    await note.save();

    return res.status(200).json({
      success: true,

      message: "Note updated successfully",

      note,
    });
  } catch (error) {
    console.error("Update note error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE NOTE
// =====================================================

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    // -------------------------------------------------
    // FIND NOTE
    // -------------------------------------------------

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // -------------------------------------------------
    // CHECK OWNERSHIP
    // -------------------------------------------------

    const ownership = await checkInstructorOwnership(
      note.lecture,
      req.user._id,
    );

    if (ownership.error) {
      return res.status(ownership.error.status).json({
        success: false,
        message: ownership.error.message,
      });
    }

    // -------------------------------------------------
    // DELETE CLOUDINARY FILE
    // -------------------------------------------------

    if (note.filePublicId) {
      try {
        await cloudinary.uploader.destroy(note.filePublicId, {
          resource_type: note.fileResourceType || "raw",

          type: "upload",
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary note delete error:", cloudinaryError);
      }
    }

    // -------------------------------------------------
    // DELETE DATABASE RECORD
    // -------------------------------------------------

    await Note.findByIdAndDelete(noteId);

    return res.status(200).json({
      success: true,

      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
