const express = require("express");
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authenticateToken, authController.getUserProfile);
router.put("/profile", authenticateToken, authController.updateProfile);

module.exports = router;
