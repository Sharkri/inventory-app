const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const Item = require("../models/Item");
const convertToArray = require("../helpers/convertToArray");
const { itemValidationRules } = require("../helpers/validation-rules");

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

exports.itemPage = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  res.render("item-page", { title: "Item Page", item });
});

exports.addItemFormGET = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name").exec();

  res.render("item-form", {
    title: "Create Item",
    categories: allCategories,
    item: {},
  });
});

exports.addItemFormPOST = [
  (req, res, next) => {
    req.body.categories = convertToArray(req.body.categories);
    next();
  },
  // Validate item fields
  ...itemValidationRules(),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const { name, description, categories, price, numberInStock } = req.body;

    const item = new Item({
      name,
      description,
      categories,
      price: { amount: price },
      numberInStock,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, "name").exec();

      res.render("item-form", {
        title: "Create Item",
        item,
        // mark all categories that user selected
        categories: allCategories.map((category) =>
          categories.includes(category._id.toString())
            ? { name: category.name, _id: category._id, selected: "selected" }
            : category
        ),
        errors: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.updateItemFormGET = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id),
    Category.find({}, "name").exec(),
  ]);

  res.render("item-form", {
    title: "Update Item",
    categories: categories.map((category) =>
      item.categories.includes(category._id.toString())
        ? { name: category.name, _id: category._id, selected: "selected" }
        : category
    ),
    item,
  });
});

exports.updateItemFormPOST = [
  (req, res, next) => {
    req.body.categories = convertToArray(req.body.categories);
    next();
  },
  // Validate item fields
  ...itemValidationRules(),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const { name, description, categories, price, numberInStock } = req.body;

    const item = new Item({
      name,
      description,
      categories,
      price: { amount: price },
      numberInStock,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, "name").exec();

      res.render("item-form", {
        title: "Create Item",
        item,
        // mark all categories that user selected
        categories: allCategories.map((category) =>
          categories.includes(category._id.toString())
            ? { name: category.name, _id: category._id, selected: "selected" }
            : category
        ),
        errors: errors.array(),
      });
    } else {
      await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(item.url);
    }
  }),
];
