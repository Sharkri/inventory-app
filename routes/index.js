const express = require("express");
const {
  updateCategoryForm,
  addCategoryFormGET,
  addCategoryFormPOST,
} = require("../controllers/categoryController");
const {
  inventoryPage,
  itemPage,
  indexPage,
  addItemFormGET,
  addItemFormPOST,
  updateItemFormPOST,
  updateItemFormGET,
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", indexPage);
router.get("/inventory", inventoryPage);

router.get("/inventory/item/create", addItemFormGET);
router.post("/inventory/item/create", addItemFormPOST);

router.get("/inventory/category/create", addCategoryFormGET);
router.post("/inventory/category/create", addCategoryFormPOST);

router.get("/inventory/item/:id", itemPage);
router.get("/inventory/item/:id/update", updateItemFormGET);
router.post("/inventory/item/:id/update", updateItemFormPOST);

router.get("/inventory/category/:id/update", updateCategoryForm);

module.exports = router;
