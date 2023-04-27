const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Category = require("../models/Category");

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
