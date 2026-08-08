const express = require("express");
const { 
  getUsers, 
  getUserById, 
  updateUserStatus 
} = require("../controllers/usersController");
const authenticateToken = require("../middleware/authenticate"); 
const authorizeRoles = require("../middleware/authorize");
const { body, param } = require("express-validator");
const { validateRequest } = require("../middleware/validate");

const router = express.Router();

const userIdValidation = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid user ID")
];

const statusValidation = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid user ID"),
  body("is_active").isBoolean().withMessage("is_active boolean value is required")
];

router.get("/", authenticateToken, authorizeRoles("admin"), getUsers);
router.get("/:id", authenticateToken, userIdValidation, validateRequest, getUserById);
router.patch("/:id/status", authenticateToken, authorizeRoles("admin"), statusValidation, validateRequest, updateUserStatus);

module.exports = router;