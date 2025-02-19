const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Student", "Instructor"], required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
