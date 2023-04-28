const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File format should be an image"), false);
    }
  },
});

const Category = require("../models/Category");
const Item = require("../models/Item");
const convertToArray = require("../helpers/convertToArray");
const { itemValidationRules } = require("../helpers/validation-rules");

exports.itemPage = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;

    next(err);
  }

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
  upload.single("image"),

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
      image: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : undefined,
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

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;

    next(err);
  }

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
  upload.single("image"),

  (req, res, next) => {
    req.body.categories = convertToArray(req.body.categories);
    next();
  },

  // Validate item fields
  ...itemValidationRules(),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const {
      name,
      description,
      categories,
      price,
      numberInStock,
      "clear-image": removeImage,
    } = req.body;

    const itemObj = {
      name,
      description,
      categories,
      price: { amount: price },
      numberInStock,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    };

    if (removeImage === "on") {
      itemObj.$unset = { image: "" };
    } else if (req.file) {
      itemObj.image = { data: req.file.buffer, contentType: req.file.mimetype };
    }

    const item = new Item(itemObj);

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
      await Item.findByIdAndUpdate(req.params.id, itemObj, {});
      res.redirect(item.url);
    }
  }),
];

exports.deleteItemFormGET = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id, "name");

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    next(err);
  }

  res.render("delete-item", { title: "Delete Item", item });
});

exports.deleteItemFormPOST = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.params.id);

  res.redirect("/inventory");
});
