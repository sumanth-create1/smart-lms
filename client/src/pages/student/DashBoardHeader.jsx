import { Bell, ChevronDown } from "lucide-react";

function DashboardHeader({ user }) {
  const userName = user?.name || "Student";
  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =================================
            LEFT SIDE
        ================================= */}

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Dashboard
          </h1>

          <p className="mt-0.5 hidden text-sm font-medium text-slate-500 sm:block">
            Track your learning progress and achieve your goals
          </p>
        </div>

        {/* =================================
            RIGHT SIDE
        ================================= */}

        <div className="flex items-center gap-3 sm:gap-5">

          {/* Notification */}

          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-indigo-600
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500/20
            "
          >
            <Bell size={19} strokeWidth={2} />

            {/* Notification indicator */}

            <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* Divider */}

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* =================================
              USER PROFILE
          ================================= */}

          <button
            type="button"
            className="
              flex
              items-center
              gap-2.5
              rounded-xl
              px-1.5
              py-1.5
              transition
              hover:bg-slate-50
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500/20
            "
          >

            {/* Avatar */}

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-indigo-500
                to-violet-600
                text-sm
                font-bold
                text-white
                shadow-sm
                shadow-indigo-500/20
              "
            >
              {firstLetter}
            </div>

            {/* User information */}

            <div className="hidden min-w-0 text-left sm:block">

              <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
                {userName}
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Student
              </p>

            </div>

            {/* Dropdown */}

            <ChevronDown
              size={17}
              strokeWidth={2}
              className="hidden text-slate-400 sm:block"
            />

          </button>

        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;