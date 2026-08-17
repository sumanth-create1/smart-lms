import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";

function DashboardHeader({ user }) {
  const userName = user?.name || "Student";
  const userRole = user?.role || "student";

  const firstLetter =
    userName.charAt(0).toUpperCase();

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-[72px]
        w-full
        items-center
        border-b
        border-slate-200
        bg-white
      "
    >

      <div
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
        "
      >

        {/* =================================
            LEFT
        ================================= */}

        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
            Smart LMS
          </p>

          <h1 className="mt-0.5 truncate text-xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

        </div>

        {/* =================================
            RIGHT
        ================================= */}

        <div className="flex items-center gap-2">

          {/* SEARCH */}

          <button
            type="button"
            className="
              hidden
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-500
              transition
              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-600
              md:flex
            "
          >
            <Search size={18} />
          </button>

          {/* NOTIFICATION */}

          <button
            type="button"
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-500
              transition
              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-600
            "
          >
            <Bell size={18} />

            <span
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                rounded-full
                bg-indigo-600
                ring-2
                ring-white
              "
            />
          </button>

          {/* DIVIDER */}

          <div className="mx-2 hidden h-8 w-px bg-slate-200 sm:block" />

          {/* PROFILE */}

          <button
            type="button"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-2
              py-1.5
              transition
              hover:bg-slate-50
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-indigo-600
                to-violet-600
                text-sm
                font-bold
                text-white
              "
            >
              {firstLetter}
            </div>

            <div className="hidden text-left sm:block">

              <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
                {userName}
              </p>

              <p className="text-[11px] capitalize text-slate-500">
                {userRole}
              </p>

            </div>

            <ChevronDown
              size={16}
              className="hidden text-slate-400 sm:block"
            />

          </button>

        </div>

      </div>

    </header>
  );
}

export default DashboardHeader;