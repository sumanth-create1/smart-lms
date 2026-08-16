import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import Enrollment from "../models/enrollment.model.js";
import CourseProgress from "../models/courseProgress.model.js";

export const getStudentCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const studentId = req.user._id;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const course = await Course.findById(courseId).populate(
      "instructor",
      "name email",
    );

    const lectures = await Lecture.find({
      course: courseId,
    }).sort({
      order: 1,
    });

    //     console.log(
    //     lectures.map((lecture) => ({
    //         title: lecture.lectureTitle,
    //         order: lecture.order,
    //     }))
    // );

    const progress = await CourseProgress.findOne({
      student: studentId,
      course: courseId,
    });

    const lectureData = [];

    let previousCompleted = true;

    for (const lecture of lectures) {
      const progressData = progress?.lectures.find(
        (item) => item.lecture.toString() === lecture._id.toString(),
      );

      const completed = progressData?.completed || false;

      lectureData.push({
        ...lecture.toObject(),

        completed,

        watchedSeconds: progressData?.watchedSeconds || 0,

        isLocked: !previousCompleted,
      });

      previousCompleted = completed;
    }

    return res.status(200).json({
      success: true,
      course,
      lectures: lectureData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getStudentLecture = async (req, res) => {

    try {

        const lecture = await Lecture.findById(req.params.lectureId);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found",
            });
        }

        return res.status(200).json({
            success: true,
            lecture,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

