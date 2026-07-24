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
      lectureProgress.watchedSeconds = Math.max(
        lectureProgress.watchedSeconds,
        watchedSeconds,
      );
    } else {
      progress.lectures.push({
        lecture: lectureId,
        watchedSeconds,
        completed: false,
      });
    }

    await progress.save();

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

    return res.status(200).json({
      success: true,
      progress,
    });

    const totalLectures = await Lecture.countDocuments({
      course: courseId,
    });

    const completionPercentage = calculateProgress(progress, totalLectures);
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
