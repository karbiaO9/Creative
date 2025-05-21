const Message = require("../models/message.model");

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "receiverId and content are required" });
    }

    const newMessage = new Message({ senderId, receiverId, content });
    await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get full conversation between current user and another user
exports.getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const otherUserId = req.params.otherUserId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate("senderId", "fullName")
    .populate("receiverId", "fullName");

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get recent conversations (latest message per user)
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "fullName")
      .populate("receiverId", "fullName");

    const seen = new Set();
    const conversations = [];

    for (const msg of messages) {
      const otherUser =
        msg.senderId._id.toString() === userId
          ? msg.receiverId
          : msg.senderId;

      const key = otherUser._id.toString();
      if (!seen.has(key)) {
        seen.add(key);
        conversations.push({
          user: otherUser,
          lastMessage: msg.content,
          timestamp: msg.createdAt
        });
      }
    }

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Get Conversations Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
