const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Category = require("../models/Category");
const Item = require("../models/Item");

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
  const [items, categories] = await Promise.all([
    Item.find().populate("categories").exec(),
    Category.find().exec(),
  ]);

  res.render("inventory", { title: "Inventory", items, categories });
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

function convertToArray(value) {
  // if is undefined
  if (value === undefined) {
    return [];
  }

  // if is not an array
  if (!Array.isArray(value)) {
    return [value];
  }

  // else it is an array, no need to convert
  return value;
}

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
    ),

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

exports.addCategoryForm = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement add category page");
});

exports.updateCategoryForm = asyncHandler(async (req, res, next) => {
  res.send("TODO: Implement update category page");
});
