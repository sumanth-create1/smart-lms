import CourseProgress from "../models/courseProgress.model.js";
import Lecture from "../models/lecture.model.js";
import StudySession from "../models/studysession.model.js";
import Activity from "../models/activity.model.js";
import Enrollment from "../models/enrollment.model.js";

import { checkAndUnlockAchievements } from "../services/achievement.service.js";

import calculateProgress from "../utils/calculateProgress.js";

// =====================================================
// CONSTANTS
// =====================================================

const MAX_ALLOWED_JUMP = 15;
const COMPLETION_THRESHOLD = 0.95;

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// =====================================================
// SAVE LECTURE WATCH PROGRESS
// PATCH /api/v1/progress/:lectureId
// =====================================================

export const saveProgress = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const studentId = req.user._id;

    let watchedSeconds = Number(req.body.watchedSeconds);

    // -------------------------------------------------
    // Validate watched time
    // -------------------------------------------------

    if (!Number.isFinite(watchedSeconds) || watchedSeconds < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid watched time.",
      });
    }

    // -------------------------------------------------
    // Find lecture
    // -------------------------------------------------

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    // -------------------------------------------------
    // Get video duration
    // -------------------------------------------------

    const videoDuration = Number(lecture.videoDuration) || 0;

    // -------------------------------------------------
    // Never allow progress beyond video duration
    // -------------------------------------------------

    if (videoDuration > 0) {
      watchedSeconds = Math.min(
        watchedSeconds,
        videoDuration,
      );
    }

    // -------------------------------------------------
    // Find or create course progress
    // -------------------------------------------------

    let courseProgress = await CourseProgress.findOne({
      student: studentId,
      course: lecture.course,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        student: studentId,
        course: lecture.course,
        lectures: [],
      });
    }

    // -------------------------------------------------
    // Find lecture progress
    // -------------------------------------------------

    let lectureProgress = courseProgress.lectures.find(
      (item) =>
        String(item.lecture) === String(lectureId),
    );

    let watchedDelta = 0;

    // =================================================
    // EXISTING LECTURE PROGRESS
    // =================================================

    if (lectureProgress) {
      const previousWatchedSeconds = Number(
        lectureProgress.watchedSeconds || 0,
      );

      // -------------------------------------------------
      // Prevent large forward jumps
      // -------------------------------------------------

      if (
        watchedSeconds >
        previousWatchedSeconds + MAX_ALLOWED_JUMP
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid watch progress detected. You cannot skip more than 15 seconds ahead.",
          previousWatchedSeconds,
          requestedWatchedSeconds: watchedSeconds,
          maxAllowedSeconds:
            previousWatchedSeconds +
            MAX_ALLOWED_JUMP,
        });
      }

      // -------------------------------------------------
      // Calculate actual progress delta
      // -------------------------------------------------

      watchedDelta = Math.max(
        0,
        watchedSeconds - previousWatchedSeconds,
      );

      // -------------------------------------------------
      // Never move progress backwards
      // -------------------------------------------------

      lectureProgress.watchedSeconds = Math.max(
        previousWatchedSeconds,
        watchedSeconds,
      );
    }

    // =================================================
    // FIRST PROGRESS FOR LECTURE
    // =================================================

    else {
      // -------------------------------------------------
      // Prevent starting at a large timestamp
      // -------------------------------------------------

      if (watchedSeconds > MAX_ALLOWED_JUMP) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid watch progress detected. You must start watching from the beginning.",
          maxAllowedSeconds: MAX_ALLOWED_JUMP,
        });
      }

      // -------------------------------------------------
      // Initial watched time
      // -------------------------------------------------

      watchedDelta = watchedSeconds;

      courseProgress.lectures.push({
        lecture: lectureId,
        watchedSeconds,
        completed: false,
      });

      // -------------------------------------------------
      // Create lecture started activity
      // -------------------------------------------------

      if (watchedSeconds > 0) {
        await Activity.create({
          student: studentId,
          type: "LECTURE_STARTED",
          course: lecture.course,
          lecture: lectureId,
          message: `Started lecture: ${lecture.lectureTitle}`,
        });
      }
    }

    // =================================================
    // SAVE COURSE PROGRESS
    // =================================================

    await courseProgress.save();

    // =================================================
    // SAVE STUDY SESSION
    // =================================================

    if (watchedDelta > 0) {
      await saveStudySession({
        studentId,
        courseId: lecture.course,
        lectureId,
        watchedDelta,
      });
    }

    // =================================================
    // CALCULATE COURSE PROGRESS
    // =================================================

    const totalLectures =
      await Lecture.countDocuments({
        course: lecture.course,
      });

    const completionPercentage =
      calculateProgress(
        courseProgress,
        totalLectures,
      );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Progress saved successfully.",
      progress: courseProgress,
      completionPercentage,
    });
  } catch (error) {
    console.error(
      "Save progress error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to save progress.",
    });
  }
};

// =====================================================
// GET COURSE PROGRESS
// GET /api/v1/progress/course/:courseId
// =====================================================

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // -------------------------------------------------
    // Count lectures
    // -------------------------------------------------

    const totalLectures =
      await Lecture.countDocuments({
        course: courseId,
      });

    // -------------------------------------------------
    // Find progress
    // -------------------------------------------------

    const courseProgress =
      await CourseProgress.findOne({
        student: studentId,
        course: courseId,
      }).populate("lectures.lecture");

    // -------------------------------------------------
    // No progress yet
    // -------------------------------------------------

    if (!courseProgress) {
      return res.status(200).json({
        success: true,

        progress: {
          student: studentId,
          course: courseId,
          lectures: [],
        },

        completionPercentage: 0,
      });
    }

    // -------------------------------------------------
    // Calculate progress
    // -------------------------------------------------

    const completionPercentage =
      calculateProgress(
        courseProgress,
        totalLectures,
      );

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      progress: courseProgress,
      completionPercentage,
    });
  } catch (error) {
    console.error(
      "Get course progress error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch course progress.",
    });
  }
};

// =====================================================
// MARK LECTURE AS COMPLETED
// PATCH /api/v1/progress/complete/:lectureId
// =====================================================

export const markLectureCompleted = async (
  req,
  res,
) => {
  try {
    const { lectureId } = req.params;
    const studentId = req.user._id;

    // -------------------------------------------------
    // Find lecture
    // -------------------------------------------------

    const lecture =
      await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    // -------------------------------------------------
    // Find course progress
    // -------------------------------------------------

    const courseProgress =
      await CourseProgress.findOne({
        student: studentId,
        course: lecture.course,
      });

    if (!courseProgress) {
      return res.status(400).json({
        success: false,
        message:
          "Start watching the lecture before completing it.",
      });
    }

    // -------------------------------------------------
    // Find lecture progress
    // -------------------------------------------------

    const lectureProgress =
      courseProgress.lectures.find(
        (item) =>
          String(item.lecture) ===
          String(lectureId),
      );

    if (!lectureProgress) {
      return res.status(400).json({
        success: false,
        message:
          "Start watching this lecture before marking it as completed.",
      });
    }

    // -------------------------------------------------
    // Already completed
    // -------------------------------------------------

    if (lectureProgress.completed) {
      return res.status(200).json({
        success: true,
        message: "Lecture is already completed.",
        progress: courseProgress,
        newlyUnlocked: [],
      });
    }

    // =================================================
    // CHECK MINIMUM WATCH REQUIREMENT
    // =================================================

    const videoDuration =
      Number(lecture.videoDuration) || 0;

    const watchedSeconds =
      Number(
        lectureProgress.watchedSeconds,
      ) || 0;

    if (videoDuration > 0) {
      const requiredSeconds =
        Math.ceil(
          videoDuration *
            COMPLETION_THRESHOLD,
        );

      if (watchedSeconds < requiredSeconds) {
        return res.status(400).json({
          success: false,

          message:
            "Watch at least 95% of the lecture before completing it.",

          watchedSeconds,

          requiredSeconds,

          completionPercentage: Number(
            (
              (watchedSeconds /
                videoDuration) *
              100
            ).toFixed(1),
          ),
        });
      }
    }

    // =================================================
    // MARK COMPLETED
    // =================================================

    lectureProgress.completed = true;

    await courseProgress.save();

    // =================================================
    // CREATE COMPLETION ACTIVITY
    // =================================================

    await Activity.create({
      student: studentId,
      type: "LECTURE_COMPLETED",
      course: lecture.course,
      lecture: lectureId,
      message: `Completed lecture: ${lecture.lectureTitle}`,
    });

    // =================================================
    // CHECK ACHIEVEMENTS
    // =================================================

    let achievementResult = {
      stats: null,
      newlyUnlocked: [],
    };

    try {
      achievementResult =
        await checkAndUnlockAchievements(
          studentId,
        );

      console.log(
        "🏆 ACHIEVEMENT RESULT:",
        JSON.stringify(
          achievementResult,
          null,
          2,
        ),
      );
    } catch (achievementError) {
      console.error(
        "❌ Achievement check failed:",
        achievementError,
      );

      // Achievement failure must not
      // break lecture completion.
    }

    // =================================================
    // CALCULATE COURSE PROGRESS
    // =================================================

    const totalLectures =
      await Lecture.countDocuments({
        course: lecture.course,
      });

    const completionPercentage =
      calculateProgress(
        courseProgress,
        totalLectures,
      );

    // =================================================
    // FINAL RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Lecture marked as completed.",

      progress: courseProgress,

      completionPercentage,

      newlyUnlocked:
        achievementResult.newlyUnlocked ||
        [],
    });
  } catch (error) {
    console.error(
      "Mark lecture completed error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to mark lecture as completed.",
    });
  }
};

// =====================================================
// MARK LECTURE AS INCOMPLETE
// PATCH /api/v1/progress/uncomplete/:lectureId
// =====================================================

export const unmarkLectureCompleted = async (
  req,
  res,
) => {
  try {
    const { lectureId } = req.params;
    const studentId = req.user._id;

    // -------------------------------------------------
    // Validate lecture ID
    // -------------------------------------------------

    if (!lectureId) {
      return res.status(400).json({
        success: false,
        message: "Lecture ID is required.",
      });
    }

    // -------------------------------------------------
    // Find course progress
    // -------------------------------------------------

    const courseProgress =
      await CourseProgress.findOne({
        student: studentId,
        "lectures.lecture": lectureId,
      });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message:
          "Course progress not found.",
      });
    }

    // -------------------------------------------------
    // Find lecture progress
    // -------------------------------------------------

    const lectureProgress =
      courseProgress.lectures.find(
        (item) =>
          String(item.lecture) ===
          String(lectureId),
      );

    if (!lectureProgress) {
      return res.status(404).json({
        success: false,
        message:
          "Lecture progress not found.",
      });
    }

    // -------------------------------------------------
    // Mark incomplete
    // -------------------------------------------------

    lectureProgress.completed = false;

    await courseProgress.save();

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Lecture marked as incomplete.",
      progress: courseProgress,
    });
  } catch (error) {
    console.error(
      "Unmark lecture completed error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to mark lecture as incomplete.",
    });
  }
};

// =====================================================
// GET INDIVIDUAL LECTURE PROGRESS
// GET /api/v1/progress/lecture/:lectureId
// =====================================================

export const getLectureProgress = async (
  req,
  res,
) => {
  try {
    const { lectureId } = req.params;
    const studentId = req.user._id;

    // -------------------------------------------------
    // Find lecture
    // -------------------------------------------------

    const lecture =
      await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    // -------------------------------------------------
    // Find course progress
    // -------------------------------------------------

    const courseProgress =
      await CourseProgress.findOne({
        student: studentId,
        course: lecture.course,
      });

    // -------------------------------------------------
    // No course progress
    // -------------------------------------------------

    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        progress:
          createEmptyLectureProgress(
            lectureId,
          ),
      });
    }

    // -------------------------------------------------
    // Find lecture progress
    // -------------------------------------------------

    const lectureProgress =
      courseProgress.lectures.find(
        (item) =>
          String(item.lecture) ===
          String(lectureId),
      );

    // -------------------------------------------------
    // No lecture progress
    // -------------------------------------------------

    if (!lectureProgress) {
      return res.status(200).json({
        success: true,
        progress:
          createEmptyLectureProgress(
            lectureId,
          ),
      });
    }

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      progress: {
        lecture: lectureId,

        watchedSeconds: Number(
          lectureProgress.watchedSeconds ||
            0,
        ),

        completed: Boolean(
          lectureProgress.completed,
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get lecture progress error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch lecture progress.",
    });
  }
};

// =====================================================
// GET STUDENT PROGRESS OVERVIEW
// GET /api/v1/progress/student
// =====================================================

export const getStudentProgress = async (
  req,
  res,
) => {
  try {
    const studentId = req.user._id;

    // =================================================
    // GET ENROLLMENTS
    // =================================================

    const enrollments =
      await Enrollment.find({
        student: studentId,
      })
        .populate({
          path: "course",
          select: "courseTitle thumbnail",
        })
        .sort({ enrolledAt: -1 })
        .lean();

    // =================================================
    // NO ENROLLMENTS
    // =================================================

    if (!enrollments.length) {
      return res.status(200).json({
        success: true,
        data:
          createEmptyStudentProgress(),
      });
    }

    // =================================================
    // COURSE IDS
    // =================================================

    const courseIds = enrollments
      .map(
        (enrollment) =>
          enrollment.course?._id,
      )
      .filter(Boolean);

    // =================================================
    // FETCH DATA IN PARALLEL
    // =================================================

    const [
      progressRecords,
      lectureCounts,
      studySessions,
    ] = await Promise.all([
      CourseProgress.find({
        student: studentId,
        course: {
          $in: courseIds,
        },
      }).lean(),

      Lecture.aggregate([
        {
          $match: {
            course: {
              $in: courseIds,
            },
          },
        },

        {
          $group: {
            _id: "$course",
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      StudySession.find({
        student: studentId,
      }).lean(),
    ]);

    // =================================================
    // CREATE LOOKUP MAPS
    // =================================================

    const progressMap =
      new Map(
        progressRecords.map(
          (progress) => [
            String(progress.course),
            progress,
          ],
        ),
      );

    const lectureCountMap =
      new Map(
        lectureCounts.map(
          (item) => [
            String(item._id),
            item.count,
          ],
        ),
      );

    // =================================================
    // BUILD COURSE PROGRESS
    // =================================================

    let totalLectures = 0;
    let completedLectures = 0;
    let totalWatchedSeconds = 0;

    const courses = enrollments
      .filter(
        (enrollment) =>
          enrollment.course,
      )
      .map((enrollment) => {
        const course =
          enrollment.course;

        const courseId =
          String(course._id);

        const totalCourseLectures =
          lectureCountMap.get(
            courseId,
          ) || 0;

        const courseProgress =
          progressMap.get(
            courseId,
          );

        const lectureProgress =
          courseProgress?.lectures ||
          [];

        // -------------------------------------------------
        // Completed lectures
        // -------------------------------------------------

        const completedCourseLectures =
          lectureProgress.filter(
            (lecture) =>
              lecture.completed ===
              true,
          ).length;

        // -------------------------------------------------
        // Watched time
        // -------------------------------------------------

        const watchedSeconds =
          lectureProgress.reduce(
            (
              total,
              lecture,
            ) =>
              total +
              Number(
                lecture.watchedSeconds ||
                  0,
              ),
            0,
          );

        // -------------------------------------------------
        // Progress percentage
        // -------------------------------------------------

        const progressPercentage =
          totalCourseLectures > 0
            ? Math.round(
                (completedCourseLectures /
                  totalCourseLectures) *
                  100,
              )
            : 0;

        // -------------------------------------------------
        // Course status
        // -------------------------------------------------

        const status =
          getCourseStatus({
            totalLectures:
              totalCourseLectures,

            completedLectures:
              completedCourseLectures,

            watchedSeconds,

            progressPercentage,
          });

        // -------------------------------------------------
        // Global counters
        // -------------------------------------------------

        totalLectures +=
          totalCourseLectures;

        completedLectures +=
          completedCourseLectures;

        totalWatchedSeconds +=
          watchedSeconds;

        // -------------------------------------------------
        // Course result
        // -------------------------------------------------

        return {
          courseId: course._id,

          courseTitle:
            course.courseTitle,

          thumbnail:
            course.thumbnail ||
            null,

          totalLectures:
            totalCourseLectures,

          completedLectures:
            completedCourseLectures,

          watchedSeconds,

          progressPercentage,

          status,
        };
      });

    // =================================================
    // COURSE COUNTS
    // =================================================

    const totalCourses =
      courses.length;

    const completedCourses =
      courses.filter(
        (course) =>
          course.status ===
          "completed",
      ).length;

    const inProgressCourses =
      courses.filter(
        (course) =>
          course.status ===
          "in-progress",
      ).length;

    const notStartedCourses =
      courses.filter(
        (course) =>
          course.status ===
          "not-started",
      ).length;

    // =================================================
    // OVERALL PROGRESS
    // =================================================

    const overallProgress =
      totalLectures > 0
        ? Math.round(
            (completedLectures /
              totalLectures) *
              100,
          )
        : 0;

    // =================================================
    // WEEKLY ACTIVITY
    // =================================================

    const weeklyActivity =
      buildWeeklyActivity(
        studySessions,
      );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      data: {
        totalCourses,

        completedCourses,

        inProgressCourses,

        notStartedCourses,

        totalLectures,

        completedLectures,

        overallProgress,

        totalWatchedSeconds,

        courses,

        weeklyActivity,
      },
    });
  } catch (error) {
    console.error(
      "Get student progress error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load student progress.",
    });
  }
};

// =====================================================
// HELPER: GET COURSE STATUS
// =====================================================

const getCourseStatus = ({
  totalLectures,
  completedLectures,
  watchedSeconds,
  progressPercentage,
}) => {
  if (
    totalLectures > 0 &&
    progressPercentage === 100
  ) {
    return "completed";
  }

  if (
    completedLectures > 0 ||
    watchedSeconds > 0
  ) {
    return "in-progress";
  }

  return "not-started";
};

// =====================================================
// HELPER: BUILD WEEKLY ACTIVITY
// =====================================================

const buildWeeklyActivity = (
  sessions = [],
) => {
  const activity =
    createEmptyWeeklyActivity();

  // -------------------------------------------------
  // Current week boundaries
  // -------------------------------------------------

  const now = new Date();

  const startOfWeek =
    new Date(now);

  startOfWeek.setDate(
    now.getDate() -
      now.getDay(),
  );

  startOfWeek.setHours(
    0,
    0,
    0,
    0,
  );

  const endOfWeek =
    new Date(startOfWeek);

  endOfWeek.setDate(
    startOfWeek.getDate() +
      7,
  );

  // -------------------------------------------------
  // Process study sessions
  // -------------------------------------------------

  sessions.forEach(
    (session) => {
      if (!session.startedAt) {
        return;
      }

      const sessionDate =
        new Date(
          session.startedAt,
        );

      if (
        Number.isNaN(
          sessionDate.getTime(),
        ) ||
        sessionDate <
          startOfWeek ||
        sessionDate >=
          endOfWeek
      ) {
        return;
      }

      const dayIndex =
        sessionDate.getDay();

      const durationSeconds =
        Number(
          session.durationSeconds ||
            0,
        );

      activity[
        dayIndex
      ].seconds +=
        durationSeconds;
    },
  );

  // -------------------------------------------------
  // Convert seconds to hours
  // -------------------------------------------------

  activity.forEach(
    (item) => {
      item.hours = Number(
        (
          item.seconds /
          3600
        ).toFixed(2),
      );
    },
  );

  return activity;
};

// =====================================================
// HELPER: CREATE EMPTY WEEKLY ACTIVITY
// =====================================================

const createEmptyWeeklyActivity =
  () => {
    return WEEK_DAYS.map(
      (day) => ({
        day,
        seconds: 0,
        hours: 0,
      }),
    );
  };

// =====================================================
// HELPER: EMPTY LECTURE PROGRESS
// =====================================================

const createEmptyLectureProgress = (
  lectureId,
) => {
  return {
    lecture: lectureId,
    watchedSeconds: 0,
    completed: false,
  };
};

// =====================================================
// HELPER: EMPTY STUDENT PROGRESS
// =====================================================

const createEmptyStudentProgress =
  () => {
    return {
      totalCourses: 0,

      completedCourses: 0,

      inProgressCourses: 0,

      notStartedCourses: 0,

      totalLectures: 0,

      completedLectures: 0,

      overallProgress: 0,

      totalWatchedSeconds: 0,

      courses: [],

      weeklyActivity:
        createEmptyWeeklyActivity(),
    };
  };

// =====================================================
// SAVE STUDY SESSION
// =====================================================

const saveStudySession = async ({
  studentId,
  courseId,
  lectureId,
  watchedDelta,
}) => {
  const now = new Date();

  const startOfDay =
    new Date(now);

  startOfDay.setHours(
    0,
    0,
    0,
    0,
  );

  const endOfDay =
    new Date(now);

  endOfDay.setHours(
    23,
    59,
    59,
    999,
  );

  // =================================================
  // FIND TODAY'S SESSION
  // =================================================

  let session =
    await StudySession.findOne({
      student: studentId,

      course: courseId,

      lecture: lectureId,

      startedAt: {
        $gte: startOfDay,

        $lte: endOfDay,
      },
    });

  // =================================================
  // CREATE NEW SESSION
  // =================================================

  if (!session) {
    await StudySession.create({
      student: studentId,

      course: courseId,

      lecture: lectureId,

      durationSeconds:
        watchedDelta,

      startedAt: now,

      endedAt: now,
    });

    return;
  }

  // =================================================
  // UPDATE EXISTING SESSION
  // =================================================

  session.durationSeconds =
    Number(
      session.durationSeconds ||
        0,
    ) + watchedDelta;

  session.endedAt = now;

  await session.save();
};