import Course from "../models/course.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice,
            courseThumbnail,
        } = req.body;

        const course = await Course.create({
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice,
            courseThumbnail,
            instructor: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate(
            "instructor",
            "name email"
        );

        res.status(200).json({
            success: true,
            count: courses.length,
            courses,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

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
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// update course controller

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Only the course creator can update it
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this course.",
            });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
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
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// delete course controller ........

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Only the course creator can delete it
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this course.",
            });
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// upload controller 

export const uploadCourseThumbnail = async (req, res) => {

    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);
    console.log("File:", req.file);
    
    try {

        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image",
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

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};