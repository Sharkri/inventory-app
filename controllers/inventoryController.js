const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const Item = require("../models/Item");

exports.indexPage = asyncHandler(async (req, res, next) => {
  const [itemCount, categoryCount] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", { title: "Inventory App", itemCount, categoryCount });
});

exports.inventoryPage = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement inventory page");
});

exports.itemPage = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement item page");
});

exports.addItemForm = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement add item page");
});

exports.updateItemForm = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement update item page");
});

exports.addCategoryForm = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement add category page");
});

exports.updateCategoryForm = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement update category page");
});
