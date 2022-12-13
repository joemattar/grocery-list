const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Item model from Schema
const ItemSchema = new Schema({
  name: { type: String, required: true },
  list: { type: Schema.Types.ObjectId, ref: "List", required: true },
});

module.exports = mongoose.model("Item", ItemSchema);
