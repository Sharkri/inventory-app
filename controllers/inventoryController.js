const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const Item = require("../models/Item");
const convertToArray = require("../helpers/convertToArray");

exports.indexPage = asyncHandler(async (req, res, next) => {
  const [itemCount, categoryCount] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Inventory Homepage",
    itemCount,
    categoryCount,
  });
});

exports.inventoryPage = asyncHandler(async (req, res, next) => {
  const selectedCategories = convertToArray(req.query.category);

  const itemQuery = {};

  // if selected categories exists, search for all items with selected categories
  if (selectedCategories.length) {
    itemQuery.categories = { $all: selectedCategories };
  }

  const [items, allCategories] = await Promise.all([
    Item.find(itemQuery).populate("categories").exec(),
    Category.find().exec(),
  ]);

  res.render("inventory", {
    title: "Inventory",
    items,
    // check all categories selected
    categories: selectedCategories.length
      ? allCategories.map((category) => {
          // if category is selected, set checked to true
          if (selectedCategories.includes(category._id.toString())) {
            return Object.assign(category, { checked: true });
          }

          return category;
        })
      : allCategories,

    hasFilterApplied: !!selectedCategories.length,
  });
});

exports.searchGET = asyncHandler(async (req, res, next) => {
  const query = req.query.q;

  if (!query) {
    res.redirect("/");
    return;
  }

  const items = await Item.search(query).exec();

  res.render("search-page", {
    title: `Showing results for "${query}"`,
    items,
  });
});
