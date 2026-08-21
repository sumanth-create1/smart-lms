import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  LoaderCircle,
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

      // Don't show toast here because this is only
      // a background enrollment check.
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
          course?.courseTitle || "Course Enrollment",

        order_id: payment.orderId,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        notes: {
          courseId,
        },

        theme: {
          color: "#111827",
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

      // Payment verified
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
    course.instructor?.name || "Unknown Instructor";

  const instructorEmail =
    course.instructor?.email || "";

  const price = getCoursePrice();

  const isNonStudent =
    Boolean(user && user.role !== "student");

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={handleBackToCourses}
          className="
            mb-6
            flex
            items-center
            gap-2
            rounded-xl
            px-3
            py-2
            text-sm
            font-medium
            text-gray-600
            transition
            hover:bg-white
            hover:text-gray-900
          "
        >
          <ArrowLeft size={18} />

          Back to Courses
        </button>

        {/* HERO */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          <div className="grid lg:grid-cols-[1.25fr_1fr]">

            {/* THUMBNAIL */}

            <div
              className="
                relative
                min-h-[280px]
                bg-gray-100
                lg:min-h-[480px]
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
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    min-h-[280px]
                    items-center
                    justify-center
                    lg:min-h-[480px]
                  "
                >
                  <BookOpen
                    size={70}
                    className="text-gray-300"
                  />
                </div>
              )}

              <div className="absolute left-5 top-5">
                <span
                  className="
                    rounded-xl
                    bg-white/95
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-gray-800
                    shadow-sm
                    backdrop-blur
                  "
                >
                  {course.courseLevel || "Beginner"}
                </span>
              </div>
            </div>

            {/* COURSE INFORMATION */}

            <div
              className="
                flex
                flex-col
                justify-center
                p-6
                sm:p-8
                lg:p-10
              "
            >
              {/* CATEGORY */}

              {course.category && (
                <div className="mb-4">
                  <span
                    className="
                      rounded-lg
                      bg-gray-100
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-600
                    "
                  >
                    {course.category}
                  </span>
                </div>
              )}

              {/* TITLE */}

              <h1
                className="
                  text-3xl
                  font-bold
                  leading-tight
                  tracking-tight
                  text-gray-900
                  sm:text-4xl
                "
              >
                {course.courseTitle}
              </h1>

              {/* SUBTITLE */}

              {course.subTitle && (
                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-500
                  "
                >
                  {course.subTitle}
                </p>
              )}

              {/* INSTRUCTOR */}

              <div
                className="
                  mt-7
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                  "
                >
                  <UserRound
                    size={21}
                    className="text-gray-500"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">
                    Created by
                  </p>

                  <p
                    className="
                      truncate
                      font-semibold
                      text-gray-900
                    "
                  >
                    {instructorName}
                  </p>

                  {instructorEmail && (
                    <p
                      className="
                        truncate
                        text-xs
                        text-gray-400
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
                  mt-7
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <InfoCard
                  icon={<BookOpen size={19} />}
                  label="Level"
                  value={
                    course.courseLevel || "Beginner"
                  }
                />

                <InfoCard
                  icon={<Clock3 size={19} />}
                  label="Course Type"
                  value="Self Paced"
                />
              </div>

              {/* PRICE */}

              <div
                className="
                  mt-7
                  border-t
                  border-gray-100
                  pt-6
                "
              >
                <p className="text-xs text-gray-400">
                  Course Price
                </p>

                <p
                  className="
                    mt-1
                    text-3xl
                    font-bold
                    text-gray-900
                  "
                >
                  {price === 0
                    ? "Free"
                    : `₹${price.toLocaleString("en-IN")}`}
                </p>
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
                  mt-6
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  transition

                  ${
                    isNonStudent
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-gray-900 hover:bg-gray-800"
                  }

                  ${
                    enrollmentLoading
                      ? "cursor-wait opacity-80"
                      : ""
                  }
                `}
              >
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
                <p
                  className="
                    mt-3
                    text-center
                    text-xs
                    font-medium
                    text-green-600
                  "
                >
                  ✓ You are already enrolled
                  in this course.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div
          className="
            mt-6
            grid
            gap-6
            lg:grid-cols-[1fr_320px]
          "
        >
          {/* ABOUT */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
              sm:p-8
            "
          >
            <h2
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >
              About This Course
            </h2>

            <div className="mt-5">
              {course.description ? (
                <p
                  className="
                    whitespace-pre-line
                    text-sm
                    leading-7
                    text-gray-600
                  "
                >
                  {course.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  No course description has
                  been added yet.
                </p>
              )}
            </div>
          </div>

          {/* WHAT YOU GET */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <h2
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              What You'll Get
            </h2>

            <div className="mt-5 space-y-4">
              <Feature text="Learn at your own pace" />
              <Feature text="Access course content" />
              <Feature text="Track your learning progress" />
              <Feature text="Learn from an instructor" />
            </div>
          </div>
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
        flex
        min-h-screen
        items-center
        justify-center
        bg-[#F7F6F2]
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          gap-3
        "
      >
        <LoaderCircle
          size={38}
          className="animate-spin text-gray-900"
        />

        <p className="text-sm text-gray-500">
          Loading course...
        </p>
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

        Go to Dashboard
      </>
    );
  }

  if (!user) {
    return (
      <>
        Enroll in Course

        <CheckCircle2 size={18} />
      </>
    );
  }

  if (user.role !== "student") {
    return <>Student Enrollment Only</>;
  }

  if (price > 0 && !razorpayLoaded) {
    return <>Loading Payment...</>;
  }

  return (
    <>
      {price > 0
        ? `Buy Course • ₹${price.toLocaleString("en-IN")}`
        : "Enroll for Free"}

      <CheckCircle2 size={18} />
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
        rounded-xl
        border
        border-gray-100
        bg-gray-50
        p-4
      "
    >
      <div className="mb-2 text-gray-500">
        {icon}
      </div>

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-semibold
          text-gray-800
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
        flex
        items-start
        gap-3
      "
    >
      <CheckCircle2
        size={18}
        className="
          mt-0.5
          shrink-0
          text-gray-700
        "
      />

      <p
        className="
          text-sm
          leading-6
          text-gray-600
        "
      >
        {text}
      </p>
    </div>
  );
};

export default StudentCourseDetails;