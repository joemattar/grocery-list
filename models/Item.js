const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Item model from Schema
const ItemSchema = new Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["to-do", "done"],
    default: true,
  },
  list: { type: Schema.Types.ObjectId, ref: "List", required: true },
});

// Virtual for item's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/dashboard/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
