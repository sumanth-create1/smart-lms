import mongoose from "mongoose";
import Course from "../models/course.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

/* =========================================================
   CREATE COURSE
========================================================= */

export const createCourse = async (req, res) => {
    try {
        const {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice,
        } = req.body;

        // Basic validation
        if (
            !courseTitle ||
            !subTitle ||
            !description ||
            !category ||
            !courseLevel ||
            coursePrice === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required course fields.",
            });
        }

        const course = await Course.create({
            courseTitle: courseTitle.trim(),
            subTitle: subTitle.trim(),
            description: description.trim(),
            category,
            courseLevel,
            coursePrice: Number(coursePrice),

            // Instructor comes from authenticated user
            instructor: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });

    } catch (error) {
        console.error("Create course error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   GET ALL COURSES
========================================================= */

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("instructor", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            courses,
        });

    } catch (error) {
        console.error("Get all courses error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   GET INSTRUCTOR COURSES
========================================================= */

export const getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user._id;

        const courses = await Course.find({
            instructor: instructorId,
        })
            .populate("instructor", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            courses,
        });

    } catch (error) {
        console.error("Get instructor courses error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   GET COURSE BY ID
========================================================= */

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent invalid MongoDB ObjectId errors
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID.",
            });
        }

        const course = await Course.findById(id).populate(
            "instructor",
            "name email"
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            course,
        });

    } catch (error) {
        console.error("Get course by ID error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   UPDATE COURSE
========================================================= */

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID.",
            });
        }

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Only instructor who created course can update it
        if (
            course.instructor.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to update this course.",
            });
        }

        const updatedCourse =
            await Course.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: updatedCourse,
        });

    } catch (error) {
        console.error("Update course error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   DELETE COURSE
========================================================= */

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID.",
            });
        }

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Only course creator can delete
        if (
            course.instructor.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to delete this course.",
            });
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        console.error("Delete course error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/* =========================================================
   UPLOAD COURSE THUMBNAIL
========================================================= */

export const uploadCourseThumbnail = async (req, res) => {
    try {
        const { courseId } = req.params;

        console.log("Thumbnail upload:", {
            courseId,
            file: req.file?.originalname,
        });

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID.",
            });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Only course creator can upload thumbnail
        if (
            course.instructor.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to update this course.",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image.",
            });
        }

        const result = await uploadToCloudinary(
            req.file.buffer,
            "smart-lms/course-thumbnails"
        );

        course.courseThumbnail = {
            url: result.secure_url,
            public_id: result.public_id,
        };

        await course.save();

        res.status(200).json({
            success: true,
            message: "Thumbnail uploaded successfully",
            course,
        });

    } catch (error) {
        console.error(
            "Upload course thumbnail error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};