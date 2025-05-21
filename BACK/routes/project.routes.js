const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const { authenticateToken } = require("../utils/utilities");

router.post("/add", authenticateToken, projectController.addProject);
router.get("/all", authenticateToken, projectController.getAllProjects);
router.get('/projects/all', authenticateToken, projectController.getAllProjectsAll);

router.put("/edit/:id", authenticateToken, projectController.editProject);
router.delete("/delete/:id", authenticateToken, projectController.deleteProject);
router.post("/like/:id", authenticateToken, projectController.toggleLike);

router.post("/comment/:id", authenticateToken, projectController.addComment);
router.get("/comments/:projectId", projectController.getComments);

router.get("/search", projectController.searchProjects);

router.get("/:id", authenticateToken, projectController.getProjectById);


module.exports = router;
