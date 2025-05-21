const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Optional: define allowed skills here or import from external file
const allowedSkills = [
  "UI/UX",
  "Web Design",
  "Graphic Design",
  "3D Modeling",
  "Illustration",
  "Motion Graphics",
  "Logo Design",
  "Branding",
  "Figma",
  "Adobe XD",
  "Photoshop",
  "After Effects",
  "Canva"
];

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["client", "designer", "admin"],
    default: "client"
  },

  bio: {
    type: String,
    default: ""
  },

  skills: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return arr.every(skill => allowedSkills.includes(skill));
      },
      message: "Invalid skill provided. Please choose from the predefined list."
    }
  },

  links: {
    type: [String],
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
