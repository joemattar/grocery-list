const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Invitation model from schema
const InvitationSchema = new Schema({
  // Reference to the list where the email/user was invited
  list: { type: Schema.Types.ObjectId, ref: "List", required: true },
  // Email address of the invitation
  email: { type: String, required: true },
});

// Virtual for list's URL
InvitationSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/dashboard/invitation/${this._id}`;
});

module.exports = mongoose.model("Invitation", InvitationSchema);
