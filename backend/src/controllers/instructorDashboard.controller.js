import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";

export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get all courses created by this instructor
    const courses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    const courseIds = courses.map((course) => course._id);

    // Get all enrollments for instructor's courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("student", "name email avatar")
      .populate("course", "courseTitle coursePrice")
      .sort({ enrolledAt: -1 });

    // Total courses
    const totalCourses = courses.length;

    // Total students
    // Using Set because one student may be enrolled
    // in multiple courses.
    const uniqueStudents = new Set(
      enrollments.map((enrollment) =>
        enrollment.student?._id?.toString()
      )
    );

    const totalStudents = uniqueStudents.size;

    // Total enrollments
    const totalEnrollments = enrollments.length;

    // Calculate total course value
    const totalCourseValue = courses.reduce(
      (total, course) => total + (course.coursePrice || 0),
      0
    );

    // Course information with student count
    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Enrollment.countDocuments({
          course: course._id,
        });

        return {
          _id: course._id,
          courseTitle: course.courseTitle,
          subTitle: course.subTitle,
          category: course.category,
          courseLevel: course.courseLevel,
          coursePrice: course.coursePrice,
          courseThumbnail: course.courseThumbnail,
          studentCount,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
        };
      })
    );

    // Recent enrollments
    const recentEnrollments = enrollments
      .slice(0, 5)
      .map((enrollment) => ({
        _id: enrollment._id,
        student: enrollment.student,
        course: enrollment.course,
        enrolledAt: enrollment.enrolledAt,
      }));

    res.status(200).json({
      success: true,

      data: {
        stats: {
          totalCourses,
          totalStudents,
          totalEnrollments,
          totalCourseValue,
        },

        courses: courseStats,

        recentEnrollments,
      },
    });
  } catch (error) {
    console.error(
      "Instructor Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch instructor dashboard",
      error: error.message,
    });
  }
};