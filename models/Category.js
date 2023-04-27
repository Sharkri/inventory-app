const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: {
      collation: { locale: "en", strength: 2 },
    },
  },
  description: { type: String },
});

CategorySchema.virtual("url").get(function getCategoryURL() {
  return `/inventory/category/${this._id}`;
});

// gets all items with category
CategorySchema.virtual("itemsURL").get(function getCategoryItemsURL() {
  return `/inventory?category=${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
