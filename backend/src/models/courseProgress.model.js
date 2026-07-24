import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true,
    },

    watchedSeconds: {
        type: Number,
        default: 0,
    },

    completed: {
        type: Boolean,
        default: false,
    },
});

const courseProgressSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        lectures: [lectureProgressSchema],
    },
    {
        timestamps: true,
    }
);

courseProgressSchema.index(
    {
        student: 1,
        course: 1,
    },
    {
        unique: true,
    }
);

const CourseProgress = mongoose.model(
    "CourseProgress",
    courseProgressSchema
);

export default CourseProgress;