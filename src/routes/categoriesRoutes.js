const express = require("express");
const { getCategories, getCategoryById, createCategory, updateCategory, deactivateCategory } = require("../controllers/categoriesController");
const authenticateToken = require("../middleware/authenticate");
const authorizeRoles = require("../middleware/authorize");
const { body, param } = require("express-validator");
const { validateRequest } = require("../middleware/validate");

const router = express.Router();

const categoryValidationRules = [
  body("name").notEmpty().withMessage("Category name is required").isLength({ max: 100 }).withMessage("Name must not exceed 100 characters").trim().escape(),
  body("description").optional().isLength({ max: 500 }).withMessage("Description must not exceed 500 characters").trim().escape(),
];

const categoryIdValidation = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid category ID"),
];

router.get("/", getCategories);
router.get("/:id", categoryIdValidation, validateRequest, getCategoryById);

router.post("/", authenticateToken, authorizeRoles("admin"), categoryValidationRules, validateRequest, createCategory);
router.put("/:id", authenticateToken, authorizeRoles("admin"), [...categoryIdValidation, ...categoryValidationRules], validateRequest, updateCategory);
router.patch("/:id/deactivate", authenticateToken, authorizeRoles("admin"), categoryIdValidation, validateRequest, deactivateCategory);

module.exports = router;