const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define List model from schema
const ListSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, // reference to the user that created the list,
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }], // reference array to the users
});

module.exports = mongoose.model("List", ListSchema);
