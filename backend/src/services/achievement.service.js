import Achievement from "../models/achievement.model.js";
import StudentAchievement from "../models/studentAchievement.model.js";

import CourseProgress from "../models/courseProgress.model.js";
import StudySession from "../models/studysession.model.js";
import Enrollment from "../models/enrollment.model.js";
import Lecture from "../models/lecture.model.js";

/**
 * =========================================================
 * Get student's learning statistics
 * =========================================================
 */
const getStudentStats = async (studentId) => {
  /**
   * -------------------------------------------------------
   * 1. Completed lectures
   * -------------------------------------------------------
   *
   * CourseProgress structure:
   *
   * {
   *   student,
   *   course,
   *   lectures: [
   *     {
   *       lecture,
   *       watchedSeconds,
   *       completed
   *     }
   *   ]
   * }
   */
  const lectureStats = await CourseProgress.aggregate([
    {
      $match: {
        student: studentId,
      },
    },
    {
      $unwind: "$lectures",
    },
    {
      $match: {
        "lectures.completed": true,
      },
    },
    {
      $count: "completedLectures",
    },
  ]);

  const completedLectures =
    lectureStats[0]?.completedLectures ?? 0;

  /**
   * -------------------------------------------------------
   * 2. Enrolled courses
   * -------------------------------------------------------
   */
  const enrolledCourses = await Enrollment.countDocuments({
    student: studentId,
  });

  /**
   * -------------------------------------------------------
   * 3. Completed courses
   * -------------------------------------------------------
   *
   * A course is completed when:
   *
   * completed lectures === total lectures
   *
   * for that course.
   */
  const courseProgress = await CourseProgress.aggregate([
    {
      $match: {
        student: studentId,
      },
    },

    {
      $unwind: {
        path: "$lectures",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $group: {
        _id: "$course",

        completedLectures: {
          $sum: {
            $cond: [
              "$lectures.completed",
              1,
              0,
            ],
          },
        },
      },
    },

    /**
     * Get all lectures belonging to the course.
     */
    {
      $lookup: {
        from: "lectures",
        localField: "_id",
        foreignField: "course",
        as: "courseLectures",
      },
    },

    /**
     * Compare completed lectures
     * with total lectures.
     */
    {
      $project: {
        completedLectures: 1,
        totalLectures: {
          $size: "$courseLectures",
        },
      },
    },

    {
      $match: {
        $expr: {
          $and: [
            {
              $gt: ["$totalLectures", 0],
            },
            {
              $eq: [
                "$completedLectures",
                "$totalLectures",
              ],
            },
          ],
        },
      },
    },

    {
      $count: "completedCourses",
    },
  ]);

  const completedCourses =
    courseProgress[0]?.completedCourses ?? 0;

  /**
   * -------------------------------------------------------
   * 4. Learning hours
   * -------------------------------------------------------
   */
  const studyStats = await StudySession.aggregate([
    {
      $match: {
        student: studentId,
      },
    },
    {
      $group: {
        _id: null,
        totalStudySeconds: {
          $sum: "$durationSeconds",
        },
      },
    },
  ]);

  const totalStudySeconds =
    studyStats[0]?.totalStudySeconds ?? 0;

  const learningHours =
    totalStudySeconds / 3600;

  /**
   * -------------------------------------------------------
   * 5. Current streak
   * -------------------------------------------------------
   */
  const streak =
    await calculateCurrentStreak(studentId);

  return {
    lecturesCompleted: completedLectures,
    coursesEnrolled: enrolledCourses,
    coursesCompleted: completedCourses,
    learningHours,
    streak,
  };
};

/**
 * =========================================================
 * Convert Date to local YYYY-MM-DD
 * =========================================================
 *
 * Using local date components avoids UTC-related
 * streak problems.
 */
const getDateKey = (date) => {
  const value = new Date(date);

  const year = value.getFullYear();
  const month = String(
    value.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    value.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * =========================================================
 * Calculate current study streak
 * =========================================================
 */
const calculateCurrentStreak = async (
  studentId
) => {
  const sessions = await StudySession.find({
    student: studentId,
  })
    .select("startedAt")
    .sort({ startedAt: -1 })
    .lean();

  if (!sessions.length) {
    return 0;
  }

  /**
   * -------------------------------------------------------
   * Create unique study dates
   * -------------------------------------------------------
   *
   * Example:
   *
   * 2026-09-07
   * 2026-09-06
   * 2026-09-05
   *
   * => 3 day streak
   */
  const uniqueDates = [
    ...new Set(
      sessions.map((session) =>
        getDateKey(session.startedAt)
      )
    ),
  ];

  if (!uniqueDates.length) {
    return 0;
  }

  /**
   * -------------------------------------------------------
   * Check whether the latest study day is today
   * or yesterday.
   * -------------------------------------------------------
   *
   * If the student hasn't studied for more than
   * one day, the current streak is broken.
   */
  const today = new Date();

  const todayKey = getDateKey(today);

  const yesterday = new Date(today);

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const yesterdayKey =
    getDateKey(yesterday);

  const latestDate = uniqueDates[0];

  if (
    latestDate !== todayKey &&
    latestDate !== yesterdayKey
  ) {
    return 0;
  }

  /**
   * -------------------------------------------------------
   * Count consecutive dates
   * -------------------------------------------------------
   */
  let streak = 1;

  let previousDate = new Date(
    `${latestDate}T00:00:00`
  );

  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(
      `${uniqueDates[i]}T00:00:00`
    );

    const difference =
      (previousDate - currentDate) /
      (1000 * 60 * 60 * 24);

    if (difference !== 1) {
      break;
    }

    streak++;

    previousDate = currentDate;
  }

  return streak;
};

/**
 * =========================================================
 * Check whether achievement requirement is satisfied
 * =========================================================
 */
const isAchievementUnlocked = (
  achievement,
  stats
) => {
  const {
    requirement,
    requirementValue,
  } = achievement;

  switch (requirement) {
    /**
     * -----------------------------------------------------
     * Lecture achievements
     * -----------------------------------------------------
     */
    case "LECTURES_COMPLETED":
      return (
        stats.lecturesCompleted >=
        requirementValue
      );

    /**
     * -----------------------------------------------------
     * Enrollment achievements
     * -----------------------------------------------------
     */
    case "COURSES_ENROLLED":
      return (
        stats.coursesEnrolled >=
        requirementValue
      );

    /**
     * -----------------------------------------------------
     * Course completion achievements
     * -----------------------------------------------------
     */
    case "COURSES_COMPLETED":
      return (
        stats.coursesCompleted >=
        requirementValue
      );

    /**
     * -----------------------------------------------------
     * Learning time achievements
     * -----------------------------------------------------
     */
    case "LEARNING_HOURS":
      return (
        stats.learningHours >=
        requirementValue
      );

    /**
     * -----------------------------------------------------
     * Streak achievements
     * -----------------------------------------------------
     */
    case "STREAK":
      return (
        stats.streak >=
        requirementValue
      );

    default:
      return false;
  }
};

/**
 * =========================================================
 * Check and unlock achievements
 * =========================================================
 */
export const checkAndUnlockAchievements = async (
  studentId
) => {
  try {
    /**
     * -----------------------------------------------------
     * Get current student statistics
     * -----------------------------------------------------
     */
    const stats =
      await getStudentStats(studentId);

    /**
     * -----------------------------------------------------
     * Get all active achievements
     * -----------------------------------------------------
     */
    const achievements =
      await Achievement.find({
        isActive: true,
      }).lean();

    if (!achievements.length) {
      return {
        stats,
        newlyUnlocked: [],
      };
    }

    /**
     * -----------------------------------------------------
     * Get already unlocked achievements
     * -----------------------------------------------------
     */
    const unlockedAchievements =
      await StudentAchievement.find({
        student: studentId,
      })
        .select("achievement")
        .lean();

    const unlockedIds = new Set(
      unlockedAchievements.map(
        (item) =>
          item.achievement.toString()
      )
    );

    /**
     * -----------------------------------------------------
     * Find newly unlocked achievements
     * -----------------------------------------------------
     */
    const newlyUnlocked = [];

    for (const achievement of achievements) {
      /**
       * Already unlocked?
       */
      if (
        unlockedIds.has(
          achievement._id.toString()
        )
      ) {
        continue;
      }

      /**
       * Check requirement.
       */
      const unlocked =
        isAchievementUnlocked(
          achievement,
          stats
        );

      if (!unlocked) {
        continue;
      }

      /**
       * Unlock achievement.
       */
      const studentAchievement =
        await StudentAchievement.create({
          student: studentId,
          achievement: achievement._id,
          unlockedAt: new Date(),
          progress:
            achievement.requirementValue,
        });

      /**
       * Return newly unlocked achievement.
       */
      newlyUnlocked.push({
        ...achievement,
        unlockedAt:
          studentAchievement.unlockedAt,
      });
    }

    return {
      stats,
      newlyUnlocked,
    };
  } catch (error) {
    console.error(
      "Achievement service error:",
      error
    );

    throw error;
  }
};