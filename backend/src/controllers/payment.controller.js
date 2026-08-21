import crypto from "crypto";

import razorpay from "../config/razorpay.js";

import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import Payment from "../models/payment.model.js";


// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

export const createPaymentOrder = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;

    console.log("====================================");
    console.log("CREATE PAYMENT ORDER");
    console.log("Student ID:", studentId.toString());
    console.log("Course ID:", courseId);

    // ---------------------------------------------------
    // FIND COURSE
    // ---------------------------------------------------

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    console.log("Course:", course.courseTitle);
    console.log("Course Price:", course.coursePrice);

    // ---------------------------------------------------
    // CHECK ALREADY ENROLLED
    // ---------------------------------------------------

    const existingEnrollment =
      await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // ---------------------------------------------------
    // FREE COURSE
    // ---------------------------------------------------

    if (Number(course.coursePrice || 0) === 0) {
      const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
      });

      return res.status(201).json({
        success: true,
        freeCourse: true,
        message: "Successfully enrolled in free course",
        enrollment,
      });
    }

    // ---------------------------------------------------
    // PRICE
    // ---------------------------------------------------

    const amount = Number(course.coursePrice);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price",
      });
    }

    // Razorpay expects amount in paise
    const amountInPaise = Math.round(amount * 100);

    console.log("Amount:", amount);
    console.log("Amount in paise:", amountInPaise);

    // ---------------------------------------------------
    // CHECK RAZORPAY CONFIG
    // ---------------------------------------------------

    console.log(
      "Razorpay Key:",
      process.env.RAZORPAY_KEY_ID
    );

    console.log(
      "Razorpay Secret Loaded:",
      Boolean(process.env.RAZORPAY_KEY_SECRET)
    );

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: "Razorpay configuration is missing",
      });
    }

    // ---------------------------------------------------
    // CREATE RAZORPAY ORDER
    // ---------------------------------------------------

    const options = {
      amount: amountInPaise,
      currency: "INR",

      // Keep receipt short and unique
      receipt: `course_${Date.now()}`,

      notes: {
        studentId: studentId.toString(),
        courseId: courseId.toString(),
      },
    };

    console.log("Razorpay options:", options);
    console.log("Creating Razorpay order...");

    const order =
      await razorpay.orders.create(options);

    console.log(
      "Razorpay order created:",
      order.id
    );

    // ---------------------------------------------------
    // SAVE PAYMENT
    // ---------------------------------------------------

    const payment = await Payment.create({
      student: studentId,
      course: courseId,
      amount,
      currency: "INR",
      razorpayOrderId: order.id,
      status: "created",
    });

    console.log(
      "Payment saved:",
      payment._id.toString()
    );

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Payment order created",

      payment: {
        id: payment._id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },

      razorpayKeyId:
        process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("====================================");
    console.error("CREATE PAYMENT ORDER ERROR");
    console.error("====================================");

    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Code:", error.code);
    console.error("Status:", error.statusCode);
    console.error("Full Error:", error);

    console.error(
      "Razorpay Error:",
      error?.error
    );

    console.error(
      "Razorpay Description:",
      error?.error?.description
    );

    console.error("====================================");

    return res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error?.description ||
        error?.message ||
        "Unable to create payment order",
    });
  }
};


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

export const verifyPayment = async (req, res) => {
  try {
    const studentId = req.user._id;

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    console.log("====================================");
    console.log("VERIFY PAYMENT");
    console.log(
      "Student ID:",
      studentId.toString()
    );
    console.log(
      "Order ID:",
      razorpayOrderId
    );
    console.log(
      "Payment ID:",
      razorpayPaymentId
    );

    // ---------------------------------------------------
    // VALIDATE INPUT
    // ---------------------------------------------------

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing payment verification details",
      });
    }

    // ---------------------------------------------------
    // FIND PAYMENT
    // ---------------------------------------------------

    const payment = await Payment.findOne({
      razorpayOrderId,
      student: studentId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment order not found",
      });
    }

    console.log(
      "Payment found:",
      payment._id.toString()
    );

    // ---------------------------------------------------
    // IDEMPOTENCY
    // ---------------------------------------------------

    if (payment.status === "paid") {
      const enrollment =
        await Enrollment.findOne({
          student: studentId,
          course: payment.course,
        });

      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        enrollment,
      });
    }

    // ---------------------------------------------------
    // GENERATE SIGNATURE
    // ---------------------------------------------------

    const body =
      `${payment.razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    // ---------------------------------------------------
    // SAFE SIGNATURE COMPARISON
    // ---------------------------------------------------

    const receivedBuffer =
      Buffer.from(razorpaySignature);

    const expectedBuffer =
      Buffer.from(expectedSignature);

    if (
      receivedBuffer.length !==
        expectedBuffer.length ||
      !crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer
      )
    ) {
      console.error(
        "Invalid Razorpay signature"
      );

      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }

    console.log(
      "Razorpay signature verified"
    );

    // ---------------------------------------------------
    // MARK PAYMENT AS PAID
    // ---------------------------------------------------

    payment.razorpayPaymentId =
      razorpayPaymentId;

    payment.razorpaySignature =
      razorpaySignature;

    payment.status = "paid";
    payment.paidAt = new Date();

    await payment.save();

    console.log(
      "Payment marked as paid"
    );

    // ---------------------------------------------------
    // CREATE ENROLLMENT
    // ---------------------------------------------------

    let enrollment =
      await Enrollment.findOne({
        student: studentId,
        course: payment.course,
      });

    if (!enrollment) {
      enrollment =
        await Enrollment.create({
          student: studentId,
          course: payment.course,
        });

      console.log(
        "Enrollment created:",
        enrollment._id.toString()
      );
    } else {
      console.log(
        "Enrollment already exists:",
        enrollment._id.toString()
      );
    }

    // ---------------------------------------------------
    // SUCCESS
    // ---------------------------------------------------

    console.log(
      "Payment verification successful"
    );

    console.log("====================================");

    return res.status(200).json({
      success: true,
      message:
        "Payment verified and enrollment successful",
      enrollment,
    });

  } catch (error) {
    console.error("====================================");
    console.error("VERIFY PAYMENT ERROR");
    console.error("====================================");

    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Code:", error.code);
    console.error("Full Error:", error);

    console.error("====================================");

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to verify payment",
    });
  }
};