import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import Activity from "../models/activity.model.js";

import {
    checkAndUnlockAchievements,
} from "../services/achievement.service.js";

/**
 * =========================================================
 * ENROLL IN COURSE
 * =========================================================
 */
export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user._id;

        // ---------------------------------------------------
        // Find course
        // ---------------------------------------------------
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // ---------------------------------------------------
        // Check existing enrollment
        // ---------------------------------------------------
        const alreadyEnrolled =
            await Enrollment.findOne({
                student: studentId,
                course: courseId,
            });

        if (alreadyEnrolled) {
            return res.status(400).json({
                success: false,
                message:
                    "You are already enrolled in this course",
            });
        }

        // ---------------------------------------------------
        // Create enrollment
        // ---------------------------------------------------
        const enrollment =
            await Enrollment.create({
                student: studentId,
                course: courseId,
            });

        // ---------------------------------------------------
        // Create enrollment activity
        // ---------------------------------------------------
        await Activity.create({
            student: studentId,
            type: "COURSE_ENROLLED",
            course: courseId,
            message: `Enrolled in ${course.courseTitle}`,
        });

        // ---------------------------------------------------
        // Check achievements
        // ---------------------------------------------------
        const achievementResult =
            await checkAndUnlockAchievements(
                studentId
            );

        // ---------------------------------------------------
        // Response
        // ---------------------------------------------------
        return res.status(201).json({
            success: true,
            message:
                "Course enrolled successfully",
            enrollment,
            newlyUnlocked:
                achievementResult.newlyUnlocked,
        });
    } catch (error) {
        console.error(
            "Enroll course error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * =========================================================
 * CHECK ENROLLMENT
 * =========================================================
 */
export const checkEnrollment = async (
    req,
    res
) => {
    try {
        const studentId = req.user._id;
        const { courseId } = req.params;

        const enrollment =
            await Enrollment.findOne({
                student: studentId,
                course: courseId,
            });

        return res.status(200).json({
            success: true,
            isEnrolled: Boolean(enrollment),
        });
    } catch (error) {
        console.error(
            "Check enrollment error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * =========================================================
 * GET MY COURSES
 * =========================================================
 */
export const getMyCourses = async (
    req,
    res
) => {
    try {
        const studentId = req.user._id;

        const enrollments =
            await Enrollment.find({
                student: studentId,
            }).populate({
                path: "course",
                populate: {
                    path: "instructor",
                    select: "name email",
                },
            });

        const courses = enrollments.map(
            (enrollment) =>
                enrollment.course
        );

        return res.status(200).json({
            success: true,
            count: courses.length,
            courses,
        });
    } catch (error) {
        console.error(
            "Get my courses error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};