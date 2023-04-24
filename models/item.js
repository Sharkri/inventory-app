const mongoose = require("mongoose");

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: {
    type: {
      symbol: { type: String, default: "$" },
      amount: { type: Number, required: true },
    },
    required: true,
  },
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  numberInStock: { type: Number, required: true },
});

ItemSchema.virtual("url").get(function getItemURL() {
  return `/inventory/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
