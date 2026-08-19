import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

function WelcomeBanner() {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <div
      className="
        relative
        !block
        !w-full
        !min-h-[220px]
        !overflow-hidden
        rounded-3xl
        bg-indigo-600
        px-6
        py-7
        shadow-sm
        sm:px-8
        sm:py-8
        lg:px-10
        lg:py-9
      "
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />

      <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/5" />

      <div className="pointer-events-none absolute right-8 top-8 h-24 w-24 rounded-2xl bg-white/10" />

      {/* Content */}
      <div className="relative z-10 !block !w-full">

        {/* Small label */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100">
          <Sparkles size={14} />

          <span>
            Keep learning, keep growing
          </span>
        </div>

        {/* Heading */}
        <h1 className="!m-0 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
          Welcome back, {firstName}! 👋
        </h1>

        {/* Description */}
        <p className="!m-0 mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
          Continue your learning journey and make progress toward your goals.
          You're doing great — keep the momentum going!
        </p>

        {/* Button */}
        <button
          type="button"
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-white
            px-5
            py-3
            text-sm
            font-semibold
            text-indigo-600
            shadow-sm
            transition
            hover:bg-indigo-50
          "
        >
          Continue Learning
          <ArrowRight size={17} />
        </button>

      </div>
    </div>
  );
}

export default WelcomeBanner;