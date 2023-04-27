const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const Item = require("../models/Item");
const convertToArray = require("../helpers/convertToArray");
const { itemValidationRules } = require("../helpers/validation-rules");

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

exports.deleteItemFormGET = asyncHandler(async (req, res, next) => {
  res.render("delete-item", { title: "Delete Item" });
});

exports.deleteItemFormPOST = asyncHandler(async (req, res, next) => {});
