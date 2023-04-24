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
