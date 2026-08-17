import {
  BookOpen,
  CheckCircle,
  Clock3,
  Flame,
} from "lucide-react";

function StatsGrid({ stats }) {
  const statCards = [
    {
      title: "Enrolled Courses",
      value: stats?.enrolledCourses ?? 0,
      icon: BookOpen,
      description: "Courses you're learning",
    },
    {
      title: "Completed Courses",
      value: stats?.completedCourses ?? 0,
      icon: CheckCircle,
      description: "Courses completed",
    },
    {
      title: "Learning Hours",
      value: stats?.learningHours ?? 0,
      icon: Clock3,
      description: "Total learning time",
    },
    {
      title: "Study Streak",
      value: stats?.studyStreak ?? 0,
      icon: Flame,
      description: "Days in a row",
    },
  ];

  return (
    <section className="w-full">
      <div
        className="
          grid
          w-full
          grid-cols-1
          gap-5
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="
                group
                relative
                min-h-[185px]
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-indigo-100
                hover:shadow-lg
                hover:shadow-slate-200/60
                sm:p-6
              "
            >
              {/* Background decoration */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-28
                  w-28
                  rounded-full
                  bg-indigo-50
                  opacity-0
                  transition
                  duration-300
                  group-hover:opacity-100
                "
              />

              {/* =================================================
                  INNER CONTENT
              ================================================== */}

              <div
                className="
                  relative
                  m-2
                  flex
                  h-[calc(100%-1rem)]
                  flex-col
                  px-1
                "
              >

                {/* =================================================
                    TOP
                ================================================== */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  {/* Text */}

                  <div className="min-w-0 flex-1">

                    <p
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.08em]
                        text-slate-400
                      "
                    >
                      {stat.title}
                    </p>

                    <p
                      className="
                        mt-4
                        text-3xl
                        font-bold
                        leading-none
                        tracking-tight
                        text-slate-900
                      "
                    >
                      {stat.value}
                    </p>

                  </div>

                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-indigo-50
                      text-indigo-600
                      transition-all
                      duration-200
                      group-hover:bg-indigo-600
                      group-hover:text-white
                    "
                  >
                    <Icon
                      size={21}
                      strokeWidth={2}
                    />
                  </div>

                </div>

                {/* =================================================
                    DIVIDER
                ================================================== */}

                <div className="my-5 h-px w-full bg-slate-100" />

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <div className="flex items-center gap-2">

                  <span
                    className="
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-indigo-500
                    "
                  />

                  <p
                    className="
                      text-xs
                      font-medium
                      leading-5
                      text-slate-500
                    "
                  >
                    {stat.description}
                  </p>

                </div>

              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default StatsGrid;