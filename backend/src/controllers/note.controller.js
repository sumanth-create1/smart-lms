import Note from "../models/note.model.js";
import Lecture from "../models/lecture.model.js";
import Course from "../models/course.model.js";

import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

// =====================================================
// HELPER — CHECK INSTRUCTOR OWNERSHIP
// =====================================================

const checkInstructorOwnership = async (
  lectureId,
  userId
) => {
  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return {
      error: {
        status: 404,
        message: "Lecture not found",
      },
    };
  }

  const course = await Course.findById(
    lecture.course
  );

  if (!course) {
    return {
      error: {
        status: 404,
        message: "Course not found",
      },
    };
  }

  if (
    course.instructor.toString() !==
    userId.toString()
  ) {
    return {
      error: {
        status: 403,
        message:
          "You are not authorized to manage notes for this lecture.",
      },
    };
  }

  return {
    lecture,
    course,
  };
};

// =====================================================
// HELPER — CREATE DOWNLOAD URL
// =====================================================

const createDownloadUrl = (note) => {
  if (!note.filePublicId) {
    return "";
  }

  const originalName =
    note.fileName || "lecture-note";

  // Make filename safe for Content-Disposition
  const safeFileName = originalName
    .replace(/[^\w.\-() ]/g, "_")
    .replace(/\s+/g, "_");

  try {
    return cloudinary.url(
      note.filePublicId,
      {
        resource_type:
          note.fileResourceType || "raw",

        type: "upload",

        secure: true,

        // Force downloaded file to use
        // the original filename
        flags: `attachment:${safeFileName}`,
      }
    );
  } catch (error) {
    console.error(
      "Create download URL error:",
      error
    );

    return note.fileUrl || "";
  }
};

// =====================================================
// CREATE WRITTEN NOTE
// =====================================================

export const createNote = async (
  req,
  res
) => {
  try {
    const { lectureId } = req.params;

    const {
      noteTitle,
      noteContent,
    } = req.body;

    // -------------------------------------------------
    // Validate title
    // -------------------------------------------------

    if (!noteTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note title is required",
      });
    }

    // -------------------------------------------------
    // Validate content
    // -------------------------------------------------

    if (!noteContent?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Note content is required",
      });
    }

    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    const ownership =
      await checkInstructorOwnership(
        lectureId,
        req.user._id
      );

    if (ownership.error) {
      return res
        .status(ownership.error.status)
        .json({
          success: false,
          message:
            ownership.error.message,
        });
    }

    // -------------------------------------------------
    // Create note
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
      message:
        "Note created successfully",

      note,
    });
  } catch (error) {
    console.error(
      "Create note error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPLOAD FILE NOTE
// =====================================================

export const uploadNoteFile = async (
  req,
  res
) => {
  try {
    const { lectureId } = req.params;

    // -------------------------------------------------
    // Check file
    // -------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a file to upload.",
      });
    }

    // -------------------------------------------------
    // Check instructor ownership
    // -------------------------------------------------

    const ownership =
      await checkInstructorOwnership(
        lectureId,
        req.user._id
      );

    if (ownership.error) {
      return res
        .status(ownership.error.status)
        .json({
          success: false,
          message:
            ownership.error.message,
        });
    }

    // -------------------------------------------------
    // Get title/content
    // -------------------------------------------------

    const noteTitle =
      req.body.noteTitle?.trim() ||
      req.file.originalname;

    const noteContent =
      req.body.noteContent?.trim() ||
      "";

    // -------------------------------------------------
    // Upload file to Cloudinary
    // -------------------------------------------------

    const result =
      await uploadToCloudinary(
        req.file.buffer,
        "smart-lms/lecture-notes",
        "raw"
      );

    // -------------------------------------------------
    // Create note
    // -------------------------------------------------

    const note = await Note.create({
      noteTitle,

      noteContent,

      lecture: lectureId,

      createdBy: req.user._id,

      fileUrl: result.secure_url,

      filePublicId: result.public_id,

      // Original filename from user's computer
      fileName: req.file.originalname,

      fileType: req.file.mimetype,

      fileSize: req.file.size,

      // Important for Cloudinary operations
      fileResourceType:
        result.resource_type || "raw",
    });

    // -------------------------------------------------
    // Generate download URL
    // -------------------------------------------------

    const downloadUrl =
      createDownloadUrl(note);

    return res.status(201).json({
      success: true,

      message:
        "Note file uploaded successfully",

      note: {
        ...note.toObject(),

        downloadUrl,
      },
    });
  } catch (error) {
    console.error(
      "Upload note file error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET NOTES FOR LECTURE
// =====================================================

export const getLectureNotes = async (
  req,
  res
) => {
  try {
    const { lectureId } = req.params;

    // -------------------------------------------------
    // Check lecture
    // -------------------------------------------------

    const lecture =
      await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // -------------------------------------------------
    // Get notes
    // -------------------------------------------------

    const notes = await Note.find({
      lecture: lectureId,
    })
      .populate("createdBy", "name")
      .sort({
        createdAt: -1,
      });

    // -------------------------------------------------
    // Add download URL
    // -------------------------------------------------

    const formattedNotes =
      notes.map((note) => {
        const noteObject =
          note.toObject();

        return {
          ...noteObject,

          // Used for View
          fileUrl: note.fileUrl,

          // Used for Download
          downloadUrl:
            createDownloadUrl(note),
        };
      });

    return res.status(200).json({
      success: true,

      count: formattedNotes.length,

      notes: formattedNotes,
    });
  } catch (error) {
    console.error(
      "Get lecture notes error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE NOTE
// =====================================================

export const updateNote = async (
  req,
  res
) => {
  try {
    const { noteId } = req.params;

    const {
      noteTitle,
      noteContent,
    } = req.body;

    // -------------------------------------------------
    // Find note
    // -------------------------------------------------

    const note =
      await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    const ownership =
      await checkInstructorOwnership(
        note.lecture,
        req.user._id
      );

    if (ownership.error) {
      return res
        .status(ownership.error.status)
        .json({
          success: false,
          message:
            ownership.error.message,
        });
    }

    // -------------------------------------------------
    // Update title
    // -------------------------------------------------

    if (
      typeof noteTitle === "string" &&
      noteTitle.trim()
    ) {
      note.noteTitle =
        noteTitle.trim();
    }

    // -------------------------------------------------
    // Update content
    // -------------------------------------------------

    if (
      typeof noteContent === "string"
    ) {
      note.noteContent =
        noteContent.trim();
    }

    await note.save();

    return res.status(200).json({
      success: true,

      message:
        "Note updated successfully",

      note,
    });
  } catch (error) {
    console.error(
      "Update note error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE NOTE
// =====================================================

export const deleteNote = async (
  req,
  res
) => {
  try {
    const { noteId } = req.params;

    // -------------------------------------------------
    // Find note
    // -------------------------------------------------

    const note =
      await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    const ownership =
      await checkInstructorOwnership(
        note.lecture,
        req.user._id
      );

    if (ownership.error) {
      return res
        .status(ownership.error.status)
        .json({
          success: false,
          message:
            ownership.error.message,
        });
    }

    // -------------------------------------------------
    // Delete Cloudinary file
    // -------------------------------------------------

    if (note.filePublicId) {
      try {
        await cloudinary.uploader.destroy(
          note.filePublicId,
          {
            resource_type:
              note.fileResourceType ||
              "raw",

            type: "upload",
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary note delete error:",
          cloudinaryError
        );
      }
    }

    // -------------------------------------------------
    // Delete database record
    // -------------------------------------------------

    await Note.findByIdAndDelete(
      noteId
    );

    return res.status(200).json({
      success: true,

      message:
        "Note deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete note error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};