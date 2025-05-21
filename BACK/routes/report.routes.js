const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { authenticateToken, requireAdmin } = require("../utils/utilities");

// Public reporting
router.post("/user", authenticateToken, reportController.reportUser);
router.post("/project", authenticateToken, reportController.reportProject);

// Admin actions
router.get("/admin/users", authenticateToken, requireAdmin, reportController.getUserReports);
router.get("/admin/projects", authenticateToken, requireAdmin, reportController.getProjectReports);

router.delete("/admin/delete-user/:id", authenticateToken, requireAdmin, reportController.deleteUser);
router.delete("/admin/delete-project/:id", authenticateToken, requireAdmin, reportController.deleteProject);
router.delete("/admin/delete-report/:id", authenticateToken, requireAdmin, reportController.deleteReport);

module.exports = router;
