const ReportUser = require("../models/reportUser.model");
const ReportProject = require("../models/reportProject.model");
const User = require("../models/user.model");
const Project = require("../models/project.model");

// 📌 Report a user
exports.reportUser = async (req, res) => {
  try {
    const reporterId = req.user.userId;
    const { reportedUserId, reason } = req.body;

    if (!reportedUserId || !reason) {
      return res.status(400).json({ message: "reportedUserId and reason are required" });
    }

    const report = new ReportUser({ reporterId, reportedUserId, reason });
    await report.save();

    res.status(201).json({ message: "User reported successfully", report });
  } catch (error) {
    console.error("Report User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Report a project
exports.reportProject = async (req, res) => {
  try {
    const reporterId = req.user.userId;
    const { projectId, reason } = req.body;

    if (!projectId || !reason) {
      return res.status(400).json({ message: "projectId and reason are required" });
    }

    const report = new ReportProject({ reporterId, projectId, reason });
    await report.save();

    res.status(201).json({ message: "Project reported successfully", report });
  } catch (error) {
    console.error("Report Project Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Get all reported users (admin)
exports.getUserReports = async (req, res) => {
  try {
    const reports = await ReportUser.find()
      .populate("reporterId", "fullName email")
      .populate("reportedUserId", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Get User Reports Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Get all reported projects (admin)
exports.getProjectReports = async (req, res) => {
  try {
    const reports = await ReportProject.find()
      .populate("reporterId", "fullName email")
      .populate("projectId")
      .sort({ createdAt: -1 });

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Get Project Reports Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Delete a user (admin)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Delete a project (admin)
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Delete a report (works for both)
exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const deleted =
      (await ReportUser.findByIdAndDelete(reportId)) ||
      (await ReportProject.findByIdAndDelete(reportId));

    if (!deleted) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Delete Report Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
