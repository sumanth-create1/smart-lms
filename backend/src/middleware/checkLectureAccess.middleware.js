import Lecture from "../models/lecture.model.js";
import CourseProgress from "../models/courseProgress.model.js";

export const checkLectureAccess = async (req, res, next) => {
    try {

        const { lectureId } = req.params;
        const studentId = req.user._id;

        // Find requested lecture
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found",
            });
        }

        // First lecture is always accessible
        if (lecture.order === 1) {
            return next();
        }

        // Find previous lecture
        const previousLecture = await Lecture.findOne({
            course: lecture.course,
            order: lecture.order - 1,
        });

        if (!previousLecture) {
            return next();
        }

        // Find student's course progress
        const progress = await CourseProgress.findOne({
            student: studentId,
            course: lecture.course,
        });

        if (!progress) {
            return res.status(403).json({
                success: false,
                message: "Complete previous lecture first",
            });
        }

        const previousProgress = progress.lectures.find(
            item => item.lecture.toString() === previousLecture._id.toString()
        );

        if (!previousProgress || !previousProgress.completed) {
            return res.status(403).json({
                success: false,
                message: "Complete previous lecture first",
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};