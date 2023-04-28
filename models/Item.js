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
  categories: {
    type: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    validate: [
      (categories) => categories.length <= 5,
      "Categories cannot exceed 5",
    ],
    default: [],
  },
  numberInStock: { type: Number, required: true },
  image: {
    data: Buffer,
    contentType: String,
  },
});

ItemSchema.virtual("url").get(function getItemURL() {
  return `/inventory/item/${this._id}`;
});

ItemSchema.virtual("priceString").get(function getPriceString() {
  return this.price.symbol + this.price.amount;
});

ItemSchema.virtual("imageUrl").get(function getImageUrl() {
  if (!this.image.data) return "";

  return `data:${
    this.image.contentType
  };base64,${this.image.data.toString("base64")}`;
});

module.exports = mongoose.model("Item", ItemSchema);
