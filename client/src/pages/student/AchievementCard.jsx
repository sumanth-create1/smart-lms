import {
  Award,
  BookOpen,
  Flame,
  GraduationCap,
  Trophy,
} from "lucide-react";

function AchievementCard({ stats = {} }) {
  const completedCourses = stats.completedCourses ?? 0;
  const enrolledCourses = stats.enrolledCourses ?? 0;
  const studyStreak = stats.studyStreak ?? 0;
  const learningHours = stats.learningHours ?? 0;

  // ==========================================
  // ACHIEVEMENTS
  // ==========================================

  const achievements = [
    {
      id: "first-course",
      title: "First Step",
      description: "Enroll in your first course",
      unlocked: enrolledCourses >= 1,
      icon: BookOpen,
    },

    {
      id: "course-complete",
      title: "Course Finisher",
      description: "Complete your first course",
      unlocked: completedCourses >= 1,
      icon: GraduationCap,
    },

    {
      id: "streak",
      title: "Learning Streak",
      description: "Maintain a 7 day study streak",
      unlocked: studyStreak >= 7,
      icon: Flame,
    },

    {
      id: "study-hours",
      title: "Dedicated Learner",
      description: "Complete 10 hours of learning",
      unlocked: learningHours >= 10,
      icon: Trophy,
    },
  ];

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50">
            <Award
              size={21}
              className="text-yellow-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Achievements
            </h2>

            <p className="text-sm text-gray-500">
              Keep learning and unlock badges
            </p>
          </div>

        </div>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
          {unlockedCount}/{achievements.length}
        </span>

      </div>


      {/* =====================================
          ACHIEVEMENT LIST
      ===================================== */}

      <div className="mt-6 space-y-3">

        {achievements.map((achievement) => {

          const Icon = achievement.icon;

          return (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                achievement.unlocked
                  ? "border-green-100 bg-green-50/50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >

              {/* ICON */}

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  achievement.unlocked
                    ? "bg-green-100"
                    : "bg-gray-200"
                }`}
              >
                <Icon
                  size={19}
                  className={
                    achievement.unlocked
                      ? "text-green-600"
                      : "text-gray-400"
                  }
                />
              </div>


              {/* CONTENT */}

              <div className="min-w-0 flex-1">

                <h3
                  className={`text-sm font-semibold ${
                    achievement.unlocked
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {achievement.title}
                </h3>

                <p className="mt-0.5 text-xs text-gray-400">
                  {achievement.description}
                </p>

              </div>


              {/* STATUS */}

              {achievement.unlocked && (
                <span className="shrink-0 text-xs font-bold text-green-600">
                  Unlocked
                </span>
              )}

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default AchievementCard;