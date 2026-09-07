import Achievement from "../models/achievement.model.js";
import StudentAchievement from "../models/studentAchievement.model.js";

/**
 * =========================================================
 * Get student's achievements
 * =========================================================
 */
export const getStudentAchievements = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    const achievements =
      await StudentAchievement.find({
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
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch student achievements.",
    });
  }
};

/**
 * =========================================================
 * Get all available achievements
 * =========================================================
 *
 * Useful for showing:
 *
 * 🏆 Unlocked achievements
 * 🔒 Locked achievements
 */
export const getAllAchievements = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    /**
     * Get all active achievements.
     */
    const achievements =
      await Achievement.find({
        isActive: true,
      })
        .sort({ requirementValue: 1 })
        .lean();

    /**
     * Get achievements already unlocked
     * by this student.
     */
    const studentAchievements =
      await StudentAchievement.find({
        student: studentId,
      })
        .select(
          "achievement unlockedAt progress"
        )
        .lean();

    /**
     * Create lookup map.
     */
    const unlockedMap = new Map(
      studentAchievements.map((item) => [
        item.achievement.toString(),
        item,
      ])
    );

    /**
     * Combine achievement definition
     * with student's unlock status.
     */
    const result = achievements.map(
      (achievement) => {
        const unlocked =
          unlockedMap.get(
            achievement._id.toString()
          );

        return {
          ...achievement,

          unlocked: Boolean(unlocked),

          unlockedAt:
            unlocked?.unlockedAt ?? null,

          progress:
            unlocked?.progress ?? 0,
        };
      }
    );

    return res.status(200).json({
      success: true,
      count: result.length,
      achievements: result,
    });
  } catch (error) {
    console.error(
      "Get all achievements error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch achievements.",
    });
  }
};