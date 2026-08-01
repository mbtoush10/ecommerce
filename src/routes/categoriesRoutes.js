const express = require("express");
const { getCategories, getCategoryById, createCategory, updateCategory, deactivateCategory } = require("../controllers/categoriesController");

const router = express.Router();

router.get('/', getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.patch("/:id/deactivate", deactivateCategory);


module.exports = router;