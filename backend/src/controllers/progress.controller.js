import CourseProgress from "../models/courseProgress.model.js";
import Lecture from "../models/lecture.model.js";
import calculateProgress from "../utils/calculateProgress.js";

export const saveProgress = async (req, res) => {
  //     console.log("Content-Type:", req.headers["content-type"]);
  // console.log("Body:", req.body);
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

    if (lectureProgress) {
      const previousWatchTime = lectureProgress.watchedSeconds;
      const MAX_ALLOWED_JUMP = 15;

      console.log("----------------");
      console.log("Previous:", previousWatchTime);
      console.log("Incoming:", watchedSeconds);
      console.log("Allowed:", previousWatchTime + MAX_ALLOWED_JUMP);
      console.log("----------------");

      if (watchedSeconds > previousWatchTime + MAX_ALLOWED_JUMP) {
        return res.status(400).json({
          success: false,
          message: "Invalid watch progress detected.",
        });
      }

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

      progress.lectures.push({
        lecture: lectureId,
        watchedSeconds,
        completed: false,
      });
    }

    await progress.save();

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

    const completionPercentage = calculateProgress(progress, totalLectures);

    return res.status(200).json({
      success: true,
      progress,
    });

    const totalLectures = await Lecture.countDocuments({
      course: courseId,
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

    lectureProgress.completed = true;

    await progress.save();

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
