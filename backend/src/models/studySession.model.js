import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
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

        lecture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
            required: true,
        },

        durationSeconds: {
            type: Number,
            default: 0,
        },

        startedAt: {
            type: Date,
            required: true,
        },

        endedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const StudySession = mongoose.model(
    "StudySession",
    studySessionSchema
);

export default StudySession;