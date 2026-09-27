import Enrollment from "../models/enrollment.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import Lecture from "../models/lecture.model.js";
import StudySession from "../models/studysession.model.js";
import Activity from "../models/activity.model.js";
import StudentXP from "../models/studentXP.model.js";

export const getStudentDashboard = async (req, res) => {
  try {
    console.log("🔥 Dashboard controller started");
    console.log("👤 Student ID:", req.user?._id);

    const studentId = req.user._id;

    // ==========================================
    // 1. LEARNING HOURS
    // ==========================================

    const studySessions = await StudySession.find({
      student: studentId,
    });

    console.log("✅ Study sessions loaded:", studySessions.length);

    const totalStudySeconds = studySessions.reduce(
      (total, session) =>
        total + Number(session.durationSeconds || 0),
      0,
    );

    const learningHours = Number(
      (totalStudySeconds / 3600).toFixed(2),
    );

    // ==========================================
    // 2. GET ENROLLED COURSES
    // ==========================================

    const enrollments = await Enrollment.find({
      student: studentId,
    }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "name email",
      },
    });

    console.log("✅ Enrollments loaded:", enrollments.length);

    const courses = [];

    // ==========================================
    // 3. COURSE INFORMATION + PROGRESS
    // ==========================================

    for (const enrollment of enrollments) {
      const course = enrollment.course;

      if (!course) continue;

      // ------------------------------------------
      // GET ALL LECTURES
      // ------------------------------------------

      const lectures = await Lecture.find({
        course: course._id,
      }).sort({
        createdAt: 1,
      });

      console.log(
        "📚 Processing enrollment:",
        enrollment._id,
      );

      // ------------------------------------------
      // GET STUDENT PROGRESS
      // ------------------------------------------

      const progress = await CourseProgress.findOne({
        student: studentId,
        course: course._id,
      });

      console.log("✅ Course progress loaded");

      // ------------------------------------------
      // COUNT LESSONS
      // ------------------------------------------

      const totalLessons = lectures.length;

      let completedLessons = 0;

      if (progress) {
        completedLessons = progress.lectures.filter(
          (lecture) => lecture.completed === true,
        ).length;
      }

      // ------------------------------------------
      // COURSE PROGRESS
      // ------------------------------------------

      const progressPercentage =
        totalLessons > 0
          ? Math.round(
              (completedLessons / totalLessons) * 100,
            )
          : 0;

      // ------------------------------------------
      // CURRENT LESSON
      // ------------------------------------------

      let currentLesson = null;

      if (
        progressPercentage < 100 &&
        lectures.length > 0
      ) {
        // Find first incomplete lecture
        const incompleteLectureProgress =
          progress?.lectures.find(
            (item) => item.completed === false,
          );

        if (incompleteLectureProgress) {
          const lecture = lectures.find(
            (item) =>
              item._id.toString() ===
              incompleteLectureProgress.lecture.toString(),
          );

          if (lecture) {
            currentLesson = {
              lectureId: lecture._id,
              lectureTitle: lecture.lectureTitle,
              watchedSeconds:
                incompleteLectureProgress.watchedSeconds,
              completed:
                incompleteLectureProgress.completed,
            };
          }
        }

        // If no lecture has been started
        if (!currentLesson) {
          const firstLecture = lectures[0];

          currentLesson = {
            lectureId: firstLecture._id,
            lectureTitle: firstLecture.lectureTitle,
            watchedSeconds: 0,
            completed: false,
          };
        }
      }

      // ------------------------------------------
      // ADD COURSE
      // ------------------------------------------

      courses.push({
        _id: course._id,
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: course.courseThumbnail,
        instructor: course.instructor,

        totalLessons,
        completedLessons,
        progress: progressPercentage,

        currentLesson,
      });
    }

    // ==========================================
    // 4. COMPLETED COURSES
    // ==========================================

    const completedCourses = courses.filter(
      (course) => course.progress === 100,
    ).length;

    // ==========================================
    // 5. STUDY STREAK
    // ==========================================

    const studyDays = await StudySession.find({
      student: studentId,
      durationSeconds: {
        $gt: 0,
      },
    })
      .select("startedAt")
      .sort({
        startedAt: -1,
      });

    const uniqueStudyDates = new Set();

    studyDays.forEach((session) => {
      const date = new Date(session.startedAt);

      const dateString =
        `${date.getFullYear()}-` +
        `${String(date.getMonth() + 1).padStart(2, "0")}-` +
        `${String(date.getDate()).padStart(2, "0")}`;

      uniqueStudyDates.add(dateString);
    });

    const sortedStudyDates = Array.from(
      uniqueStudyDates,
    ).sort(
      (a, b) =>
        new Date(b).getTime() -
        new Date(a).getTime(),
    );

    let studyStreak = 0;

    if (sortedStudyDates.length > 0) {
      const today = new Date();

      const todayString =
        `${today.getFullYear()}-` +
        `${String(today.getMonth() + 1).padStart(2, "0")}-` +
        `${String(today.getDate()).padStart(2, "0")}`;

      const yesterday = new Date(today);

      yesterday.setDate(
        today.getDate() - 1,
      );

      const yesterdayString =
        `${yesterday.getFullYear()}-` +
        `${String(yesterday.getMonth() + 1).padStart(2, "0")}-` +
        `${String(yesterday.getDate()).padStart(2, "0")}`;

      // Streak must start today or yesterday
      if (
        sortedStudyDates[0] === todayString ||
        sortedStudyDates[0] === yesterdayString
      ) {
        studyStreak = 1;

        for (
          let i = 1;
          i < sortedStudyDates.length;
          i++
        ) {
          const previousDate = new Date(
            sortedStudyDates[i - 1],
          );

          const currentDate = new Date(
            sortedStudyDates[i],
          );

          const difference = Math.round(
            (previousDate.getTime() -
              currentDate.getTime()) /
              (1000 * 60 * 60 * 24),
          );

          if (difference === 1) {
            studyStreak++;
          } else {
            break;
          }
        }
      }
    }

    // ==========================================
    // 6. WEEKLY GOAL + WEEKLY ACTIVITY
    // ==========================================

    const WEEKLY_GOAL_HOURS = 10;

    const today = new Date();

    const dayOfWeek = today.getDay();

    // Monday = 0 ... Sunday = 6
    const daysFromMonday =
      dayOfWeek === 0
        ? 6
        : dayOfWeek - 1;

    const startOfWeek = new Date(today);

    startOfWeek.setDate(
      today.getDate() - daysFromMonday,
    );

    startOfWeek.setHours(
      0,
      0,
      0,
      0,
    );

    const endOfToday = new Date(today);

    endOfToday.setHours(
      23,
      59,
      59,
      999,
    );

    // ------------------------------------------
    // GET THIS WEEK'S STUDY SESSIONS
    // ------------------------------------------

    const weeklySessions =
      await StudySession.find({
        student: studentId,

        startedAt: {
          $gte: startOfWeek,
          $lte: endOfToday,
        },
      });

    console.log(
      "📊 Weekly study sessions:",
      weeklySessions.length,
    );

    // ------------------------------------------
    // WEEKLY TOTAL
    // ------------------------------------------

    const weeklyStudySeconds =
      weeklySessions.reduce(
        (total, session) =>
          total +
          Number(
            session.durationSeconds || 0,
          ),
        0,
      );

    const weeklyStudyHours = Number(
      (
        weeklyStudySeconds / 3600
      ).toFixed(2),
    );

    const weeklyGoalPercentage =
      Math.min(
        Math.round(
          (weeklyStudyHours /
            WEEKLY_GOAL_HOURS) *
            100,
        ),
        100,
      );

    // ------------------------------------------
    // WEEKLY ACTIVITY
    // ------------------------------------------

    // Monday -> Sunday
    const WEEK_DAYS = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];

    const weeklyActivity = WEEK_DAYS.map(
      (day) => ({
        day,
        hours: 0,
      }),
    );

    // Add StudySession duration to correct day
    weeklySessions.forEach((session) => {
      if (!session.startedAt) return;

      const sessionDate = new Date(
        session.startedAt,
      );

      // JS:
      // Sunday = 0
      // Monday = 1
      // ...
      // Saturday = 6

      const jsDay = sessionDate.getDay();

      // Convert Sunday-first index
      // into Monday-first index
      const mondayIndex =
        jsDay === 0
          ? 6
          : jsDay - 1;

      if (
        mondayIndex >= 0 &&
        mondayIndex < 7
      ) {
        weeklyActivity[
          mondayIndex
        ].hours +=
          Number(
            session.durationSeconds || 0,
          ) / 3600;
      }
    });

    // Round hours for frontend
    weeklyActivity.forEach((item) => {
      item.hours = Number(
        item.hours.toFixed(2),
      );
    });

    console.log(
      "📈 Weekly activity:",
      weeklyActivity,
    );

    // ==========================================
    // 7. RECENT ACTIVITY
    // ==========================================

    console.log(
      "🔄 Fetching recent activity...",
    );

    const recentActivity =
      await Activity.find({
        student: studentId,
      })
        .populate(
          "course",
          "courseTitle",
        )
        .populate(
          "lecture",
          "lectureTitle",
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    console.log(
      "✅ Activity loaded:",
      recentActivity.length,
    );

    // ==========================================
    // 8. XP INFORMATION
    // ==========================================

    const studentXP =
      await StudentXP.findOne({
        student: studentId,
      }).lean();

    const totalXP =
      studentXP?.totalXP ?? 0;

    const level =
      studentXP?.level ?? 1;

    // Every level requires another 1000 XP
    const nextLevelXp =
      level * 1000;

    // ==========================================
    // 9. FINAL RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      stats: {
        // --------------------------------------
        // COURSE STATS
        // --------------------------------------

        enrolledCourses:
          courses.length,

        completedCourses,

        // --------------------------------------
        // LEARNING STATS
        // --------------------------------------

        learningHours,

        studyStreak,

        // --------------------------------------
        // XP
        // --------------------------------------

        xp: {
          totalXP,
          level,
          nextLevelXp,
        },

        // --------------------------------------
        // WEEKLY GOAL
        // --------------------------------------

        weeklyGoal: {
          targetHours:
            WEEKLY_GOAL_HOURS,

          completedHours:
            weeklyStudyHours,

          percentage:
            weeklyGoalPercentage,
        },

        // --------------------------------------
        // WEEKLY CHRONICLE
        // --------------------------------------

        weeklyActivity,
      },

      // ----------------------------------------
      // COURSES
      // ----------------------------------------

      courses,

      // ----------------------------------------
      // RECENT ACTIVITY
      // ----------------------------------------

      recentActivity,
    });
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};