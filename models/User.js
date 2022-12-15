const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User model from Schema
const UserSchema = new Schema({
  googleID: { type: String, required: true },
  displayName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
  dateCreated: { type: Date, default: Date.now },
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/dashboard/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
