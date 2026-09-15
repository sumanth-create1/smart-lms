import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

// =====================================================
// CREATE LECTURE
// =====================================================

export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    const {
      lectureTitle,
      lectureContent,
      isPreviewFree,
    } = req.body;

    // -------------------------------------------------
    // Validate lecture title
    // -------------------------------------------------

    if (!lectureTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Lecture title is required",
      });
    }

    // -------------------------------------------------
    // Check if course exists
    // -------------------------------------------------

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -------------------------------------------------
    // Check instructor ownership
    // -------------------------------------------------

    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to add lectures to this course.",
      });
    }

    // -------------------------------------------------
    // Calculate lecture order
    // -------------------------------------------------

    const lectureCount = await Lecture.countDocuments({
      course: courseId,
    });

    // -------------------------------------------------
    // Create lecture
    // -------------------------------------------------

    const lecture = await Lecture.create({
      lectureTitle: lectureTitle.trim(),

      lectureContent:
        typeof lectureContent === "string"
          ? lectureContent.trim()
          : "",

      order: lectureCount + 1,

      course: courseId,

      isPreviewFree:
        typeof isPreviewFree === "boolean"
          ? isPreviewFree
          : false,
    });

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.error("Create lecture error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL COURSE LECTURES
// =====================================================

export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    // -------------------------------------------------
    // Check course
    // -------------------------------------------------

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -------------------------------------------------
    // Get lectures
    // -------------------------------------------------

    const lectures = await Lecture.find({
      course: courseId,
    }).sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      count: lectures.length,
      lectures,
    });
  } catch (error) {
    console.error("Get course lectures error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE LECTURE
// =====================================================

export const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const {
      lectureTitle,
      lectureContent,
      isPreviewFree,
    } = req.body;

    // -------------------------------------------------
    // Find lecture
    // -------------------------------------------------

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // -------------------------------------------------
    // Find course
    // -------------------------------------------------

    const course = await Course.findById(lecture.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this lecture.",
      });
    }

    // -------------------------------------------------
    // Update title
    // -------------------------------------------------

    if (
      typeof lectureTitle === "string" &&
      lectureTitle.trim()
    ) {
      lecture.lectureTitle = lectureTitle.trim();
    }

    // -------------------------------------------------
    // Update lecture content
    // -------------------------------------------------

    if (typeof lectureContent === "string") {
      lecture.lectureContent = lectureContent.trim();
    }

    // -------------------------------------------------
    // Update preview status
    // -------------------------------------------------

    if (typeof isPreviewFree === "boolean") {
      lecture.isPreviewFree = isPreviewFree;
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("Update lecture error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE LECTURE
// =====================================================

export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // -------------------------------------------------
    // Find lecture
    // -------------------------------------------------

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // -------------------------------------------------
    // Find course
    // -------------------------------------------------

    const course = await Course.findById(lecture.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this lecture.",
      });
    }

    // -------------------------------------------------
    // Delete lecture
    // -------------------------------------------------

    await Lecture.findByIdAndDelete(lectureId);

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.error("Delete lecture error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPLOAD LECTURE VIDEO
// =====================================================

export const uploadLectureVideo = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // -------------------------------------------------
    // Check uploaded file
    // -------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a video",
      });
    }

    // -------------------------------------------------
    // Delete old video
    // -------------------------------------------------

    if (lecture.publicId) {
      await cloudinary.uploader.destroy(
        lecture.publicId,
        {
          resource_type: "video",
        },
      );
    }

    // -------------------------------------------------
    // Upload new video
    // -------------------------------------------------

    const result = await uploadToCloudinary(
      req.file.buffer,
      "smart-lms/lecture-videos",
      "video",
    );

    lecture.videoUrl = result.secure_url;
    lecture.publicId = result.public_id;
    lecture.videoDuration = Math.floor(
      result.duration,
    );

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture video uploaded successfully",
      lecture,
    });
  } catch (error) {
    console.error("Upload lecture video error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET LECTURE BY ID
// =====================================================

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("Get lecture error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// TOGGLE PREVIEW
// =====================================================

export const togglePreview = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const course = await Course.findById(lecture.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to modify this lecture.",
      });
    }

    // -------------------------------------------------
    // Toggle
    // -------------------------------------------------

    lecture.isPreviewFree = !lecture.isPreviewFree;

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture preview updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("Toggle preview error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};