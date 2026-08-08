const express = require("express");
const { getProducts, getProductById, createProduct, updateProduct, deactivateProduct } = require("../controllers/productsController");
const authenticateToken = require("../middleware/authenticate"); 
const authorizeRoles = require("../middleware/authorize"); 
const { validateRequest, productValidationRules } = require("../middleware/validate");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", authenticateToken, authorizeRoles("admin"), productValidationRules, validateRequest, createProduct);
router.put("/:id", authenticateToken, authorizeRoles("admin"), productValidationRules, validateRequest, updateProduct);
router.patch("/:id/deactivate", authenticateToken, authorizeRoles("admin"), deactivateProduct);

module.exports = router;