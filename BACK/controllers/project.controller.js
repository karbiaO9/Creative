const Project = require("../models/project.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const fs = require("fs");
const path = require("path");

// Add a new project
exports.addProject = async (req, res) => {
  try {
    const { title, description, attachmentsUrls, categories } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user || user.role !== 'designer') {
      return res.status(403).json({ message: 'Only designers can add projects' });
    }

    const project = new Project({
      title,
      description,
      attachmentsUrls: attachmentsUrls || [],
      categories: categories || [],
      designerInfo: {
        id: user._id,
        fullName: user.fullName
      },
      likes: []
    });

    await project.save();
    res.status(201).json({ message: 'Project added successfully', project });
  } catch (error) {
    console.error('Add Project Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /projects/all
exports.getAllProjectsAll = async (req, res) => {
  try {
    const projects = await Project.find()
      // If you still have designerInfo.id, populate it:
      .populate('designerInfo.id', 'fullName');
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Get all projects by a designer
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 'designerInfo.id': req.user.userId });
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Edit a project
exports.editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, attachmentsUrls, categories } = req.body;

    const user = await User.findById(req.user.userId);
    const project = await Project.findById(id);

    // use designerInfo.id now
    if (
      !project ||
      project.designerInfo.id.toString() !== user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }
    project.title = title || project.title;
    project.description = description || project.description;
    project.attachmentsUrls = attachmentsUrls || project.attachmentsUrls;
    project.categories = categories || project.categories;

    await project.save();
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Edit Project Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Delete a project and its files
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);
    const project = await Project.findById(id);

    if (!project || project.designerId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    project.attachmentsUrls.forEach((url) => {
      const filePath = path.join(__dirname, "..", "uploads", path.basename(url));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await project.deleteOne();
    res.status(200).json({ message: "Project and files deleted" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like/Unlike project
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    const index = project.likes.indexOf(userId);
    if (index !== -1) project.likes.splice(index, 1);
    else project.likes.push(userId);

    await project.save();
    res.status(200).json({ liked: index === -1, likesCount: project.likes.length });
  } catch (error) {
    console.error("Like Project Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;
    if (!content) return res.status(400).json({ message: "Content required" });

    const comment = new Comment({
      content,
      userId: req.user.userId,
      projectId: id
    });

    await comment.save();
    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.error("Comment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get comments
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId })
      .populate("userId", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Get Comments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search projects
exports.searchProjects = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query required" });

    const matchingUsers = await User.find({
      role: "designer",
      fullName: { $regex: query, $options: "i" }
    }).select("_id");

    const projects = await Project.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { categories: { $regex: query, $options: "i" } },
        { designerId: { $in: matchingUsers.map(u => u._id) } }
      ]
    }).populate("designerId", "fullName").sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get one project by ID (populate designerInfo.id → fullName)
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("designerInfo.id", "fullName");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ project });
  } catch (error) {
    console.error("Get Project Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
