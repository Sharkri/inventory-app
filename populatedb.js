#! /usr/bin/env node

require("dotenv").config();

const mongoose = require("mongoose");
const Item = require("./models/Item");
const Category = require("./models/Category");

const items = [];
const categories = [];

mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = process.env.DATABASE_URI;

const debug = console.log;

async function createCategory(name, description) {
  const category = new Category({
    name,
    description,
  });

  await category.save();
  categories.push(category);

  debug(`Added category: ${name}`);
}

async function createCategories() {
  debug("Adding categories");

  await Promise.all([
    createCategory("Category 1", "This is the first category."),
    createCategory("Category 2"),
    createCategory("Test", "Testeroni"),
  ]);
}

async function createItem(
  name,
  description,
  categoryArr,
  price,
  numberInStock
) {
  const item = new Item({
    name,
    description,
    categories: categoryArr,
    price,
    numberInStock,
  });

  await item.save();
  items.push(item);

  debug(`Added item: ${name}`);
}

async function createItems() {
  debug("Adding items");

  await Promise.all([
    createItem(
      "Item 1",
      "A meaningful description describing Item 1",
      [categories[0], categories[1]],
      { amount: 69 },
      3
    ),
    createItem(
      "Item 2",
      undefined,
      [categories[2]],
      { amount: 52.99, symbol: "£" },
      1
    ),
    createItem(
      "Item 3",
      undefined,
      undefined,
      { amount: 52.99, symbol: "£" },
      0
    ),
  ]);
}

async function main() {
  debug("Debug: About to connect");
  await mongoose.connect(mongoDB);

  debug("Debug: Should be connected?");

  await createCategories();
  await createItems();

  debug("Debug: Closing mongoose");

  mongoose.connection.close();
}

main().catch((err) => debug(err));
