const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportUserSchema = new Schema({
  reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reportedUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReportUser", reportUserSchema);
