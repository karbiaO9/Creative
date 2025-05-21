const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateToken } = require("../utils/utilities");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/get-user", authenticateToken, authController.getUser);
router.put("/update-profile", authenticateToken, authController.updateProfile);


module.exports = router;
