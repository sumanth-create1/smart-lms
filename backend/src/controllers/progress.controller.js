import CourseProgress from "../models/courseProgress.model.js";
import Lecture from "../models/lecture.model.js";
import calculateProgress from "../utils/calculateProgress.js";
import StudySession from "../models/studysession.model.js";
import Activity from "../models/activity.model.js";

export const saveProgress = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { watchedSeconds } = req.body;

    const studentId = req.user._id;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

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

    const lectureProgress = progress.lectures.find(
      (item) => item.lecture.toString() === lectureId,
    );

    let watchedDelta = 0;

    if (lectureProgress) {
      const previousWatchTime = lectureProgress.watchedSeconds;
      const MAX_ALLOWED_JUMP = 15;

      if (watchedSeconds > previousWatchTime + MAX_ALLOWED_JUMP) {
        return res.status(400).json({
          success: false,
          message: "Invalid watch progress detected.",
        });
      }

      // Calculate newly watched time
      watchedDelta = Math.max(0, watchedSeconds - previousWatchTime);

      lectureProgress.watchedSeconds = Math.max(
        previousWatchTime,
        watchedSeconds,
      );
    } else {
      const MAX_ALLOWED_JUMP = 15;

      if (watchedSeconds > MAX_ALLOWED_JUMP) {
        return res.status(400).json({
          success: false,
          message: "Invalid watch progress detected.",
        });
      }

      watchedDelta = watchedSeconds;

      progress.lectures.push({
        lecture: lectureId,
        watchedSeconds,
        completed: false,
      });

      // Create lecture started activity
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

    // ----------------------------------------
    // SAVE STUDY SESSION
    // ----------------------------------------

    if (watchedDelta > 0) {
      const now = new Date();

      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      let studySession = await StudySession.findOne({
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

    // ----------------------------------------
    // CALCULATE COURSE PROGRESS
    // ----------------------------------------

    const totalLectures = await Lecture.countDocuments({
      course: lecture.course,
    });

    const completionPercentage = calculateProgress(progress, totalLectures);

    return res.status(200).json({
      success: true,
      message: "Progress saved successfully",
      progress,
      completionPercentage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const studentId = req.user._id;

    const progress = await CourseProgress.findOne({
      student: studentId,
      course: courseId,
    }).populate("lectures.lecture");

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress found",
      });
    }

    const totalLectures = await Lecture.countDocuments({
      course: courseId,
    });

    const completionPercentage = calculateProgress(progress, totalLectures);

    return res.status(200).json({
      success: true,
      progress,
      completionPercentage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// marking lecture completed or not.........

export const markLectureCompleted = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const studentId = req.user._id;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const progress = await CourseProgress.findOne({
      student: studentId,
      course: lecture.course,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    const lectureProgress = progress.lectures.find(
      (item) => item.lecture.toString() === lectureId,
    );

    if (!lectureProgress) {
      return res.status(404).json({
        success: false,
        message: "Lecture progress not found",
      });
    }

    const minimumWatchTime = lecture.videoDuration * 0.95;

    if (lectureProgress.watchedSeconds < minimumWatchTime) {
      return res.status(400).json({
        success: false,
        message: "Watch at least 95% of the lecture before completing it.",
      });
    }

    // Prevent duplicate completion
    if (lectureProgress.completed) {
      return res.status(400).json({
        success: false,
        message: "Lecture is already completed",
      });
    }

    lectureProgress.completed = true;

    await progress.save();

    // Save activity
    await Activity.create({
      student: studentId,
      type: "LECTURE_COMPLETED",
      course: lecture.course,
      lecture: lectureId,
      message: `Completed lecture: ${lecture.lectureTitle}`,
    });

    return res.status(200).json({
      success: true,
      message: "Lecture marked as completed",
      progress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLectureProgress = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const progress = await CourseProgress.findOne({
      student: req.user._id,
      course: lecture.course,
    });

    if (!progress) {
      return res.status(200).json({
        success: true,
        watchedSeconds: 0,
        completed: false,
      });
    }

    const lectureProgress = progress.lectures.find(
      (item) => item.lecture.toString() === lectureId,
    );

    if (!lectureProgress) {
      return res.status(200).json({
        success: true,
        watchedSeconds: 0,
        completed: false,
      });
    }

    return res.status(200).json({
      success: true,
      watchedSeconds: lectureProgress.watchedSeconds,
      completed: lectureProgress.completed,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
