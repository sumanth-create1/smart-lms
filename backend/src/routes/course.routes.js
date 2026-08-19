import express from "express";

import {
    createCourse,
    getAllCourses,
    getInstructorCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    uploadCourseThumbnail,
} from "../controllers/course.controller.js";

import {
    isAuthenticated,
    authorizeRoles,
} from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

const router = express.Router();


/* =========================================================
   CREATE COURSE
========================================================= */

router.post(
    "/create",
    isAuthenticated,
    authorizeRoles("instructor"),
    createCourse
);


/* =========================================================
   GET ALL COURSES
========================================================= */

router.get(
    "/",
    getAllCourses
);


/* =========================================================
   GET INSTRUCTOR COURSES
   MUST BE BEFORE /:id
========================================================= */

router.get(
    "/instructor",
    isAuthenticated,
    authorizeRoles("instructor"),
    getInstructorCourses
);


/* =========================================================
   UPLOAD COURSE THUMBNAIL
========================================================= */

router.put(
    "/thumbnail/:courseId",
    isAuthenticated,
    authorizeRoles("instructor"),
    upload.single("thumbnail"),
    uploadCourseThumbnail
);


/* =========================================================
   GET COURSE BY ID
========================================================= */

router.get(
    "/:id",
    getCourseById
);


/* =========================================================
   UPDATE COURSE
========================================================= */

router.put(
    "/:id",
    isAuthenticated,
    authorizeRoles("instructor"),
    updateCourse
);


/* =========================================================
   DELETE COURSE
========================================================= */

router.delete(
    "/:id",
    isAuthenticated,
    authorizeRoles("instructor"),
    deleteCourse
);


export default router;