const express = require("express");
const {
  addCategoryFormGET,
  addCategoryFormPOST,
  categoryPage,
  updateCategoryFormGET,
  updateCategoryFormPOST,
  deleteCategoryGET,
  deleteCategoryPOST,
  categoriesPage,
} = require("../controllers/categoryController");

const {
  inventoryPage,
  indexPage,
} = require("../controllers/inventoryController");

const {
  itemPage,
  addItemFormGET,
  addItemFormPOST,
  updateItemFormPOST,
  updateItemFormGET,
  deleteItemFormGET,
  deleteItemFormPOST,
} = require("../controllers/itemController");

const router = express.Router();

// INVENTORY CONTROLLERS
router.get("/", indexPage);
router.get("/inventory", inventoryPage);

// ITEM CONTROLLERS

router.get("/inventory/item/create", addItemFormGET);
router.post("/inventory/item/create", addItemFormPOST);

router.get("/inventory/item/:id/update", updateItemFormGET);
router.post("/inventory/item/:id/update", updateItemFormPOST);

router.get("/inventory/item/:id/delete", deleteItemFormGET);
router.post("/inventory/item/:id/delete", deleteItemFormPOST);

router.get("/inventory/item/:id", itemPage);

// CATEGORY CONTROLLERS
router.get("/inventory/categories", categoriesPage);

router.get("/inventory/category/create", addCategoryFormGET);
router.post("/inventory/category/create", addCategoryFormPOST);

router.get("/inventory/category/:id/update", updateCategoryFormGET);
router.post("/inventory/category/:id/update", updateCategoryFormPOST);

router.get("/inventory/category/:id/delete", deleteCategoryGET);
router.post("/inventory/category/:id/delete", deleteCategoryPOST);

router.get("/inventory/category/:id", categoryPage);

module.exports = router;
