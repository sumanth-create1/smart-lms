import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Sword,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// =====================================================
// STUDENT COURSE DETAILS
// =====================================================
// Features:
// - Public course details
// - Guest users can view course
// - Students can enroll
// - Free course enrollment
// - Paid course Razorpay payment
// - Payment verification
// - Premium medieval fantasy UI
// - React Hot Toast notifications
// =====================================================

const StudentCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // =====================================================
  // LOAD RAZORPAY
  // =====================================================

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", handleRazorpayLoad);
      existingScript.addEventListener("error", handleRazorpayError);

      return () => {
        existingScript.removeEventListener(
          "load",
          handleRazorpayLoad
        );
        existingScript.removeEventListener(
          "error",
          handleRazorpayError
        );
      };
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = handleRazorpayLoad;
    script.onerror = handleRazorpayError;

    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  const handleRazorpayLoad = () => {
    setRazorpayLoaded(true);
  };

  const handleRazorpayError = () => {
    setRazorpayLoaded(false);

    toast.error(
      "Unable to load payment system. Please refresh and try again."
    );
  };

  // =====================================================
  // FETCH COURSE
  // =====================================================

  useEffect(() => {
    if (!courseId) {
      toast.error("Invalid course ID.");
      navigate("/courses", { replace: true });
      return;
    }

    fetchCourse();
  }, [courseId]);

  // =====================================================
  // CHECK ENROLLMENT
  // =====================================================

  useEffect(() => {
    if (
      authLoading ||
      !courseId ||
      !user ||
      user.role !== "student"
    ) {
      return;
    }

    checkEnrollment();
  }, [authLoading, courseId, user]);

  // =====================================================
  // FETCH COURSE
  // =====================================================

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/course/${courseId}`);

      if (!response.data?.success) {
        toast.error(
          response.data?.message || "Course not found."
        );

        navigate("/courses", { replace: true });
        return;
      }

      setCourse(response.data.course);
    } catch (error) {
      console.error("Fetch course error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load course details."
      );

      navigate("/courses", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHECK ENROLLMENT
  // =====================================================

  const checkEnrollment = async () => {
    try {
      const response = await api.get(
        `/enrollment/check/${courseId}`
      );

      if (response.data?.success) {
        const enrolled =
          response.data.enrolled ??
          response.data.isEnrolled ??
          false;

        setIsEnrolled(Boolean(enrolled));
      }
    } catch (error) {
      console.error("Check enrollment error:", error);

      setIsEnrolled(false);
    }
  };

  // =====================================================
  // LOGIN REDIRECT
  // =====================================================

  const redirectToLogin = () => {
    toast.info("Please login to enroll in this course.");

    navigate("/login", {
      state: {
        from: location.pathname,
      },
    });
  };

  // =====================================================
  // HANDLE ENROLLMENT
  // =====================================================

  const handleEnrollment = async () => {
    if (enrollmentLoading) {
      return;
    }

    // Guest
    if (!user) {
      redirectToLogin();
      return;
    }

    // Non-student
    if (user.role !== "student") {
      toast.error("Only students can enroll in courses.");
      return;
    }

    // Already enrolled
    if (isEnrolled) {
      navigate("/dashboard");
      return;
    }

    const price = getCoursePrice();

    // Free course
    if (price <= 0) {
      await handleFreeEnrollment();
      return;
    }

    // Paid course
    await handlePayment();
  };

  // =====================================================
  // GET COURSE PRICE
  // =====================================================

  const getCoursePrice = () => {
    return Number(
      course?.coursePrice ??
        course?.price ??
        0
    );
  };

  // =====================================================
  // FREE ENROLLMENT
  // =====================================================

  const handleFreeEnrollment = async () => {
    try {
      setEnrollmentLoading(true);

      const response = await api.post(
        `/enrollment/enroll/${courseId}`
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to enroll in course."
        );
        return;
      }

      setIsEnrolled(true);

      toast.success(
        response.data.message ||
          "Course enrolled successfully!"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Free enrollment error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to enroll in course."
      );
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // =====================================================
  // CREATE RAZORPAY ORDER
  // =====================================================

  const handlePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error(
        "Payment system is still loading. Please try again."
      );
      return;
    }

    try {
      setEnrollmentLoading(true);

      toast.loading("Creating payment order...", {
        id: "payment-order",
      });

      const response = await api.post(
        `/payment/create-order/${courseId}`
      );

      toast.dismiss("payment-order");

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to create payment order."
        );

        setEnrollmentLoading(false);
        return;
      }

      const payment = response.data.payment;
      const razorpayKey = response.data.razorpayKeyId;

      // Validate backend response
      if (!payment) {
        toast.error(
          "Payment order information was not received."
        );

        setEnrollmentLoading(false);
        return;
      }

      if (!razorpayKey) {
        toast.error(
          "Razorpay key was not received from server."
        );

        setEnrollmentLoading(false);
        return;
      }

      if (!payment.orderId) {
        toast.error("Invalid Razorpay order.");

        setEnrollmentLoading(false);
        return;
      }

      // =================================================
      // RAZORPAY OPTIONS
      // =================================================

      const options = {
        key: razorpayKey,

        amount: payment.amount,

        currency: payment.currency || "INR",

        name: "Smart LMS",

        description:
          course?.courseTitle ||
          "Course Enrollment",

        order_id: payment.orderId,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        notes: {
          courseId,
        },

        theme: {
          color: "#7f1d1d",
        },

        // ===============================================
        // PAYMENT SUCCESS
        // ===============================================

        handler: async (paymentResponse) => {
          await verifyPayment(paymentResponse);
        },

        // ===============================================
        // PAYMENT MODAL CLOSED
        // ===============================================

        modal: {
          ondismiss: () => {
            setEnrollmentLoading(false);

            toast.info("Payment cancelled.");
          },
        },
      };

      // =================================================
      // CREATE RAZORPAY INSTANCE
      // =================================================

      const razorpay = new window.Razorpay(options);

      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on(
        "payment.failed",
        (paymentFailure) => {
          console.error(
            "Razorpay payment failed:",
            paymentFailure
          );

          setEnrollmentLoading(false);

          toast.error(
            paymentFailure?.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      // =================================================
      // OPEN RAZORPAY
      // =================================================

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment initialization error:",
        error
      );

      toast.dismiss("payment-order");

      toast.error(
        error.response?.data?.message ||
          "Unable to create payment order."
      );

      setEnrollmentLoading(false);
    }
  };

  // =====================================================
  // VERIFY PAYMENT
  // =====================================================

  const verifyPayment = async (paymentResponse) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = paymentResponse;

      // Validate Razorpay response
      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        toast.error(
          "Incomplete payment information received."
        );

        setEnrollmentLoading(false);
        return;
      }

      toast.loading("Verifying payment...", {
        id: "payment-verification",
      });

      const response = await api.post(
        "/payment/verify",
        {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        }
      );

      toast.dismiss("payment-verification");

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Payment verification failed."
        );

        setEnrollmentLoading(false);
        return;
      }

      setIsEnrolled(true);

      toast.success(
        response.data.message ||
          "Payment successful! You are enrolled."
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      toast.dismiss("payment-verification");

      toast.error(
        error.response?.data?.message ||
          "Payment verification failed."
      );

      setEnrollmentLoading(false);
    }
  };

  // =====================================================
  // BACK TO COURSES
  // =====================================================

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <LoadingState />;
  }

  // =====================================================
  // COURSE NOT FOUND
  // =====================================================

  if (!course) {
    return null;
  }

  // =====================================================
  // COURSE DATA
  // =====================================================

  const thumbnailUrl = course.courseThumbnail?.url;

  const instructorName =
    course.instructor?.name ||
    "Unknown Instructor";

  const instructorEmail =
    course.instructor?.email || "";

  const price = getCoursePrice();

  const isNonStudent =
    Boolean(user && user.role !== "student");

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090909] text-stone-200">

      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Crimson glow */}
        <div
          className="
            absolute
            -left-40
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-red-900/10
            blur-[120px]
            animate-pulse
          "
        />

        {/* Gold glow */}
        <div
          className="
            absolute
            -right-40
            top-[35%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-amber-700/10
            blur-[140px]
          "
        />

        {/* Moon */}
        <div
          className="
            absolute
            right-[8%]
            top-10
            h-24
            w-24
            rounded-full
            bg-gradient-to-br
            from-stone-100/30
            to-stone-400/5
            shadow-[0_0_80px_rgba(255,255,255,0.08)]
          "
        />

        {/* Ambient particles */}
        <div className="absolute left-[12%] top-[22%] h-1 w-1 rounded-full bg-amber-300/50 animate-pulse" />
        <div className="absolute left-[28%] top-[65%] h-1 w-1 rounded-full bg-red-300/40 animate-pulse" />
        <div className="absolute right-[22%] top-[42%] h-1 w-1 rounded-full bg-amber-200/40 animate-pulse" />
        <div className="absolute right-[12%] top-[75%] h-1 w-1 rounded-full bg-red-300/30 animate-pulse" />
      </div>

      {/* =================================================
          TOP BORDER
      ================================================= */}

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={handleBackToCourses}
          className="
            group
            mb-7
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-stone-800
            bg-stone-950/70
            px-4
            py-2.5
            text-sm
            font-medium
            text-stone-400
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-amber-600/40
            hover:bg-stone-900
            hover:text-amber-300
            hover:shadow-[0_0_25px_rgba(180,120,30,0.08)]
          "
        >
          <ArrowLeft
            size={17}
            className="
              transition-transform
              duration-300
              group-hover:-translate-x-1
            "
          />

          Return to Courses
        </button>

        {/* =================================================
            HERO CARD
        ================================================= */}

        <div
          className="
            group
            overflow-hidden
            rounded-2xl
            border
            border-stone-800
            bg-[#101010]/90
            shadow-[0_30px_100px_rgba(0,0,0,0.55)]
            backdrop-blur-xl
          "
        >

          <div className="grid lg:grid-cols-[1.2fr_1fr]">

            {/* =================================================
                THUMBNAIL
            ================================================= */}

            <div
              className="
                relative
                min-h-[300px]
                overflow-hidden
                bg-stone-950
                lg:min-h-[560px]
              "
            >

              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={course.courseTitle}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-[1200ms]
                    ease-out
                    group-hover:scale-105
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    min-h-[300px]
                    items-center
                    justify-center
                    bg-gradient-to-br
                    from-stone-900
                    via-[#120909]
                    to-black
                    lg:min-h-[560px]
                  "
                >
                  <BookOpen
                    size={90}
                    strokeWidth={1}
                    className="text-stone-700"
                  />
                </div>
              )}

              {/* Image dark overlay */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black
                  via-black/30
                  to-transparent
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-black/30
                  via-transparent
                  to-red-950/20
                "
              />

              {/* Top golden line */}

              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-amber-400/70
                  to-transparent
                "
              />

              {/* Level badge */}

              <div className="absolute left-5 top-5">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-amber-500/30
                    bg-black/70
                    px-4
                    py-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-amber-300
                    shadow-lg
                    backdrop-blur-xl
                  "
                >
                  <Crown size={14} />

                  {course.courseLevel || "Beginner"}
                </div>
              </div>

              {/* Bottom image content */}

              <div
                className="
                  absolute
                  bottom-6
                  left-6
                  right-6
                "
              >
                <div
                  className="
                    mb-3
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-amber-300/80
                  "
                >
                  <Sword size={13} />

                  Knowledge • Power • Mastery
                </div>

                <div className="h-px w-24 bg-gradient-to-r from-amber-500 to-transparent" />
              </div>
            </div>

            {/* =================================================
                COURSE INFORMATION
            ================================================= */}

            <div
              className="
                relative
                flex
                flex-col
                justify-center
                overflow-hidden
                bg-gradient-to-br
                from-[#151515]
                via-[#101010]
                to-[#0a0a0a]
                p-6
                sm:p-8
                lg:p-11
              "
            >

              {/* Decorative glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-24
                  -top-24
                  h-72
                  w-72
                  rounded-full
                  bg-red-900/10
                  blur-[80px]
                "
              />

              {/* Decorative corner */}

              <div
                className="
                  absolute
                  right-5
                  top-5
                  h-16
                  w-16
                  border-r
                  border-t
                  border-amber-500/20
                "
              />

              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  h-16
                  w-16
                  border-b
                  border-l
                  border-red-500/10
                "
              />

              {/* CATEGORY */}

              {course.category && (
                <div className="relative z-10 mb-5">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-md
                      border
                      border-red-900/50
                      bg-red-950/30
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-red-300
                    "
                  >
                    <Sparkles size={12} />

                    {course.category}
                  </span>
                </div>
              )}

              {/* TITLE */}

              <h1
                className="
                  relative
                  z-10
                  max-w-2xl
                  text-3xl
                  font-bold
                  leading-[1.1]
                  tracking-tight
                  text-stone-100
                  sm:text-4xl
                  lg:text-[42px]
                "
              >
                {course.courseTitle}
              </h1>

              {/* Golden divider */}

              <div className="relative z-10 mt-5 flex items-center gap-3">
                <div className="h-px w-16 bg-amber-500/70" />

                <div className="h-1.5 w-1.5 rotate-45 bg-amber-500/70" />

                <div className="h-px w-8 bg-amber-500/30" />
              </div>

              {/* SUBTITLE */}

              {course.subTitle && (
                <p
                  className="
                    relative
                    z-10
                    mt-5
                    text-sm
                    leading-7
                    text-stone-400
                    sm:text-base
                  "
                >
                  {course.subTitle}
                </p>
              )}

              {/* INSTRUCTOR */}

              <div
                className="
                  relative
                  z-10
                  mt-7
                  flex
                  items-center
                  gap-4
                "
              >
                <div
                  className="
                    relative
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-amber-500/20
                    bg-gradient-to-br
                    from-stone-800
                    to-black
                    shadow-[0_0_25px_rgba(180,120,30,0.08)]
                  "
                >
                  <UserRound
                    size={21}
                    className="text-amber-400/80"
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      rounded-full
                      border
                      border-amber-400/10
                    "
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      text-stone-600
                    "
                  >
                    Crafted by
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-sm
                      font-semibold
                      text-stone-200
                    "
                  >
                    {instructorName}
                  </p>

                  {instructorEmail && (
                    <p
                      className="
                        truncate
                        text-xs
                        text-stone-500
                      "
                    >
                      {instructorEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* QUICK INFO */}

              <div
                className="
                  relative
                  z-10
                  mt-7
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <InfoCard
                  icon={<BookOpen size={17} />}
                  label="Level"
                  value={
                    course.courseLevel ||
                    "Beginner"
                  }
                />

                <InfoCard
                  icon={<Clock3 size={17} />}
                  label="Learning"
                  value="Self Paced"
                />
              </div>

              {/* PRICE */}

              <div
                className="
                  relative
                  z-10
                  mt-7
                  border-t
                  border-stone-800
                  pt-6
                "
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-stone-600
                      "
                    >
                      Claim your knowledge
                    </p>

                    <p
                      className="
                        mt-1
                        text-3xl
                        font-bold
                        tracking-tight
                        text-stone-100
                      "
                    >
                      {price === 0
                        ? "Free"
                        : `₹${price.toLocaleString(
                            "en-IN"
                          )}`}
                    </p>
                  </div>

                  <div
                    className="
                      hidden
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-green-900/40
                      bg-green-950/20
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-green-400
                      sm:flex
                    "
                  >
                    <ShieldCheck size={13} />

                    Secure
                  </div>
                </div>
              </div>

              {/* ENROLL BUTTON */}

              <button
                type="button"
                disabled={
                  enrollmentLoading ||
                  isNonStudent
                }
                onClick={handleEnrollment}
                className={`
                  group/button
                  relative
                  z-10
                  mt-6
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  overflow-hidden
                  rounded-xl
                  border
                  px-6
                  py-4
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  transition-all
                  duration-300

                  ${
                    isNonStudent
                      ? `
                        cursor-not-allowed
                        border-stone-700
                        bg-stone-800
                        text-stone-500
                      `
                      : `
                        border-amber-600/40
                        bg-gradient-to-r
                        from-red-950
                        via-red-900
                        to-red-950
                        text-amber-100
                        shadow-[0_10px_35px_rgba(120,20,20,0.2)]
                        hover:-translate-y-0.5
                        hover:border-amber-500/70
                        hover:shadow-[0_15px_45px_rgba(150,30,20,0.3)]
                      `
                  }

                  ${
                    enrollmentLoading
                      ? "cursor-wait opacity-80"
                      : ""
                  }
                `}
              >
                {/* Button shine */}

                {!isNonStudent &&
                  !enrollmentLoading && (
                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        -left-20
                        w-16
                        skew-x-[-20deg]
                        bg-white/10
                        transition-all
                        duration-700
                        group-hover/button:left-[110%]
                      "
                    />
                  )}

                <EnrollmentButtonContent
                  loading={enrollmentLoading}
                  isEnrolled={isEnrolled}
                  user={user}
                  price={price}
                  razorpayLoaded={razorpayLoaded}
                />
              </button>

              {/* ENROLLED MESSAGE */}

              {isEnrolled && (
                <div
                  className="
                    relative
                    z-10
                    mt-3
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-center
                    text-xs
                    font-medium
                    text-green-400
                  "
                >
                  <CheckCircle2 size={14} />

                  You already hold access to this course
                </div>
              )}

              {/* PAYMENT SECURITY */}

              {!isEnrolled &&
                user?.role === "student" &&
                price > 0 && (
                  <div
                    className="
                      relative
                      z-10
                      mt-4
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-[10px]
                      uppercase
                      tracking-[0.15em]
                      text-stone-600
                    "
                  >
                    <LockKeyhole size={12} />

                    Secure payment powered by Razorpay
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* =================================================
            LOWER CONTENT
        ================================================= */}

        <div
          className="
            mt-6
            grid
            gap-6
            lg:grid-cols-[1fr_340px]
          "
        >

          {/* =================================================
              ABOUT COURSE
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-stone-800
              bg-[#101010]/90
              p-6
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              backdrop-blur-xl
              sm:p-8
            "
          >
            {/* Decorative top line */}

            <div
              className="
                absolute
                left-8
                right-8
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-amber-500/40
                to-transparent
              "
            />

            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-amber-500/20
                  bg-amber-950/20
                "
              >
                <Sword
                  size={19}
                  className="text-amber-400"
                />
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    text-amber-500/70
                  "
                >
                  The Chronicle
                </p>

                <h2
                  className="
                    mt-0.5
                    text-xl
                    font-bold
                    text-stone-100
                  "
                >
                  About This Course
                </h2>
              </div>
            </div>

            <div className="mt-6">
              {course.description ? (
                <p
                  className="
                    whitespace-pre-line
                    text-sm
                    leading-8
                    text-stone-400
                  "
                >
                  {course.description}
                </p>
              ) : (
                <p
                  className="
                    text-sm
                    italic
                    text-stone-600
                  "
                >
                  The chronicles of this course
                  have yet to be written.
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              WHAT YOU GET
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-stone-800
              bg-gradient-to-br
              from-[#151515]
              to-[#0d0d0d]
              p-6
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              backdrop-blur-xl
            "
          >
            {/* Glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-40
                w-40
                rounded-full
                bg-amber-800/10
                blur-3xl
              "
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-red-500/20
                    bg-red-950/20
                  "
                >
                  <Crown
                    size={18}
                    className="text-red-300"
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      text-red-400/70
                    "
                  >
                    Your Reward
                  </p>

                  <h2
                    className="
                      mt-0.5
                      text-lg
                      font-bold
                      text-stone-100
                    "
                  >
                    What You'll Gain
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Feature text="Learn at your own pace" />
                <Feature text="Access course content" />
                <Feature text="Track your learning progress" />
                <Feature text="Learn from an instructor" />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER MOTTO
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-3
            py-10
            text-center
          "
        >
          <div className="h-px w-12 bg-stone-800" />

          <Flame
            size={14}
            className="text-amber-600/60"
          />

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-stone-700
            "
          >
            Knowledge is the sharpest weapon
          </p>

          <Flame
            size={14}
            className="text-amber-600/60"
          />

          <div className="h-px w-12 bg-stone-800" />
        </div>
      </div>
    </div>
  );
};

// =====================================================
// LOADING STATE
// =====================================================

const LoadingState = () => {
  return (
    <div
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#090909]
      "
    >
      {/* Background glow */}

      <div
        className="
          absolute
          h-72
          w-72
          rounded-full
          bg-red-900/10
          blur-[100px]
          animate-pulse
        "
      />

      <div className="relative z-10 flex flex-col items-center gap-5">

        <div
          className="
            relative
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            border
            border-amber-500/20
            bg-stone-950
            shadow-[0_0_50px_rgba(180,120,30,0.08)]
          "
        >
          <LoaderCircle
            size={32}
            className="animate-spin text-amber-500"
          />

          <div
            className="
              absolute
              inset-2
              rounded-full
              border
              border-red-500/10
            "
          />
        </div>

        <div className="text-center">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-amber-500/60
            "
          >
            Summoning the archives
          </p>

          <p
            className="
              mt-2
              text-sm
              text-stone-500
            "
          >
            Loading course...
          </p>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// ENROLLMENT BUTTON CONTENT
// =====================================================

const EnrollmentButtonContent = ({
  loading,
  isEnrolled,
  user,
  price,
  razorpayLoaded,
}) => {
  if (loading) {
    return (
      <>
        <LoaderCircle
          size={18}
          className="animate-spin"
        />

        Processing...
      </>
    );
  }

  if (isEnrolled) {
    return (
      <>
        <CheckCircle2 size={18} />

        Continue Learning
      </>
    );
  }

  if (!user) {
    return (
      <>
        Enter the Realm

        <ArrowLeft
          size={18}
          className="rotate-180"
        />
      </>
    );
  }

  if (user.role !== "student") {
    return <>Student Enrollment Only</>;
  }

  if (price > 0 && !razorpayLoaded) {
    return (
      <>
        <LoaderCircle
          size={17}
          className="animate-spin"
        />

        Preparing Payment
      </>
    );
  }

  return (
    <>
      {price > 0
        ? `Acquire Course • ₹${price.toLocaleString(
            "en-IN"
          )}`
        : "Claim This Course"}

      <Check size={18} />
    </>
  );
};

// =====================================================
// INFORMATION CARD
// =====================================================

const InfoCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div
      className="
        group/info
        rounded-xl
        border
        border-stone-800
        bg-stone-950/70
        p-4
        transition-all
        duration-300
        hover:border-amber-600/20
        hover:bg-stone-900
      "
    >
      <div
        className="
          mb-2
          text-amber-500/70
          transition-transform
          duration-300
          group-hover/info:scale-110
        "
      >
        {icon}
      </div>

      <p
        className="
          text-[9px]
          uppercase
          tracking-[0.18em]
          text-stone-600
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-semibold
          text-stone-300
        "
      >
        {value}
      </p>
    </div>
  );
};

// =====================================================
// FEATURE
// =====================================================

const Feature = ({ text }) => {
  return (
    <div
      className="
        group/feature
        flex
        items-start
        gap-3
      "
    >
      <div
        className="
          mt-0.5
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-md
          border
          border-amber-500/20
          bg-amber-950/20
          transition-all
          duration-300
          group-hover/feature:border-amber-500/40
          group-hover/feature:bg-amber-950/40
        "
      >
        <CheckCircle2
          size={14}
          className="text-amber-500/80"
        />
      </div>

      <p
        className="
          pt-0.5
          text-sm
          leading-6
          text-stone-400
          transition-colors
          duration-300
          group-hover/feature:text-stone-300
        "
      >
        {text}
      </p>
    </div>
  );
};

export default StudentCourseDetails;