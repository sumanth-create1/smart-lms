import Achievement from "../models/achievement.model.js";
import StudentAchievement from "../models/studentAchievement.model.js";
import StudentXP from "../models/studentXP.model.js";

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


export const getStudentXP = async (req, res) => {
  try {
    const studentId = req.user._id;

    let studentXP = await StudentXP.findOne({
      student: studentId,
    }).lean();

    // Create XP record if student doesn't have one yet
    if (!studentXP) {
      studentXP = await StudentXP.create({
        student: studentId,
        totalXP: 0,
        level: 1,
      });

      studentXP = studentXP.toObject();
    }

    const totalXP = studentXP.totalXP || 0;
    const level = studentXP.level || 1;

    const currentLevelXP = (level - 1) * 1000;
    const nextLevelXP = level * 1000;

    const progressXP =
      totalXP - currentLevelXP;

    const remainingXP = Math.max(
      0,
      nextLevelXP - totalXP
    );

    const progressPercentage = Math.min(
      100,
      Math.round((progressXP / 1000) * 100)
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
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch student XP.",
    });
  }
};