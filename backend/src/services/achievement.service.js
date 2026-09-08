import Achievement from "../models/achievement.model.js";
import StudentAchievement from "../models/studentAchievement.model.js";

import CourseProgress from "../models/courseProgress.model.js";
import StudySession from "../models/studysession.model.js";
import Enrollment from "../models/enrollment.model.js";

import StudentXP from "../models/studentXP.model.js";

/**
 * =========================================================
 * LEVEL SYSTEM
 * =========================================================
 *
 * Level 1  → 0 - 999 XP
 * Level 2  → 1000 - 1999 XP
 * Level 3  → 2000 - 2999 XP
 *
 * Every 1000 XP = +1 Level
 */
const calculateLevel = (xp) => {
  return Math.floor(xp / 1000) + 1;
};

/**
 * =========================================================
 * Award XP to student
 * =========================================================
 */
const awardXP = async (studentId, xpAmount) => {
  if (!xpAmount || xpAmount <= 0) {
    return null;
  }

  let studentXP = await StudentXP.findOne({
    student: studentId,
  });

  if (!studentXP) {
    studentXP = new StudentXP({
      student: studentId,
      totalXP: 0,
      level: 1,
    });
  }

  studentXP.totalXP += xpAmount;
  studentXP.level = calculateLevel(studentXP.totalXP);

  await studentXP.save();

  return studentXP;
};

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
   * A course is considered completed when:
   *
   * completed lectures === total lectures
   */
  const completedCourseStats = await CourseProgress.aggregate([
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
     * Get lectures belonging to each course.
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
     * Calculate total lectures.
     */
    {
      $project: {
        completedLectures: 1,

        totalLectures: {
          $size: "$courseLectures",
        },
      },
    },

    /**
     * Only keep fully completed courses.
     */
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
    completedCourseStats[0]?.completedCourses ?? 0;

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
 * Convert Date to YYYY-MM-DD
 * =========================================================
 *
 * Local date components are used to avoid UTC
 * related streak calculation problems.
 */
const getDateKey = (date) => {
  const value = new Date(date);

  const year = value.getFullYear();

  const month = String(
    value.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    value.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * =========================================================
 * Calculate current study streak
 * =========================================================
 */
const calculateCurrentStreak = async (studentId) => {
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
   * Create unique study dates.
   */
  const uniqueDates = [
    ...new Set(
      sessions.map((session) =>
        getDateKey(session.startedAt),
      ),
    ),
  ];

  if (!uniqueDates.length) {
    return 0;
  }

  /**
   * Check whether latest study date is
   * today or yesterday.
   */
  const today = new Date();

  const todayKey = getDateKey(today);

  const yesterday = new Date(today);

  yesterday.setDate(
    yesterday.getDate() - 1,
  );

  const yesterdayKey =
    getDateKey(yesterday);

  const latestDate = uniqueDates[0];

  /**
   * If the student hasn't studied today
   * or yesterday, streak is broken.
   */
  if (
    latestDate !== todayKey &&
    latestDate !== yesterdayKey
  ) {
    return 0;
  }

  /**
   * Count consecutive days.
   */
  let streak = 1;

  let previousDate =
    new Date(`${latestDate}T00:00:00`);

  for (
    let i = 1;
    i < uniqueDates.length;
    i++
  ) {
    const currentDate =
      new Date(
        `${uniqueDates[i]}T00:00:00`,
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
 * Check achievement requirement
 * =========================================================
 */
const isAchievementUnlocked = (
  achievement,
  stats,
) => {
  const {
    requirement,
    requirementValue,
  } = achievement;

  switch (requirement) {
    case "LECTURES_COMPLETED":
      return (
        stats.lecturesCompleted >=
        requirementValue
      );

    case "COURSES_ENROLLED":
      return (
        stats.coursesEnrolled >=
        requirementValue
      );

    case "COURSES_COMPLETED":
      return (
        stats.coursesCompleted >=
        requirementValue
      );

    case "LEARNING_HOURS":
      return (
        stats.learningHours >=
        requirementValue
      );

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
  studentId,
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
     * Get active achievements
     * -----------------------------------------------------
     */
    const achievements =
      await Achievement.find({
        isActive: true,
      })
        .sort({ category: 1, requirementValue: 1 })
        .lean();

    if (!achievements.length) {
      return {
        stats,
        newlyUnlocked: [],
        xp: null,
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
          item.achievement.toString(),
      ),
    );

    /**
     * -----------------------------------------------------
     * Find and unlock new achievements
     * -----------------------------------------------------
     */
    const newlyUnlocked = [];

    let totalXPAwarded = 0;
    let latestXP = null;

    for (const achievement of achievements) {
      /**
       * Already unlocked.
       */
      if (
        unlockedIds.has(
          achievement._id.toString(),
        )
      ) {
        continue;
      }

      /**
       * Requirement not satisfied.
       */
      const unlocked =
        isAchievementUnlocked(
          achievement,
          stats,
        );

      if (!unlocked) {
        continue;
      }

      /**
       * ---------------------------------------------------
       * Create student achievement
       * ---------------------------------------------------
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
       * ---------------------------------------------------
       * Award XP
       * ---------------------------------------------------
       */
      const xpReward =
        achievement.xpReward || 0;

      if (xpReward > 0) {
        latestXP = await awardXP(
          studentId,
          xpReward,
        );

        totalXPAwarded += xpReward;
      }

      /**
       * ---------------------------------------------------
       * Return achievement information
       * ---------------------------------------------------
       */
      newlyUnlocked.push({
        ...achievement,

        unlockedAt:
          studentAchievement.unlockedAt,

        xpReward,

        totalXP:
          latestXP?.totalXP ?? null,

        level:
          latestXP?.level ?? null,
      });
    }

    /**
     * -----------------------------------------------------
     * Get final XP information
     * -----------------------------------------------------
     */
    if (!latestXP) {
      latestXP =
        await StudentXP.findOne({
          student: studentId,
        }).lean();
    }

    /**
     * -----------------------------------------------------
     * Final response
     * -----------------------------------------------------
     */
    return {
      stats,

      newlyUnlocked,

      xp: {
        totalXP:
          latestXP?.totalXP ?? 0,

        level:
          latestXP?.level ?? 1,

        totalXPAwarded,
      },
    };
  } catch (error) {
    console.error(
      "Achievement service error:",
      error,
    );

    throw error;
  }
};