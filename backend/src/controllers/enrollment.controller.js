import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import Activity from "../models/activity.model.js";

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    // ==========================================
    // CREATE ENROLLMENT ACTIVITY
    // ==========================================

    await Activity.create({
      student: studentId,
      type: "COURSE_ENROLLED",
      course: courseId,
      message: `Enrolled in ${course.courseTitle}`,
    });

    return res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      enrollment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({
      student: studentId,
    }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "name email",
      },
    });

    const courses = enrollments.map((enrollment) => enrollment.course);

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
