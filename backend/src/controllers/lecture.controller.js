import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureTitle } = req.body;

    const lectureCount = await Lecture.countDocuments({
      course: courseId,
    });

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if logged-in instructor owns the course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add lectures to this course.",
      });
    }

    const lecture = await Lecture.create({
      lectureTitle,
      order: lectureCount + 1,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all lectures

export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get all lectures of this course
    const lectures = await Lecture.find({ course: courseId });

    res.status(200).json({
      success: true,
      count: lectures.length,
      lectures,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update lecture controller.......

export const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { lectureTitle, isPreviewFree } = req.body;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Find the course to verify ownership
    const course = await Course.findById(lecture.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Only the course owner can update lectures
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this lecture.",
      });
    }

    lecture.lectureTitle = lectureTitle || lecture.lectureTitle;

    if (typeof isPreviewFree === "boolean") {
      lecture.isPreviewFree = isPreviewFree;
    }

    await lecture.save();

    res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete course lecture.......

export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Find lecture
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Find course
    const course = await Course.findById(lecture.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this lecture.",
      });
    }

    await Lecture.findByIdAndDelete(lectureId);

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadLectureVideo = async (req, res) => {
  const { lectureId } = req.params;
  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return res.status(404).json({
      success: false,
      message: "Lecture not found",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a video",
    });
  }

  if (lecture.publicId) {
    await cloudinary.uploader.destroy(lecture.publicId, {
      resource_type: "video",
    });
  }


  const result = await uploadToCloudinary(
    req.file.buffer,
    "smart-lms/lecture-videos",
    "video",
  );

  lecture.videoUrl = result.secure_url;

  lecture.publicId = result.public_id;

  lecture.videoDuration = Math.floor(result.duration);

  await lecture.save();

  res.status(200).json({
    success: true,
    message: "Lecture video uploaded successfully",
    lecture,
  });
};

// get lecture by id................
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// toggle preview...........

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

    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this lecture.",
      });
    }

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
