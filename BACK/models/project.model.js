const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// (Optional) Your allowed categories array can stay here if you want

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  attachmentsUrls: { // unified field for images/videos
    type: [String],
    default: []
  },
  categories: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        const allowedCategories = [
          "UX/UI",
          "Web Design",
          "Logo Design",
          "3D Art",
          "Motion Graphics",
          "Illustration",
          "Branding",
          "Mobile App Design"
        ];
        return arr.every(category => allowedCategories.includes(category));
      },
      message: "Invalid category selected."
    }
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // NEW FIELD for likes
  designerInfo: {
    id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
