import express from "express";

import {
  createNote,
  getLectureNotes,
  updateNote,
  deleteNote,
  uploadNoteFile,
} from "../controllers/note.controller.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// =====================================================
// CREATE WRITTEN NOTE
// =====================================================

router.post(
  "/lecture/:lectureId",
  isAuthenticated,
  authorizeRoles("instructor"),
  createNote
);

// =====================================================
// UPLOAD FILE NOTE
// =====================================================

router.post(
  "/lecture/:lectureId/file",
  isAuthenticated,
  authorizeRoles("instructor"),
  upload.single("file"),
  uploadNoteFile
);

// =====================================================
// GET LECTURE NOTES
// =====================================================

router.get(
  "/lecture/:lectureId",
  isAuthenticated,
  getLectureNotes
);

// =====================================================
// UPDATE NOTE
// =====================================================

router.put(
  "/:noteId",
  isAuthenticated,
  authorizeRoles("instructor"),
  updateNote
);

// =====================================================
// DELETE NOTE
// =====================================================

router.delete(
  "/:noteId",
  isAuthenticated,
  authorizeRoles("instructor"),
  deleteNote
);

export default router;