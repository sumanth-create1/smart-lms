import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Bird,
  BookOpen,
  CheckCircle2,
  CircleDot,
  Crown,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sword,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

function ForgotPassword() {
  const cardRef = useRef(null);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [cursor, setCursor] = useState({
    x: 50,
    y: 50,
  });

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  // ============================================================
  // CURSOR
  // ============================================================

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x =
        (event.clientX / window.innerWidth) * 100;

      const y =
        (event.clientY / window.innerHeight) * 100;

      setCursor({
        x,
        y,
      });

      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  // ============================================================
  // CARD TILT
  // ============================================================

  const handleCardMouseMove = (event) => {
    if (!cardRef.current) return;

    const rect =
      cardRef.current.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;

    const rotateX =
      ((y / rect.height) - 0.5) * -2;

    const rotateY =
      ((x / rect.width) - 0.5) * 2;

    cardRef.current.style.transform = `
      perspective(1600px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-2px)
    `;
  };

  const handleCardMouseLeave = () => {
    if (!cardRef.current) return;

    cardRef.current.style.transform = `
      perspective(1600px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error(
        "Please enter your email address."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        {
          email: normalizedEmail,
        }
      );

      toast.success(
        response.data?.message ||
          "Password reset instructions have been sent."
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050403]
        text-white
      "
      style={{
        "--cursor-x": `${cursor.x}%`,
        "--cursor-y": `${cursor.y}%`,
      }}
    >
      {/* ======================================================
          CUSTOM CURSOR
      ====================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          z-[100]
          hidden
          h-5
          w-5
          rounded-full
          border
          border-[#d6b36a]/70
          md:block
        "
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />

      <div
        className="
          pointer-events-none
          fixed
          z-[99]
          hidden
          h-[350px]
          w-[350px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#7f0000]/10
          blur-[90px]
          md:block
        "
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            inset-0
            opacity-70
          "
          style={{
            background: `
              radial-gradient(
                500px circle at
                var(--cursor-x)
                var(--cursor-y),
                rgba(139,0,0,0.13),
                transparent 70%
              )
            `,
          }}
        />

        <div
          className="
            absolute
            -left-48
            top-1/4
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#680000]/20
            blur-[140px]
            animate-[ambientGlow_9s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            -right-48
            bottom-0
            h-[550px]
            w-[550px]
            rounded-full
            bg-[#9b732f]/10
            blur-[130px]
            animate-[ambientGlow_12s_ease-in-out_infinite_reverse]
          "
        />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.3) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.3) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "55px 55px",
          }}
        />

        {/* Diagonal pattern */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                135deg,
                rgba(255,255,255,0.3) 0px,
                rgba(255,255,255,0.3) 1px,
                transparent 1px,
                transparent 18px
              )
            `,
          }}
        />

        {/* Scan line */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#9b111e]
            to-transparent
            shadow-[0_0_20px_rgba(139,0,0,0.9)]
            animate-[scan_8s_linear_infinite]
          "
        />

        {/* Particles */}

        <CircleDot
          size={7}
          className="
            absolute
            left-[12%]
            top-[25%]
            text-[#a51c30]/60
            animate-[particle_6s_ease-in-out_infinite]
          "
        />

        <CircleDot
          size={5}
          className="
            absolute
            left-[40%]
            top-[16%]
            text-[#b49a67]/50
            animate-[particle_7s_ease-in-out_infinite_1s]
          "
        />

        <CircleDot
          size={7}
          className="
            absolute
            right-[15%]
            top-[35%]
            text-[#a51c30]/50
            animate-[particle_6s_ease-in-out_infinite_2s]
          "
        />

        <Sparkles
          size={14}
          className="
            absolute
            right-[10%]
            bottom-[20%]
            text-[#b8863d]/50
            animate-[sparkFloat_4s_ease-in-out_infinite]
          "
        />

        {/* Moon */}

        <div
          className="
            absolute
            right-[8%]
            top-[13%]
            hidden
            h-28
            w-28
            rounded-full
            border
            border-[#b8863d]/20
            bg-[#b8863d]/5
            shadow-[0_0_80px_rgba(184,134,61,0.08)]
            lg:block
          "
        >
          <div
            className="
              absolute
              right-2
              top-2
              h-24
              w-24
              rounded-full
              bg-[#d6b36a]/10
              blur-sm
            "
          />
        </div>

        {/* Castle */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-36
            opacity-20
          "
        >
          <div className="absolute bottom-0 left-[4%] h-28 w-20 bg-black" />
          <div className="absolute bottom-0 left-[8%] h-44 w-9 bg-black" />
          <div className="absolute bottom-0 left-[12%] h-24 w-24 bg-black" />

          <div className="absolute bottom-0 left-[42%] h-32 w-28 bg-black" />
          <div className="absolute bottom-0 left-[47%] h-48 w-10 bg-black" />

          <div className="absolute bottom-0 right-[12%] h-44 w-16 bg-black" />
          <div className="absolute bottom-0 right-[7%] h-28 w-28 bg-black" />
        </div>
      </div>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className="
          relative
          z-30
          border-b
          border-[#2b251e]
          bg-black/70
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[74px]
            max-w-[1500px]
            items-center
            justify-between
            px-5
            sm:px-8
            lg:px-10
          "
        >
          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#76101c]
                bg-gradient-to-br
                from-[#5e0713]
                to-black
                shadow-[0_0_25px_rgba(139,0,0,0.2)]
                transition-all
                duration-500
                group-hover:scale-110
                group-hover:rotate-3
              "
            >
              <BookOpen
                size={19}
                className="text-[#d6b36a]"
              />

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-2
                  w-2
                  rounded-full
                  bg-[#b8863d]
                  shadow-[0_0_10px_rgba(184,134,61,0.9)]
                  animate-pulse
                "
              />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-white">
                Smart
                <span className="text-[#a51c30]">
                  LMS
                </span>
              </h1>

              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-[#665b50]
                "
              >
                Learning Intelligence
              </p>
            </div>
          </Link>

          <div
            className="
              hidden
              items-center
              gap-2
              rounded-full
              border
              border-[#2e2923]
              bg-[#0b0907]/90
              px-4
              py-2
              sm:flex
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-500
                shadow-[0_0_10px_rgba(16,185,129,0.8)]
                animate-pulse
              "
            />

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]
                text-[#6d6256]
              "
            >
              The realm is secure
            </span>

            <ShieldCheck
              size={12}
              className="text-emerald-600"
            />
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main
        className="
          relative
          z-20
          flex
          min-h-[calc(100vh-74px)]
          items-center
          justify-center
          px-4
          py-10
          sm:px-6
        "
      >
        <div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="
            relative
            w-full
            max-w-[520px]
            overflow-hidden
            rounded-[28px]
            border
            border-[#342d25]
            bg-[#090806]/95
            p-7
            shadow-[0_40px_120px_rgba(0,0,0,0.85)]
            transition-transform
            duration-300
            sm:p-10
          "
        >
          {/* Corner */}

          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-24
              w-24
              border-r
              border-t
              border-[#72101d]/50
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              h-24
              w-24
              border-b
              border-l
              border-[#72101d]/50
            "
          />

          <div className="relative z-10">

            {/* Icon */}

            <div className="mb-7 flex justify-center">
              <div
                className="
                  relative
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#72101d]/70
                  bg-[#26070b]
                  text-[#d6b36a]
                  shadow-[0_0_35px_rgba(139,0,0,0.2)]
                  animate-[iconFloat_3s_ease-in-out_infinite]
                "
              >
                {submitted ? (
                  <CheckCircle2 size={28} />
                ) : (
                  <Mail size={28} />
                )}

                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    h-2
                    w-2
                    rounded-full
                    bg-[#b8863d]
                    shadow-[0_0_12px_rgba(184,134,61,0.8)]
                    animate-pulse
                  "
                />
              </div>
            </div>

            {/* Header */}

            <div className="text-center">

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-[#a51c30]
                "
              >
                Forgotten credentials
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-black
                  tracking-[-0.04em]
                  text-[#eee6da]
                "
              >
                {submitted
                  ? "Check your raven."
                  : "Forgot your password?"}
              </h2>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-[#746b60]
                "
              >
                {submitted
                  ? "If an account exists with this email, we have sent instructions to restore access to your realm."
                  : "Enter your email and we will send you a secure path back into your Smart LMS account."}
              </p>
            </div>

            {/* FORM / SUCCESS */}

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >
                <label
                  htmlFor="forgot-email"
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-[#82766a]
                  "
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#554c43]
                    "
                  />

                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="
                      h-13
                      w-full
                      rounded-xl
                      border
                      border-[#302a23]
                      bg-[#090806]
                      pl-11
                      pr-4
                      text-sm
                      text-[#eee6da]
                      outline-none
                      placeholder:text-[#443d35]
                      transition-all
                      duration-300
                      hover:border-[#4a4035]
                      focus:border-[#7b1724]
                      focus:ring-1
                      focus:ring-[#7b1724]/40
                    "
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    relative
                    mt-6
                    flex
                    h-14
                    w-full
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#841326]
                    bg-gradient-to-r
                    from-[#570711]
                    via-[#8e1328]
                    to-[#570711]
                    text-sm
                    font-black
                    text-[#f4eadc]
                    shadow-[0_0_30px_rgba(139,0,0,0.18)]
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:border-[#b8863d]
                    hover:shadow-[0_15px_45px_rgba(139,0,0,0.35)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      -left-24
                      w-20
                      -skew-x-12
                      bg-white/15
                      blur-md
                      animate-[buttonShine_3.5s_linear_infinite]
                    "
                  />

                  {loading ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white
                          border-t-transparent
                        "
                      />

                      Sending the raven...
                    </>
                  ) : (
                    <>
                      <Bird
                        size={17}
                        className="
                          transition-transform
                          duration-500
                          group-hover:-translate-y-1
                        "
                      />

                      Send reset instructions

                      <ArrowRight
                        size={17}
                        className="
                          transition-transform
                          duration-500
                          group-hover:translate-x-2
                        "
                      />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="mt-8">

                <div
                  className="
                    rounded-2xl
                    border
                    border-[#4d3d29]
                    bg-gradient-to-br
                    from-[#21170d]
                    via-[#100c08]
                    to-[#090806]
                    p-5
                  "
                >
                  <div className="flex gap-4">

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-[#59452b]
                        bg-[#1d140b]
                        text-[#d6b36a]
                      "
                    >
                      <Mail size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-[#eee6da]">
                        Check your inbox
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-[#766c60]">
                        The reset link is valid for
                        <span className="font-bold text-[#b8863d]">
                          {" "}15 minutes.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="
                    mt-5
                    w-full
                    text-[10px]
                    font-bold
                    text-[#62594e]
                    transition-colors
                    hover:text-[#d6b36a]
                  "
                >
                  Use another email
                </button>
              </div>
            )}

            {/* Back */}

            <Link
              to="/login"
              className="
                group
                mt-7
                flex
                items-center
                justify-center
                gap-2
                text-[10px]
                font-black
                uppercase
                tracking-[0.15em]
                text-[#62594e]
                transition-colors
                hover:text-[#d6b36a]
              "
            >
              <ArrowLeft
                size={13}
                className="
                  transition-transform
                  group-hover:-translate-x-1
                "
              />

              Return to login
            </Link>

            {/* Security */}

            <div
              className="
                mt-7
                flex
                items-center
                justify-center
                gap-2
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-[#3f3932]
              "
            >
              <ShieldCheck
                size={11}
                className="text-emerald-800"
              />

              Secure password recovery

              <Zap
                size={10}
                className="text-[#72101d]"
              />
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes ambientGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.45;
          }

          50% {
            transform: scale(1.12);
            opacity: 0.8;
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          70% {
            opacity: 0.6;
          }

          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes particle {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.25;
          }

          50% {
            transform: translateY(-20px);
            opacity: 0.9;
          }
        }

        @keyframes sparkFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }

          50% {
            transform: translateY(-12px) rotate(12deg);
            opacity: 0.8;
          }
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes buttonShine {
          0% {
            left: -100px;
          }

          45%, 100% {
            left: 130%;
          }
        }

        ::selection {
          background: rgba(139, 0, 0, 0.55);
          color: #f4eadc;
        }

        ::-webkit-scrollbar {
          width: 7px;
        }

        ::-webkit-scrollbar-track {
          background: #070605;
        }

        ::-webkit-scrollbar-thumb {
          background: #3b171c;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #701321;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;