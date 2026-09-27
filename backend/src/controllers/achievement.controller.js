import Achievement from "../models/achievement.model.js";
import StudentAchievement from "../models/studentAchievement.model.js";
import StudentXP from "../models/studentXP.model.js";

import { getStudentStats } from "../services/achievement.service.js";

/**
 * =========================================================
 * Get student's achievements
 * =========================================================
 */
export const getStudentAchievements = async (req, res) => {
  try {
    const studentId = req.user._id;

    const achievements = await StudentAchievement.find({
      student: studentId,
    })
      .populate("achievement")
      .sort({ unlockedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: achievements.length,
      achievements,
    });
  } catch (error) {
    console.error(
      "Get student achievements error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student achievements.",
    });
  }
};

/**
 * =========================================================
 * Get all available achievements
 * =========================================================
 *
 * Shows:
 *
 * 🏆 Unlocked achievements
 * 🔒 Locked achievements
 * 📊 Current progress
 */
export const getAllAchievements = async (req, res) => {
  try {
    const studentId = req.user._id;

    /**
     * =====================================================
     * Get current student statistics
     * =====================================================
     */
    const stats = await getStudentStats(studentId);

    console.log(
      "📊 STUDENT ACHIEVEMENT STATS:",
      stats,
    );

    /**
     * =====================================================
     * Get all active achievements
     * =====================================================
     */
    const achievements = await Achievement.find({
      isActive: true,
    })
      .sort({
        requirementValue: 1,
      })
      .lean();

    console.log(
      "🏆 TOTAL ACHIEVEMENTS FROM DB:",
      achievements.length,
    );

    /**
     * =====================================================
     * Get achievements already unlocked
     * by this student
     * =====================================================
     */
    const studentAchievements =
      await StudentAchievement.find({
        student: studentId,
      })
        .select(
          "achievement unlockedAt progress",
        )
        .lean();

    /**
     * =====================================================
     * Create lookup map
     * =====================================================
     */
    const unlockedMap = new Map(
      studentAchievements.map((item) => [
        item.achievement.toString(),
        item,
      ]),
    );

    /**
     * =====================================================
     * Combine achievement data
     * with student progress
     * =====================================================
     */
    const result = achievements.map(
      (achievement) => {
        const unlocked = unlockedMap.get(
          achievement._id.toString(),
        );

        /**
         * -----------------------------------------------
         * Determine current progress
         * -----------------------------------------------
         */
        let currentProgress = 0;

        switch (achievement.requirement) {
          case "LECTURES_COMPLETED":
            currentProgress =
              stats.lecturesCompleted;
            break;

          case "COURSES_ENROLLED":
            currentProgress =
              stats.coursesEnrolled;
            break;

          case "COURSES_COMPLETED":
            currentProgress =
              stats.coursesCompleted;
            break;

          case "LEARNING_HOURS":
            currentProgress =
              stats.learningHours;
            break;

          case "STREAK":
            currentProgress =
              stats.streak;
            break;

          default:
            currentProgress = 0;
        }

        /**
         * -----------------------------------------------
         * Required progress
         * -----------------------------------------------
         */
        const requiredProgress =
          achievement.requirementValue;

        /**
         * -----------------------------------------------
         * Calculate percentage
         * -----------------------------------------------
         */
        const progressPercentage =
          requiredProgress > 0
            ? Math.min(
                100,
                Math.round(
                  (currentProgress /
                    requiredProgress) *
                    100,
                ),
              )
            : 0;

        /**
         * -----------------------------------------------
         * Return final achievement
         * -----------------------------------------------
         */
        return {
          ...achievement,

          /**
           * Whether student unlocked it.
           */
          unlocked: Boolean(unlocked),

          /**
           * Unlock date.
           */
          unlockedAt:
            unlocked?.unlockedAt ?? null,

          /**
           * Current progress.
           *
           * Example:
           *
           * currentProgress = 3
           * requiredProgress = 5
           *
           * progress = 3
           */
          progress: Math.min(
            currentProgress,
            requiredProgress,
          ),

          /**
           * Required amount.
           */
          requiredProgress,

          /**
           * Progress percentage.
           *
           * Example:
           * 3 / 5 = 60%
           */
          progressPercentage,
        };
      },
    );

    /**
     * =====================================================
     * Send response
     * =====================================================
     */
    return res.status(200).json({
      success: true,
      count: result.length,
      achievements: result,
    });
  } catch (error) {
    console.error(
      "Get all achievements error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievements.",
    });
  }
};

/**
 * =========================================================
 * Get student's XP
 * =========================================================
 */
export const getStudentXP = async (req, res) => {
  try {
    const studentId = req.user._id;

    let studentXP = await StudentXP.findOne({
      student: studentId,
    }).lean();

    /**
     * Create XP record if student doesn't have one yet.
     */
    if (!studentXP) {
      studentXP = await StudentXP.create({
        student: studentId,
        totalXP: 0,
        level: 1,
      });

      studentXP = studentXP.toObject();
    }

    const totalXP =
      studentXP.totalXP || 0;

    const level =
      studentXP.level || 1;

    /**
     * Current level starts at:
     *
     * Level 1 → 0 XP
     * Level 2 → 1000 XP
     * Level 3 → 2000 XP
     */
    const currentLevelXP =
      (level - 1) * 1000;

    const nextLevelXP =
      level * 1000;

    const progressXP =
      totalXP - currentLevelXP;

    const remainingXP =
      Math.max(
        0,
        nextLevelXP - totalXP,
      );

    const progressPercentage =
      Math.min(
        100,
        Math.round(
          (progressXP / 1000) * 100,
        ),
      );

    return res.status(200).json({
      success: true,

      xp: {
        totalXP,

        level,

        currentLevelXP,

        nextLevelXP,

        progressXP,

        remainingXP,

        progressPercentage,
      },
    });
  } catch (error) {
    console.error(
      "Get student XP error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch student XP.",
    });
  }
};