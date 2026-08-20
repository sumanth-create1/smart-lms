import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import CourseProgress from "../models/courseProgress.model.js";

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

export const getInstructorStudents = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const enrollments = await Enrollment.find()
      .populate({
        path: "student",
        select: "name email avatar",
      })
      .populate({
        path: "course",
        match: {
          instructor: instructorId,
        },
        select: "courseTitle coursePrice courseLevel",
      })
      .sort({
        enrolledAt: -1,
      });

    // Only keep enrollments belonging to
    // courses created by this instructor.
    const instructorEnrollments = enrollments.filter(
      (enrollment) => enrollment.course,
    );

    return res.status(200).json({
      success: true,
      data: instructorEnrollments,
    });
  } catch (error) {
    console.error(
      "Get instructor students error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch instructor students",
    });
  }
};

export const getInstructorStudentDetails = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const { studentId } = req.params;

    // =====================================================
    // FIND THE INSTRUCTOR'S COURSES
    // =====================================================

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).select("_id courseTitle courseLevel coursePrice");

    const courseIds = instructorCourses.map(
      (course) => course._id,
    );

    // =====================================================
    // FIND THIS STUDENT'S ENROLLMENTS
    // =====================================================

    const enrollments = await Enrollment.find({
      student: studentId,
      course: { $in: courseIds },
    })
      .populate("student", "name email avatar")
      .populate(
        "course",
        "courseTitle courseLevel coursePrice courseThumbnail",
      )
      .sort({ enrolledAt: -1 });

    // =====================================================
    // STUDENT NOT FOUND IN INSTRUCTOR COURSES
    // =====================================================

    if (enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found in your enrolled students",
      });
    }

    // =====================================================
    // GET STUDENT
    // =====================================================

    const student = enrollments[0].student;

    // =====================================================
    // GET COURSE PROGRESS
    // =====================================================

    const courseProgress = await CourseProgress.find({
      student: studentId,
      course: { $in: courseIds },
    });

    // =====================================================
    // BUILD COURSE DETAILS
    // =====================================================

    const courses = enrollments.map((enrollment) => {
      const course = enrollment.course;

      const progress = courseProgress.find(
        (item) =>
          item.course.toString() ===
          course._id.toString(),
      );

      const lectures = progress?.lectures || [];

      const completedLectures = lectures.filter(
        (lecture) => lecture.completed,
      ).length;

      const totalLectures = lectures.length;

      let progressPercentage = 0;

      if (totalLectures > 0) {
        progressPercentage = Math.round(
          (completedLectures / totalLectures) * 100,
        );
      }

      return {
        enrollmentId: enrollment._id,

        course: {
          _id: course._id,
          courseTitle: course.courseTitle,
          courseLevel: course.courseLevel,
          coursePrice: course.coursePrice,
          courseThumbnail: course.courseThumbnail,
        },

        enrolledAt: enrollment.enrolledAt,

        progress: {
          percentage: progressPercentage,
          completedLectures,
          totalLectures,
        },
      };
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      data: {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar,
        },

        totalCourses: courses.length,

        courses,
      },
    });
  } catch (error) {
    console.error(
      "Get instructor student details error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch student details",
    });
  }
};