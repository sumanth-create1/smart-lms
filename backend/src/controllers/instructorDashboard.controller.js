import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import Lecture from "../models/lecture.model.js";

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

    // Get courses created by this instructor
    const courses = await Course.find({
      instructor: instructorId,
    }).select("_id");

    const courseIds = courses.map((course) => course._id);

    // Get enrollments only for those courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate({
        path: "student",
        select: "name email avatar",
      })
      .populate({
        path: "course",
        select: "courseTitle coursePrice courseLevel",
      })
      .sort({
        enrolledAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error("Get instructor students error:", error);

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
    // 1. FIND INSTRUCTOR'S COURSES
    // =====================================================

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).select(
      "_id courseTitle courseLevel coursePrice courseThumbnail",
    );

    const courseIds = instructorCourses.map(
      (course) => course._id,
    );

    // =====================================================
    // 2. FIND STUDENT'S ENROLLMENTS
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
      .sort({
        enrolledAt: -1,
      });

    // =====================================================
    // 3. STUDENT NOT FOUND
    // =====================================================

    if (enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found in your enrolled students",
      });
    }

    // =====================================================
    // 4. GET STUDENT
    // =====================================================

    const student = enrollments[0].student;

    // =====================================================
    // 5. GET ALL LECTURES
    // =====================================================

    const lectures = await Lecture.find({
      course: { $in: courseIds },
    })
      .select(
        "_id lectureTitle order videoDuration course",
      )
      .sort({
        order: 1,
      });

    // =====================================================
    // 6. GET STUDENT COURSE PROGRESS
    // =====================================================

    const courseProgress = await CourseProgress.find({
      student: studentId,
      course: { $in: courseIds },
    });

    // =====================================================
    // 7. BUILD COURSE DETAILS
    // =====================================================

    const courses = enrollments.map((enrollment) => {
      const course = enrollment.course;

      // ---------------------------------------------------
      // Get lectures belonging to this course
      // ---------------------------------------------------

      const courseLectures = lectures.filter(
        (lecture) =>
          lecture.course.toString() ===
          course._id.toString(),
      );

      // ---------------------------------------------------
      // Get progress document for this course
      // ---------------------------------------------------

      const progressDocument = courseProgress.find(
        (item) =>
          item.course.toString() ===
          course._id.toString(),
      );

      const progressLectures =
        progressDocument?.lectures || [];

      // ---------------------------------------------------
      // Build lecture progress
      // ---------------------------------------------------

      const lectureProgress = courseLectures.map(
        (lecture) => {
          const progress = progressLectures.find(
            (item) =>
              item.lecture.toString() ===
              lecture._id.toString(),
          );

          return {
            _id: lecture._id,
            title: lecture.lectureTitle,
            order: lecture.order,
            videoDuration: lecture.videoDuration,

            completed: progress?.completed || false,

            watchedSeconds:
              progress?.watchedSeconds || 0,

            completedAt:
              progress?.completedAt || null,
          };
        },
      );

      // ---------------------------------------------------
      // Calculate progress
      // ---------------------------------------------------

      const totalLectures =
        lectureProgress.length;

      const completedLectures =
        lectureProgress.filter(
          (lecture) => lecture.completed,
        ).length;

      const remainingLectures =
        Math.max(
          totalLectures - completedLectures,
          0,
        );

      const progressPercentage =
        totalLectures > 0
          ? Math.round(
              (completedLectures /
                totalLectures) *
                100,
            )
          : 0;

      // ---------------------------------------------------
      // Determine course status
      // ---------------------------------------------------

      let status = "Not Started";

      if (
        completedLectures === totalLectures &&
        totalLectures > 0
      ) {
        status = "Completed";
      } else if (completedLectures > 0) {
        status = "In Progress";
      }

      // ---------------------------------------------------
      // Find last activity
      // ---------------------------------------------------

      const completedProgress =
        progressLectures
          .filter(
            (item) =>
              item.completed &&
              item.updatedAt,
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt) -
              new Date(a.updatedAt),
          );

      let lastActivity = null;

      if (completedProgress.length > 0) {
        const latestProgress =
          completedProgress[0];

        const latestLecture =
          courseLectures.find(
            (lecture) =>
              lecture._id.toString() ===
              latestProgress.lecture.toString(),
          );

        if (latestLecture) {
          lastActivity = {
            lectureId: latestLecture._id,
            lectureTitle:
              latestLecture.lectureTitle,
            completedAt:
              latestProgress.updatedAt,
          };
        }
      }

      // ---------------------------------------------------
      // Return course
      // ---------------------------------------------------

      return {
        enrollmentId: enrollment._id,

        course: {
          _id: course._id,
          courseTitle: course.courseTitle,
          courseLevel: course.courseLevel,
          coursePrice: course.coursePrice,
          courseThumbnail:
            course.courseThumbnail,
        },

        enrolledAt: enrollment.enrolledAt,

        progress: {
          percentage: progressPercentage,

          completedLectures,

          remainingLectures,

          totalLectures,

          status,

          lastActivity,

          lectures: lectureProgress,
        },
      };
    });

    // =====================================================
    // 8. RESPONSE
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

export const getInstructorAnalytics = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // =====================================================
    // GET INSTRUCTOR COURSES
    // =====================================================

    const courses = await Course.find({
      instructor: instructorId,
    }).select(
      "_id courseTitle coursePrice courseLevel courseThumbnail"
    );

    const courseIds = courses.map((course) => course._id);

    // =====================================================
    // GET ENROLLMENTS
    // =====================================================

    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("student", "name email avatar")
      .populate(
        "course",
        "courseTitle coursePrice courseLevel"
      )
      .sort({
        enrolledAt: -1,
      });

    // =====================================================
    // OVERVIEW
    // =====================================================

    const totalCourses = courses.length;

    const uniqueStudents = new Set(
      enrollments
        .filter((enrollment) => enrollment.student)
        .map((enrollment) =>
          enrollment.student._id.toString()
        )
    );

    const totalStudents = uniqueStudents.size;

    const totalEnrollments = enrollments.length;

    // =====================================================
    // REVENUE
    // =====================================================

    const totalRevenue = enrollments.reduce(
      (total, enrollment) => {
        return (
          total +
          (enrollment.course?.coursePrice || 0)
        );
      },
      0
    );

    // =====================================================
    // MONTHLY ENROLLMENTS
    // =====================================================

    const monthlyData = {};

    enrollments.forEach((enrollment) => {
      const date = enrollment.enrolledAt
        ? new Date(enrollment.enrolledAt)
        : new Date(enrollment.createdAt);

      const month = date.toLocaleString("en-US", {
        month: "short",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }

      monthlyData[month]++;
    });

    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyEnrollments = monthOrder.map(
      (month) => ({
        month,
        count: monthlyData[month] || 0,
      })
    );

    // =====================================================
    // COURSE PERFORMANCE
    // =====================================================

    const coursePerformance = await Promise.all(
      courses.map(async (course) => {
        const courseEnrollments =
          enrollments.filter(
            (enrollment) =>
              enrollment.course?._id?.toString() ===
              course._id.toString()
          );

        const students = new Set(
          courseEnrollments
            .filter(
              (enrollment) => enrollment.student
            )
            .map((enrollment) =>
              enrollment.student._id.toString()
            )
        );

        const revenue =
          courseEnrollments.length *
          (course.coursePrice || 0);

        return {
          _id: course._id,
          courseTitle: course.courseTitle,
          courseLevel: course.courseLevel,
          coursePrice: course.coursePrice || 0,
          students: students.size,
          enrollments: courseEnrollments.length,
          revenue,
        };
      })
    );

    // =====================================================
    // RECENT ENROLLMENTS
    // =====================================================

    const recentEnrollments = enrollments
      .slice(0, 5)
      .map((enrollment) => ({
        _id: enrollment._id,
        student: enrollment.student,
        course: enrollment.course,
        enrolledAt: enrollment.enrolledAt,
      }));

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      data: {
        overview: {
          totalCourses,
          totalStudents,
          totalEnrollments,
          totalRevenue,
        },

        monthlyEnrollments,

        coursePerformance,

        recentEnrollments,
      },
    });
  } catch (error) {
    console.error(
      "Instructor Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor analytics",
      error: error.message,
    });
  }
};