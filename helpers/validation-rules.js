const { body } = require("express-validator");
const Category = require("../models/Category");

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

exports.itemValidationRules = () => [
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
];

exports.categoryValidationRules = () => [
  body("name")
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Category name must be specified."),
  body("description").isString(),
];
