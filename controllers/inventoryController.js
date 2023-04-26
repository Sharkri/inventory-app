const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
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

exports.itemPage = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement item page");
});

exports.addItemFormGET = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name").exec();

  res.render("create-item", {
    title: "Create Item",
    categories: allCategories,
  });
});

async function checkIfCategoriesExists(categories) {
  const categoryCount = await Category.countDocuments({
    _id: { $in: categories },
  });

  // if one or more categories were not found in the database
  if (categoryCount !== categories.length) {
    return Promise.reject();
  }

  return true;
}

exports.addItemFormPOST = [
  (req, res, next) => {
    req.body.categories = convertToArray(req.body.categories);
    next();
  },
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Name must be specified."),
  body("description").isString(),

  body("categories")
    .custom(checkIfCategoriesExists)
    .withMessage(
      "One or more categories do not exist. Please create them first."
    )
    .custom((array) => array.length <= 5)
    .withMessage("You can only have 5 categories max."),

  body("price").isFloat({ min: 0 }).withMessage("Please enter a valid price."),
  body("numberInStock")
    .isInt({ min: 0 })
    .withMessage("Please enter a valid stock number"),

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

      res.render("create-item", {
        title: "Create Item",
        name,
        description,
        // mark all categories that user selected
        categories: allCategories.map((category) =>
          categories.includes(category._id.toString())
            ? { name: category.name, _id: category._id, selected: "selected" }
            : category
        ),
        price,
        numberInStock,

        errors: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.updateItemForm = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement update item page");
});

exports.addCategoryFormGET = asyncHandler(async (req, res, next) => {
  res.render("create-category", { title: "Create Category" });
});

exports.addCategoryFormPOST = [
  body("name")
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Category name must be specified."),
  body("description").isString(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("create-category", {
        name: req.body.name,
        description: req.body.description,
        errors: errors.array(),
      });
      return;
    }

    const categoryExists = await Category.findOne(
      { name: req.body.name },
      "_id"
    )
      .collation({ locale: "en", strength: 2 })
      .exec();

    // if category already exists
    if (categoryExists) {
      res.redirect(categoryExists.url);
      return;
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    await category.save();
    res.redirect(category.url);
  }),
];

exports.updateCategoryForm = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement update category page");
});
