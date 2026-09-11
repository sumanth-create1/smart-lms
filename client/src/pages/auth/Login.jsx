import { useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  Bird,
  BookOpen,
  Check,
  CircleDot,
  Crown,
  Eye,
  EyeOff,
  Fingerprint,
  Flame,
  GraduationCap,
  LockKeyhole,
  MailCheck,
  Moon,
  ShieldCheck,
  Sparkles,
  Sword,
  Users,
  X,
  Zap,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const cardRef = useRef(null);

  // ============================================================
  // FORM STATE
  // ============================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // ============================================================
  // EMAIL VERIFICATION STATE
  // ============================================================

  const [showResendVerification, setShowResendVerification] =
    useState(false);

  const [resendingVerification, setResendingVerification] =
    useState(false);

  // ============================================================
  // CURSOR STATE
  // ============================================================

  const [cursor, setCursor] = useState({
    x: 50,
    y: 50,
  });

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  // ============================================================
  // CURSOR EFFECT
  // ============================================================

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x =
        (event.clientX / window.innerWidth) * 100;

      const y =
        (event.clientY / window.innerHeight) * 100;

      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });

      setCursor({
        x,
        y,
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
  // CARD TILT EFFECT
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
  // INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Hide resend box when user changes email
    if (name === "email") {
      setShowResendVerification(false);
    }
  };

  // ============================================================
  // ROLE CHANGE
  // ============================================================

  const handleRoleChange = (role) => {
    setFormData((previous) => ({
      ...previous,
      role,
    }));

    setShowResendVerification(false);
  };

  // ============================================================
  // RESEND VERIFICATION EMAIL
  // ============================================================

  const handleResendVerification = async () => {
    const email =
      formData.email.trim().toLowerCase();

    if (!email) {
      toast.error(
        "Please enter your email address first."
      );
      return;
    }

    try {
      setResendingVerification(true);

      const response = await api.post(
        "/auth/resend-verification",
        {
          email,
        }
      );

      toast.success(
        response.data?.message ||
          "Verification email sent successfully."
      );

      setShowResendVerification(false);
    } catch (error) {
      console.error(
        "Resend verification error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to resend verification email."
      );
    } finally {
      setResendingVerification(false);
    }
  };

  // ============================================================
  // LOGIN
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email =
      formData.email.trim();

    const password =
      formData.password.trim();

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!email) {
      toast.error(
        "Please enter your email."
      );
      return;
    }

    if (!password) {
      toast.error(
        "Please enter your password."
      );
      return;
    }

    if (!formData.role) {
      toast.error(
        "Please select your role."
      );
      return;
    }

    // ----------------------------------------------------------
    // LOGIN
    // ----------------------------------------------------------

    try {
      setLoading(true);

      await login(
        email,
        password,
        formData.role
      );

      toast.success(
        `Welcome back, ${
          formData.role === "student"
            ? "Student"
            : "Instructor"
        }!`
      );

      // --------------------------------------------------------
      // REDIRECT
      // --------------------------------------------------------

      if (
        formData.role === "instructor"
      ) {
        navigate(
          "/instructor/dashboard",
          {
            replace: true,
          }
        );
      } else {
        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      const responseData =
        error?.response?.data;

      // --------------------------------------------------------
      // EMAIL VERIFICATION REQUIRED
      // --------------------------------------------------------

      if (
        responseData?.requiresVerification
      ) {
        setShowResendVerification(true);

        toast.error(
          "Please verify your email before logging in."
        );

        return;
      }

      // --------------------------------------------------------
      // NORMAL LOGIN ERROR
      // --------------------------------------------------------

      toast.error(
        responseData?.message ||
          error?.message ||
          "Login failed. Please try again."
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
      {/* ========================================================
          CUSTOM CURSOR
      ======================================================== */}

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

      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Cursor glow */}

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

        {/* Red glow */}

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

        {/* Gold glow */}

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

        {/* Medieval grid */}

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

        {/* Floating particles */}

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

        {/* Embers */}

        <span
          className="
            absolute
            left-[8%]
            top-[65%]
            h-1
            w-1
            rounded-full
            bg-[#b8863d]
            shadow-[0_0_12px_rgba(184,134,61,0.8)]
            animate-[ember_5s_linear_infinite]
          "
        />

        <span
          className="
            absolute
            left-[24%]
            top-[30%]
            h-1
            w-1
            rounded-full
            bg-[#9f1d35]
            shadow-[0_0_12px_rgba(159,29,53,0.8)]
            animate-[ember_7s_linear_infinite_1s]
          "
        />

        <span
          className="
            absolute
            right-[25%]
            top-[72%]
            h-1
            w-1
            rounded-full
            bg-[#b8863d]
            shadow-[0_0_12px_rgba(184,134,61,0.8)]
            animate-[ember_6s_linear_infinite_2s]
          "
        />

        <span
          className="
            absolute
            right-[8%]
            top-[25%]
            h-1
            w-1
            rounded-full
            bg-[#9f1d35]
            shadow-[0_0_12px_rgba(159,29,53,0.8)]
            animate-[ember_8s_linear_infinite]
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

        {/* Castle silhouette */}

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

      {/* ========================================================
          HEADER
      ======================================================== */}

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
            className="
              group
              flex
              items-center
              gap-3
            "
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
                group-hover:shadow-[0_0_40px_rgba(139,0,0,0.45)]
              "
            >
              <BookOpen
                size={19}
                className="
                  text-[#d6b36a]
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
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

      {/* ========================================================
          MAIN
      ======================================================== */}

      <main
        className="
          relative
          z-20
          flex
          min-h-[calc(100vh-74px)]
          items-center
          justify-center
          px-4
          py-8
          sm:px-6
          lg:px-10
          lg:py-12
        "
      >
        <div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="
            relative
            mx-auto
            grid
            w-full
            max-w-[1200px]
            overflow-hidden
            rounded-[28px]
            border
            border-[#342d25]
            bg-[#090806]/95
            shadow-[0_40px_120px_rgba(0,0,0,0.85)]
            transition-transform
            duration-300
            ease-out
            lg:grid-cols-[1.05fr_0.95fr]
          "
        >

          {/* ====================================================
              LEFT PANEL
          ==================================================== */}

          <section
            className="
              relative
              hidden
              min-h-[700px]
              overflow-hidden
              border-r
              border-[#302820]
              bg-[#080706]
              lg:block
            "
          >
            <div
              className="
                absolute
                -left-40
                top-1/4
                h-[600px]
                w-[600px]
                rounded-full
                bg-[#680000]/20
                blur-[140px]
              "
            />

            <div
              className="
                absolute
                bottom-[-180px]
                right-[-120px]
                h-[450px]
                w-[450px]
                rounded-full
                bg-[#a67c32]/10
                blur-[120px]
              "
            />

            {/* Corner decorations */}

            <div
              className="
                absolute
                left-8
                top-8
                h-16
                w-16
                border-l
                border-t
                border-[#7c1520]/70
              "
            />

            <div
              className="
                absolute
                bottom-8
                right-8
                h-16
                w-16
                border-b
                border-r
                border-[#7c1520]/70
              "
            />

            {/* Top label */}

            <div
              className="
                absolute
                left-10
                top-10
                flex
                items-center
                gap-2
              "
            >
              <Bird
                size={17}
                className="
                  text-[#a51c30]
                  animate-[birdFloat_3s_ease-in-out_infinite]
                "
              />

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-[#807466]
                "
              >
                The learning realm
              </span>
            </div>

            <div
              className="
                relative
                z-10
                flex
                h-full
                flex-col
                justify-between
                p-10
                xl:p-12
              "
            >
              {/* Hero */}

              <div className="pt-12">
                <p
                  className="
                    mb-4
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.3em]
                    text-[#b8863d]
                  "
                >
                  Hear the ravens
                </p>

                <h2
                  className="
                    text-5xl
                    font-black
                    leading-[0.92]
                    tracking-[-0.05em]
                    text-[#eee6da]
                    xl:text-6xl
                  "
                >
                  MASTER
                  <br />

                  <span
                    className="
                      bg-gradient-to-r
                      from-[#8c101f]
                      via-[#b82035]
                      to-[#d6b36a]
                      bg-clip-text
                      text-transparent
                    "
                  >
                    YOUR CRAFT.
                  </span>
                </h2>

                <p
                  className="
                    mt-6
                    max-w-md
                    text-sm
                    leading-7
                    text-[#756b5f]
                  "
                >
                  Enter the realm of Smart LMS.
                  Sharpen your skills, complete
                  your quests, and move closer to
                  mastery.
                </p>
              </div>

              {/* ==================================================
                  THRONE
              ================================================== */}

              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-[300px]
                  w-[300px]
                  items-center
                  justify-center
                "
              >
                {/* Outer ring */}

                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border
                    border-dashed
                    border-[#75111e]/60
                    animate-[rotate_20s_linear_infinite]
                  "
                />

                {/* Inner ring */}

                <div
                  className="
                    absolute
                    inset-8
                    rounded-full
                    border
                    border-[#40372e]
                    animate-[rotateReverse_28s_linear_infinite]
                  "
                />

                {/* Rune points */}

                <span
                  className="
                    absolute
                    left-1/2
                    top-0
                    -translate-x-1/2
                    text-xs
                    text-[#8e7c68]
                  "
                >
                  ᚱ
                </span>

                <span
                  className="
                    absolute
                    right-1
                    top-1/2
                    text-xs
                    text-[#8e7c68]
                  "
                >
                  ᚷ
                </span>

                <span
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    -translate-x-1/2
                    text-xs
                    text-[#8e7c68]
                  "
                >
                  ᛏ
                </span>

                <span
                  className="
                    absolute
                    left-1
                    top-1/2
                    text-xs
                    text-[#8e7c68]
                  "
                >
                  ᛒ
                </span>

                {/* Throne */}

                <div
                  className="
                    relative
                    flex
                    h-44
                    w-36
                    items-end
                    justify-center
                  "
                >
                  {/* Crown */}

                  <Crown
                    size={27}
                    className="
                      absolute
                      -top-3
                      text-[#b8863d]
                      drop-shadow-[0_0_12px_rgba(184,134,61,0.4)]
                    "
                  />

                  {/* Back */}

                  <div
                    className="
                      absolute
                      top-5
                      h-28
                      w-24
                      rounded-t-[50%]
                      border
                      border-[#625548]
                      bg-gradient-to-b
                      from-[#38322b]
                      via-[#181613]
                      to-black
                      shadow-[0_0_50px_rgba(0,0,0,0.9)]
                    "
                  />

                  {/* Swords */}

                  <Sword
                    size={74}
                    strokeWidth={1}
                    className="
                      absolute
                      -left-3
                      top-1
                      -rotate-[25deg]
                      text-[#665c51]
                    "
                  />

                  <Sword
                    size={74}
                    strokeWidth={1}
                    className="
                      absolute
                      left-4
                      top-0
                      -rotate-[12deg]
                      text-[#665c51]
                    "
                  />

                  <Sword
                    size={74}
                    strokeWidth={1}
                    className="
                      absolute
                      left-1/2
                      top-0
                      -translate-x-1/2
                      text-[#74685a]
                    "
                  />

                  <Sword
                    size={74}
                    strokeWidth={1}
                    className="
                      absolute
                      right-4
                      top-0
                      rotate-[12deg]
                      text-[#665c51]
                    "
                  />

                  <Sword
                    size={74}
                    strokeWidth={1}
                    className="
                      absolute
                      -right-3
                      top-1
                      rotate-[25deg]
                      text-[#665c51]
                    "
                  />

                  {/* Seat */}

                  <div
                    className="
                      absolute
                      bottom-5
                      h-20
                      w-28
                      rounded-t-xl
                      border
                      border-[#51483e]
                      bg-gradient-to-b
                      from-[#37312a]
                      to-[#0d0c0a]
                    "
                  />

                  {/* Legs */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-7
                      h-9
                      w-5
                      rotate-[8deg]
                      bg-[#26221e]
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-0
                      right-7
                      h-9
                      w-5
                      -rotate-[8deg]
                      bg-[#26221e]
                    "
                  />
                </div>

                {/* Core */}

                <div
                  className="
                    absolute
                    h-2
                    w-2
                    rounded-full
                    bg-[#d6b36a]
                    shadow-[0_0_25px_8px_rgba(214,179,106,0.18)]
                    animate-ping
                  "
                />

                {/* Bird */}

                <div
                  className="
                    absolute
                    left-0
                    top-1/3
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#40372e]
                    bg-black
                    text-[#8a7c6b]
                    shadow-xl
                    animate-[iconFloat_5s_ease-in-out_infinite]
                  "
                >
                  <Bird size={16} />
                </div>

                {/* Crown */}

                <div
                  className="
                    absolute
                    right-0
                    top-1/2
                    flex
                    h-11
                    w-11
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#4a3e2e]
                    bg-black
                    text-[#b8863d]
                    shadow-xl
                    animate-[iconFloat_4s_ease-in-out_infinite_1s]
                  "
                >
                  <Crown size={17} />
                </div>
              </div>

              {/* Status */}

              <div>
                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                  "
                >
                  <span className="text-[#62594f]">
                    Realm status
                  </span>

                  <span className="text-[#a67c32]">
                    Online
                  </span>
                </div>

                <div className="h-1 overflow-hidden bg-[#1b1713]">
                  <div
                    className="
                      h-full
                      w-[76%]
                      bg-gradient-to-r
                      from-[#5a0712]
                      via-[#96182b]
                      to-[#b8863d]
                      shadow-[0_0_15px_rgba(139,0,0,0.5)]
                      animate-[progressPulse_4s_ease-in-out_infinite]
                    "
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className="
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-[#4d463e]
                    "
                  >
                    Smart LMS // The Realm
                  </span>

                  <Flame
                    size={13}
                    className="
                      text-[#8d111f]
                      animate-pulse
                    "
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================
              RIGHT PANEL
          ==================================================== */}

          <section
            className="
              relative
              flex
              items-center
              bg-[#0b0907]
              p-6
              sm:p-10
              lg:p-12
            "
          >
            {/* Corner decorations */}

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

            <div className="relative z-10 w-full">

              {/* ==================================================
                  HEADER
              ================================================== */}

              <div className="mb-8">

                <div className="mb-5 flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[#72101d]/60
                      bg-[#26070b]
                      text-[#d6b36a]
                      shadow-[0_0_25px_rgba(139,0,0,0.15)]
                      animate-[iconFloat_3s_ease-in-out_infinite]
                    "
                  >
                    <Fingerprint size={20} />
                  </div>

                  <div>

                    <p
                      className="
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.25em]
                        text-[#a51c30]
                      "
                    >
                      Authentication
                    </p>

                    <p
                      className="
                        mt-1
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-[#62594e]
                      "
                    >
                      Secure access protocol
                    </p>

                  </div>
                </div>

                <h2
                  className="
                    text-4xl
                    font-black
                    tracking-[-0.04em]
                    text-[#eee6da]
                  "
                >
                  Welcome back.
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-[#746b60]
                  "
                >
                  Sign in and continue your
                  learning journey.
                </p>
              </div>

              {/* ==================================================
                  LOGIN FORM
              ================================================== */}

              <form onSubmit={handleSubmit}>

                {/* ROLE */}

                <div className="mb-6">

                  <div className="mb-3 flex items-center justify-between">

                    <label
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        text-[#82766a]
                      "
                    >
                      Choose your path
                    </label>

                    <span
                      className="
                        flex
                        items-center
                        gap-1
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#544c43]
                      "
                    >
                      <LockKeyhole size={10} />
                      Role based
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    {/* STUDENT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange(
                          "student"
                        )
                      }
                      className={`
                        group
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        p-3
                        text-left
                        transition-all
                        duration-300
                        hover:-translate-y-1

                        ${
                          formData.role ===
                          "student"
                            ? `
                              border-[#801324]
                              bg-gradient-to-br
                              from-[#30070d]
                              to-[#100b08]
                              shadow-[0_0_25px_rgba(139,0,0,0.15)]
                            `
                            : `
                              border-[#302a23]
                              bg-[#0a0907]
                              hover:border-[#4b4035]
                            `
                        }
                      `}
                    >
                      {formData.role ===
                        "student" && (
                        <span
                          className="
                            absolute
                            bottom-0
                            left-0
                            h-px
                            w-full
                            bg-gradient-to-r
                            from-transparent
                            via-[#b8863d]
                            to-transparent
                          "
                        />
                      )}

                      <div className="flex items-center gap-3">

                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            transition-all
                            duration-300
                            group-hover:scale-110

                            ${
                              formData.role ===
                              "student"
                                ? `
                                  border-[#72101d]
                                  bg-[#35070d]
                                  text-[#d6b36a]
                                `
                                : `
                                  border-[#302a23]
                                  bg-[#15120f]
                                  text-[#62594e]
                                `
                            }
                          `}
                        >
                          <GraduationCap size={18} />
                        </div>

                        <div>

                          <p
                            className={`
                              text-xs
                              font-black

                              ${
                                formData.role ===
                                "student"
                                  ? "text-[#eee6da]"
                                  : "text-[#93887b]"
                              }
                            `}
                          >
                            Student
                          </p>

                          <p className="mt-0.5 text-[9px] text-[#5e554b]">
                            Learn & conquer
                          </p>

                        </div>
                      </div>
                    </button>

                    {/* INSTRUCTOR */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange(
                          "instructor"
                        )
                      }
                      className={`
                        group
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        p-3
                        text-left
                        transition-all
                        duration-300
                        hover:-translate-y-1

                        ${
                          formData.role ===
                          "instructor"
                            ? `
                              border-[#801324]
                              bg-gradient-to-br
                              from-[#30070d]
                              to-[#100b08]
                              shadow-[0_0_25px_rgba(139,0,0,0.15)]
                            `
                            : `
                              border-[#302a23]
                              bg-[#0a0907]
                              hover:border-[#4b4035]
                            `
                        }
                      `}
                    >
                      {formData.role ===
                        "instructor" && (
                        <span
                          className="
                            absolute
                            bottom-0
                            left-0
                            h-px
                            w-full
                            bg-gradient-to-r
                            from-transparent
                            via-[#b8863d]
                            to-transparent
                          "
                        />
                      )}

                      <div className="flex items-center gap-3">

                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            transition-all
                            duration-300
                            group-hover:scale-110

                            ${
                              formData.role ===
                              "instructor"
                                ? `
                                  border-[#72101d]
                                  bg-[#35070d]
                                  text-[#d6b36a]
                                `
                                : `
                                  border-[#302a23]
                                  bg-[#15120f]
                                  text-[#62594e]
                                `
                            }
                          `}
                        >
                          <Users size={18} />
                        </div>

                        <div>

                          <p
                            className={`
                              text-xs
                              font-black

                              ${
                                formData.role ===
                                "instructor"
                                  ? "text-[#eee6da]"
                                  : "text-[#93887b]"
                              }
                            `}
                          >
                            Instructor
                          </p>

                          <p className="mt-0.5 text-[9px] text-[#5e554b]">
                            Teach & rule
                          </p>

                        </div>
                      </div>
                    </button>

                  </div>
                </div>

                {/* EMAIL */}

                <div className="mb-5">

                  <label
                    htmlFor="email"
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

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#302a23]
                      bg-[#090806]
                      px-4
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

                {/* PASSWORD */}

                <div className="mb-5">

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-[#82766a]
                      "
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="
                        text-[10px]
                        font-bold
                        text-[#a51c30]
                        transition-all
                        hover:text-[#d6b36a]
                      "
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-[#302a23]
                        bg-[#090806]
                        px-4
                        pr-12
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

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      className="
                        absolute
                        right-2
                        top-1/2
                        flex
                        h-8
                        w-8
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-[#5e554b]
                        transition-all
                        duration-300
                        hover:bg-[#17130f]
                        hover:text-[#d6b36a]
                        hover:scale-110
                      "
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>
                </div>

                {/* SECURITY */}

                <div
                  className="
                    mb-6
                    flex
                    items-center
                    justify-between
                  "
                >

                  <label
                    className="
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      text-[#5e554b]
                    "
                  >
                    <input
                      type="checkbox"
                      className="
                        h-3.5
                        w-3.5
                        rounded
                        border-[#4a4035]
                        bg-[#15120f]
                        accent-[#8f1111]
                      "
                    />

                    Remember this session
                  </label>

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#5e554b]
                    "
                  >
                    <ShieldCheck
                      size={12}
                      className="text-emerald-700"
                    />

                    Encrypted
                  </div>

                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    relative
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

                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      rounded-xl
                      border
                      border-[#d6b36a]/0
                      transition-all
                      duration-500
                      group-hover:border-[#d6b36a]/40
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

                      Opening the gates...
                    </>
                  ) : (
                    <>
                      <Sword
                        size={17}
                        className="
                          rotate-[-35deg]
                          transition-transform
                          duration-500
                          group-hover:rotate-[-15deg]
                        "
                      />

                      Enter as{" "}
                      {formData.role ===
                      "student"
                        ? "Student"
                        : "Instructor"}

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

              {/* ==================================================
                  VERIFICATION BOX
              ================================================== */}

              {showResendVerification && (
                <div
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-[#72101d]/70
                    bg-gradient-to-br
                    from-[#27070b]
                    via-[#100b08]
                    to-[#090806]
                    p-4
                    shadow-[0_0_30px_rgba(139,0,0,0.12)]
                    animate-[verificationAppear_400ms_ease-out]
                  "
                >

                  <div className="mb-4 flex items-start gap-3">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#72101d]
                        bg-[#35070d]
                        text-[#d6b36a]
                      "
                    >
                      <MailCheck size={17} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-black text-[#eee6da]">
                        Your raven could not reach you
                      </p>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          leading-5
                          text-[#766c60]
                        "
                      >
                        Your email has not been
                        verified. Request a fresh
                        verification link.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowResendVerification(
                          false
                        )
                      }
                      className="
                        ml-auto
                        shrink-0
                        text-[#51483e]
                        transition-colors
                        hover:text-[#d6b36a]
                      "
                      aria-label="Close verification options"
                    >
                      <X size={15} />
                    </button>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleResendVerification
                    }
                    disabled={
                      resendingVerification
                    }
                    className="
                      group
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      border
                      border-[#55442d]
                      bg-[#17120c]
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      text-[#b8863d]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-[#b8863d]
                      hover:bg-[#21190e]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {resendingVerification ? (
                      <>
                        <span
                          className="
                            h-3.5
                            w-3.5
                            animate-spin
                            rounded-full
                            border-2
                            border-[#b8863d]
                            border-t-transparent
                          "
                        />

                        Sending raven...
                      </>
                    ) : (
                      <>
                        <Bird
                          size={14}
                          className="
                            transition-transform
                            group-hover:-translate-y-1
                          "
                        />

                        Resend verification
                      </>
                    )}
                  </button>

                </div>
              )}

              {/* Verification shortcut */}

              {!showResendVerification && (
                <button
                  type="button"
                  onClick={() =>
                    setShowResendVerification(
                      true
                    )
                  }
                  className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    text-[10px]
                    font-bold
                    text-[#554c43]
                    transition-all
                    duration-300
                    hover:text-[#b8863d]
                  "
                >
                  <Bird size={12} />

                  Didn't receive your verification email?
                </button>
              )}

              {/* ==================================================
                  DIVIDER
              ================================================== */}

              <div className="my-6 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#211d18]" />

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-[#51483e]
                  "
                >
                  <Moon size={9} />
                  Another path
                </span>

                <div className="h-px flex-1 bg-[#211d18]" />

              </div>

              {/* GOOGLE */}

              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Google login will be available soon."
                  )
                }
                className="
                  group
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-[#302a23]
                  bg-[#090806]
                  text-sm
                  font-bold
                  text-[#85796b]
                  transition-all
                  duration-500
                  hover:-translate-y-0.5
                  hover:border-[#4d4235]
                  hover:bg-[#110e0b]
                  hover:text-[#eee6da]
                "
              >
                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#493d30]
                    bg-black
                    text-xs
                    font-black
                    text-[#a99a88]
                    transition-all
                    duration-300
                    group-hover:border-[#b8863d]
                    group-hover:text-[#d6b36a]
                  "
                >
                  G
                </span>

                Continue with Google
              </button>

              {/* REGISTER */}

              <p
                className="
                  mt-6
                  text-center
                  text-[10px]
                  text-[#5b5147]
                "
              >
                New to the realm?

                <Link
                  to="/register"
                  className="
                    ml-1.5
                    font-black
                    text-[#a51c30]
                    transition-colors
                    hover:text-[#d6b36a]
                  "
                >
                  Create your account
                </Link>
              </p>

              {/* FOOTER */}

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
                <Check
                  size={11}
                  className="text-emerald-800"
                />

                Smart LMS Secure Authentication

                <Zap
                  size={10}
                  className="text-[#72101d]"
                />
              </div>

            </div>
          </section>
        </div>
      </main>

      {/* ========================================================
          ANIMATIONS
      ======================================================== */}

      <style>{`
        @keyframes ambientGlow {
          0%,
          100% {
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
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.25;
          }

          50% {
            transform: translateY(-20px);
            opacity: 0.9;
          }
        }

        @keyframes sparkFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }

          50% {
            transform: translateY(-12px) rotate(12deg);
            opacity: 0.8;
          }
        }

        @keyframes ember {
          0% {
            transform: translateY(20px) scale(0.5);
            opacity: 0;
          }

          20% {
            opacity: 0.8;
          }

          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes birdFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-4px) rotate(-5deg);
          }
        }

        @keyframes progressPulse {
          0%,
          100% {
            width: 70%;
          }

          50% {
            width: 82%;
          }
        }

        @keyframes buttonShine {
          0% {
            left: -100px;
          }

          45%,
          100% {
            left: 130%;
          }
        }

        @keyframes verificationAppear {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
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

export default Login;