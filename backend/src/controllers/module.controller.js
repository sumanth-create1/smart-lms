import Course from "../models/course.model.js";
import Module from "../models/module.model.js";
import Lecture from "../models/lecture.model.js";

export const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { moduleTitle, description } = req.body;

    if (!moduleTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module title is required.",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Only the instructor who owns the course can create modules
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this course.",
      });
    }

    const moduleCount = await Module.countDocuments({
      course: courseId,
    });

    const newModule = await Module.create({
      moduleTitle: moduleTitle.trim(),
      description: description?.trim() || "",
      order: moduleCount + 1,
      course: courseId,
    });

    return res.status(201).json({
      success: true,
      message: "Module created successfully.",
      module: newModule,
    });
  } catch (error) {
    console.error("CREATE MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create module.",
    });
  }
};

export const getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const modules = await Module.find({
      course: courseId,
    }).sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      modules,
    });
  } catch (error) {
    console.error("GET MODULES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch modules.",
    });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { moduleTitle, description } = req.body;

    const module = await Module.findById(moduleId).populate("course");

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found.",
      });
    }

    if (
      module.course.instructor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this module.",
      });
    }

    if (moduleTitle !== undefined) {
      if (!moduleTitle.trim()) {
        return res.status(400).json({
          success: false,
          message: "Module title cannot be empty.",
        });
      }

      module.moduleTitle = moduleTitle.trim();
    }

    if (description !== undefined) {
      module.description = description.trim();
    }

    await module.save();

    return res.status(200).json({
      success: true,
      message: "Module updated successfully.",
      module,
    });
  } catch (error) {
    console.error("UPDATE MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update module.",
    });
  }
};


export const deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId).populate("course");

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found.",
      });
    }

    if (
      module.course.instructor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this module.",
      });
    }

    // Check whether lectures belong to this module
    const lectureCount = await Lecture.countDocuments({
      module: moduleId,
    });

    if (lectureCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete this module because it still contains lectures.",
      });
    }

    await Module.findByIdAndDelete(moduleId);

    return res.status(200).json({
      success: true,
      message: "Module deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete module.",
    });
  }
};