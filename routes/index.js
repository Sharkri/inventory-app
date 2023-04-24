const express = require("express");
const {
  inventoryPage,
  itemPage,
  indexPage,
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", indexPage);
router.get("/inventory", inventoryPage);
router.get("/inventory/item/:id", itemPage);

module.exports = router;
