const asyncHandler = require("express-async-handler");

exports.indexPage = asyncHandler(async (req, res, next) => {
  res.render("index", { title: "Inventory App" });
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
