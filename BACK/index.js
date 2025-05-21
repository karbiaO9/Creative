require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const config = require("./config.json");

// Middleware
const { authenticateToken, requireAdmin } = require("./utils/utilities");

// File handling
const upload = require("./utils/multer");
const fs = require("fs");

// Routes
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const messageRoutes = require("./routes/message.routes");
const reportRoutes = require("./routes/report.routes");

// Initialize app
const app = express();
mongoose.connect(config.ConnectionString);

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Mount routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/messages", messageRoutes);
app.use("/reports", reportRoutes);

// Handle file upload
app.post("/file-upload", upload.array("files", 24), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: true, message: "No files uploaded" });
    }

    const fileUrls = req.files.map(file => `http://localhost:5555/uploads/${file.filename}`);
    res.status(201).json({ files: fileUrls });
  } catch (error) {
    console.error("File Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Handle file delete
app.delete("/file-delete", async (req, res) => {
  const { fileUrl } = req.query;
  if (!fileUrl) {
    return res.status(400).json({ error: true, message: "fileUrl parameter is required" });
  }

  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ error: true, message: "File not found" });
    }
  } catch (error) {
    console.error("File Delete Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(5555, () => console.log("Server running on http://localhost:5555"));
module.exports = app;
