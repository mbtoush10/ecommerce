const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const authenticateToken = require("../middleware/authenticate");
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validate");

const router = express.Router();

const registerValidationRules = [
  body("full_name").notEmpty().withMessage("Full name is required").trim().escape(),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("phone").optional().trim().escape(),
];

const loginValidationRules = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidationRules, validateRequest, register);
router.post("/login", loginValidationRules, validateRequest, login);
router.get("/me", authenticateToken, getMe);

module.exports = router;