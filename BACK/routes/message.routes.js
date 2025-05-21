const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { authenticateToken } = require("../utils/utilities");

router.post("/send", authenticateToken, messageController.sendMessage);
router.get("/:otherUserId", authenticateToken, messageController.getMessages);
router.get("/", authenticateToken, messageController.getConversations);

module.exports = router;
