const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define List model from schema
const ListSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, // reference to the user that created the list,
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }], // reference array to the users
});

// Virtual for list's URL
ListSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/dashboard/list/${this._id}`;
});

module.exports = mongoose.model("List", ListSchema);
