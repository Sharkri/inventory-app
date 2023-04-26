const express = require("express");
const {
  inventoryPage,
  itemPage,
  indexPage,
  updateItemForm,
  addItemFormGET,
  addItemFormPOST,
  addCategoryFormGET,
  addCategoryFormPOST,
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", indexPage);
router.get("/inventory", inventoryPage);

router.get("/inventory/item/create", addItemFormGET);
router.post("/inventory/item/create", addItemFormPOST);

router.get("/inventory/category/create", addCategoryFormGET);
router.post("/inventory/category/create", addCategoryFormPOST);

router.get("/inventory/item/:id", itemPage);
router.get("/inventory/item/:id/update", updateItemForm);
router.get("/inventory/category/:id/update", updateItemForm);

module.exports = router;
