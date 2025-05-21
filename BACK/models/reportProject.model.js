const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportProjectSchema = new Schema({
  reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReportProject", reportProjectSchema);
