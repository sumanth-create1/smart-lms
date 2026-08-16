import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "LECTURE_STARTED",
                "LECTURE_COMPLETED",
                "COURSE_ENROLLED",
                "COURSE_COMPLETED",
            ],
            required: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        lecture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
        },

        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Activity = mongoose.model(
    "Activity",
    activitySchema
);

export default Activity;