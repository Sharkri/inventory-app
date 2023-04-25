const express = require("express");
const {
  inventoryPage,
  itemPage,
  indexPage,
  addItemForm,
  updateItemForm,
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", indexPage);
router.get("/inventory", inventoryPage);
router.get("/inventory/item/:id", itemPage);
router.get("/inventory/item/create", addItemForm);
router.get("/inventory/item/:id/update", updateItemForm);
router.get("/inventory/category/:id/update", updateItemForm);

module.exports = router;
