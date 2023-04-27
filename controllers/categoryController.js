const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { categoryValidationRules } = require("../helpers/validation-rules");
const Category = require("../models/Category");
const Item = require("../models/Item");

exports.categoryPage = asyncHandler(async (req, res, next) => {
  const [category, numItems] = await Promise.all([
    Category.findById(req.params.id),
    Item.countDocuments({ categories: req.params.id }),
  ]);
  res.render("category-page", {
    title: "Category Page",
    category,
    numItems,
  });
});

exports.addCategoryFormGET = asyncHandler(async (req, res, next) => {
  res.render("category-form", { title: "Create Category", category: {} });
});

exports.addCategoryFormPOST = [
  ...categoryValidationRules(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category-form", {
        title: "Create Category",
        category,
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

    await category.save();
    res.redirect(category.url);
  }),
];

exports.updateCategoryFormGET = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    next(err);
  } else {
    res.render("category-form", { title: "Update Category", category });
  }
});

exports.updateCategoryFormPOST = [
  ...categoryValidationRules(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const updatedCategory = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    // perform a case-insensitive search
    const categoryExists = await Category.findOne(
      { name: req.body.name },
      "_id"
    )
      .collation({ locale: "en", strength: 2 })
      .exec();

    // checks if the category already exists AND the category is not itself
    const isCategoryNameTaken =
      categoryExists && req.params.id !== categoryExists._id.toString();

    if (!errors.isEmpty() || isCategoryNameTaken) {
      const errorsArray = errors.array();

      if (isCategoryNameTaken) {
        errorsArray.push({ msg: "Category name is already taken" });
      }

      res.render("category-form", {
        title: "Update Category",
        category: updatedCategory,
        errors: errorsArray,
      });
    } else {
      await Category.findByIdAndUpdate(req.params.id, updatedCategory, {});
      // redirect to the category url
      res.redirect(updatedCategory.url);
    }
  }),
];

exports.deleteCategoryGET = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id, "name").exec();
  const categoryItems = await Item.find(
    { categories: req.params.id },
    "name"
  ).exec();

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    next(err);
  } else {
    res.render("delete-category", {
      title: "Delete Category",
      category,
      categoryItems,
    });
  }
});

exports.deleteCategoryPOST = asyncHandler(async (req, res, next) => {
  await Item.deleteMany({ categories: req.params.id }).exec();
  await Category.findByIdAndRemove(req.params.id).exec();

  res.redirect("/inventory");
});
