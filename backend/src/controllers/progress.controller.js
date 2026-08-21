import CourseProgress from "../models/courseProgress.model.js";
import Lecture from "../models/lecture.model.js";
import calculateProgress from "../utils/calculateProgress.js";
import StudySession from "../models/studysession.model.js";
import Activity from "../models/activity.model.js";

// =====================================================
// SAVE LECTURE WATCH PROGRESS
// PATCH /api/v1/progress/:lectureId
// =====================================================

export const saveProgress = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const watchedSeconds = Number(req.body.watchedSeconds);
    const studentId = req.user._id;

    // -------------------------------------------------
    // Validate watched time
    // -------------------------------------------------

    if (
      !Number.isFinite(watchedSeconds) ||
      watchedSeconds < 0
    ) {
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
    // Find or create course progress
    // -------------------------------------------------

    let progress = await CourseProgress.findOne({
      student: studentId,
      course: lecture.course,
    });

    if (!progress) {
      progress = await CourseProgress.create({
        student: studentId,
        course: lecture.course,
        lectures: [],
      });
    }

    // -------------------------------------------------
    // Find lecture progress
    // -------------------------------------------------

    let lectureProgress = progress.lectures.find(
      (item) =>
        String(item.lecture) === String(lectureId)
    );

    let watchedDelta = 0;

    // -------------------------------------------------
    // Existing lecture progress
    // -------------------------------------------------

    if (lectureProgress) {
      const previousWatchTime =
        Number(lectureProgress.watchedSeconds) || 0;

      const MAX_ALLOWED_JUMP = 15;

      if (
        watchedSeconds >
        previousWatchTime + MAX_ALLOWED_JUMP
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid watch progress detected.",
        });
      }

      watchedDelta = Math.max(
        0,
        watchedSeconds - previousWatchTime
      );

      lectureProgress.watchedSeconds = Math.max(
        previousWatchTime,
        watchedSeconds
      );
    }

    // -------------------------------------------------
    // First progress for this lecture
    // -------------------------------------------------

    else {
      const MAX_ALLOWED_JUMP = 15;

      if (watchedSeconds > MAX_ALLOWED_JUMP) {
        return res.status(400).json({
          success: false,
          message: "Invalid watch progress detected.",
        });
      }

      watchedDelta = watchedSeconds;

      lectureProgress = {
        lecture: lectureId,
        watchedSeconds,
        completed: false,
      };

      progress.lectures.push(lectureProgress);

      // -----------------------------------------------
      // Lecture started activity
      // -----------------------------------------------

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

    await progress.save();

    // =================================================
    // SAVE STUDY SESSION
    // =================================================

    if (watchedDelta > 0) {
      const now = new Date();

      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      let studySession =
        await StudySession.findOne({
          student: studentId,
          course: lecture.course,
          lecture: lectureId,
          startedAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });

      if (!studySession) {
        studySession = await StudySession.create({
          student: studentId,
          course: lecture.course,
          lecture: lectureId,
          durationSeconds: watchedDelta,
          startedAt: now,
          endedAt: now,
        });
      } else {
        studySession.durationSeconds += watchedDelta;
        studySession.endedAt = now;

        await studySession.save();
      }
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
        progress,
        totalLectures
      );

    return res.status(200).json({
      success: true,
      message: "Progress saved successfully.",
      progress,
      completionPercentage,
    });
  } catch (error) {
    console.error("Save progress error:", error);

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

    const totalLectures =
      await Lecture.countDocuments({
        course: courseId,
      });

    let progress = await CourseProgress.findOne({
      student: studentId,
      course: courseId,
    }).populate("lectures.lecture");

    // -------------------------------------------------
    // Student has not started the course yet
    // -------------------------------------------------

    if (!progress) {
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

    const completionPercentage =
      calculateProgress(
        progress,
        totalLectures
      );

    return res.status(200).json({
      success: true,
      progress,
      completionPercentage,
    });
  } catch (error) {
    console.error(
      "Get course progress error:",
      error
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
  res
) => {
  try {
    const { lectureId } = req.params;
    const studentId = req.user._id;

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
    // Find course progress
    // -------------------------------------------------

    let progress = await CourseProgress.findOne({
      student: studentId,
      course: lecture.course,
    });

    // -------------------------------------------------
    // If no course progress exists
    // -------------------------------------------------

    if (!progress) {
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
      progress.lectures.find(
        (item) =>
          String(item.lecture) ===
          String(lectureId)
      );

    if (!lectureProgress) {
      return res.status(400).json({
        success: false,
        message:
          "Start watching this lecture before marking it as completed.",
      });
    }

    // -------------------------------------------------
    // Prevent duplicate completion
    // -------------------------------------------------

    if (lectureProgress.completed) {
      return res.status(200).json({
        success: true,
        message: "Lecture is already completed.",
        progress,
      });
    }

    // -------------------------------------------------
    // Minimum watch requirement
    // -------------------------------------------------

    const videoDuration =
      Number(lecture.videoDuration) || 0;

    const watchedSeconds =
      Number(
        lectureProgress.watchedSeconds
      ) || 0;

    if (videoDuration > 0) {
      const minimumWatchTime =
        videoDuration * 0.95;

      if (
        watchedSeconds <
        minimumWatchTime
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Watch at least 95% of the lecture before completing it.",
          watchedSeconds,
          requiredSeconds:
            Math.ceil(minimumWatchTime),
        });
      }
    }

    // -------------------------------------------------
    // Mark completed
    // -------------------------------------------------

    lectureProgress.completed = true;

    await progress.save();

    // -------------------------------------------------
    // Save activity
    // -------------------------------------------------

    await Activity.create({
      student: studentId,
      type: "LECTURE_COMPLETED",
      course: lecture.course,
      lecture: lectureId,
      message: `Completed lecture: ${lecture.lectureTitle}`,
    });

    // -------------------------------------------------
    // Calculate course progress
    // -------------------------------------------------

    const totalLectures =
      await Lecture.countDocuments({
        course: lecture.course,
      });

    const completionPercentage =
      calculateProgress(
        progress,
        totalLectures
      );

    return res.status(200).json({
      success: true,
      message:
        "Lecture marked as completed.",
      progress,
      completionPercentage,
    });
  } catch (error) {
    console.error(
      "Mark lecture completed error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to mark lecture as completed.",
    });
  }
};

// =====================================================
// GET INDIVIDUAL LECTURE PROGRESS
// GET /api/v1/progress/lecture/:lectureId
// =====================================================

export const getLectureProgress = async (
  req,
  res
) => {
  try {
    const { lectureId } = req.params;
    const studentId = req.user._id;

    // -------------------------------------------------
    // Find lecture
    // -------------------------------------------------

    const lecture = await Lecture.findById(
      lectureId
    );

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    // -------------------------------------------------
    // Find course progress
    // -------------------------------------------------

    const progress =
      await CourseProgress.findOne({
        student: studentId,
        course: lecture.course,
      });

    // -------------------------------------------------
    // No progress yet
    // -------------------------------------------------

    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: {
          lecture: lectureId,
          watchedSeconds: 0,
          completed: false,
        },
      });
    }

    // -------------------------------------------------
    // Find lecture progress
    // -------------------------------------------------

    const lectureProgress =
      progress.lectures.find(
        (item) =>
          String(item.lecture) ===
          String(lectureId)
      );

    // -------------------------------------------------
    // Lecture hasn't been watched yet
    // -------------------------------------------------

    if (!lectureProgress) {
      return res.status(200).json({
        success: true,
        progress: {
          lecture: lectureId,
          watchedSeconds: 0,
          completed: false,
        },
      });
    }

    // -------------------------------------------------
    // Existing progress
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      progress: {
        lecture: lectureId,
        watchedSeconds:
          lectureProgress.watchedSeconds || 0,
        completed:
          lectureProgress.completed || false,
      },
    });
  } catch (error) {
    console.error(
      "Get lecture progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch lecture progress.",
    });
  }
};